import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession, addMessage, clearSession } from "@/lib/whatsapp/session";
import { generateReply, SessionContext, CarrinhoItem, PedidoResumo } from "@/lib/whatsapp/claude";
import { sendMessage, sendCatalog, sendContact } from "@/lib/whatsapp/evolution";
import { getSetting } from "@/lib/settings";
import { sendNewOrderAdminEmail } from "@/lib/mailer";

const HUMAN_KEYWORDS = ["humano", "atendente", "falar com pessoa", "quero falar com alguém"];
const CLEAR_KEYWORDS = ["reiniciar", "recomeçar", "nova conversa"];

async function ensureContextColumn() {
  await sql`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'::jsonb`;
  await sql`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS last_user_msg_at TIMESTAMPTZ`;
  await sql`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS follow_up_sent BOOLEAN DEFAULT FALSE`;
}

async function getSessionContext(phone: string): Promise<SessionContext> {
  const rows = await sql`
    SELECT context FROM chat_sessions
    WHERE session_id = ${phone} AND channel = 'whatsapp' LIMIT 1
  `;
  const ctx = rows[0]?.context as SessionContext | undefined;
  return {
    estado: ctx?.estado || "INICIO",
    carrinho: ctx?.carrinho || [],
    nomeCliente: ctx?.nomeCliente || "",
    emailCliente: ctx?.emailCliente || "",
    tipoEntrega: ctx?.tipoEntrega,
    enderecoEntrega: ctx?.enderecoEntrega || "",
  };
}

async function saveContext(phone: string, context: SessionContext) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await sql`
    UPDATE chat_sessions
    SET context = ${sql.json(context as any)}
    WHERE session_id = ${phone} AND channel = 'whatsapp'
  `;
}

async function getOrdersByPhone(phone: string): Promise<PedidoResumo[]> {
  const digits = phone.replace(/\D/g, "").slice(-10);
  const rows = await sql`
    SELECT
      o.id, o.status, o.total, o.created_at,
      COALESCE(
        json_agg(json_build_object('name', oi.product_name, 'quantity', oi.quantity))
        FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.shipping_address->>'phone' LIKE ${'%' + digits}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 5
  `;
  return rows as PedidoResumo[];
}

async function upsertContact(phone: string, name: string, email: string) {
  try {
    await sql`
      INSERT INTO whatsapp_contacts (phone, name, email)
      VALUES (${phone}, ${name || null}, ${email || null})
      ON CONFLICT (phone) DO UPDATE
        SET name = COALESCE(EXCLUDED.name, whatsapp_contacts.name),
            email = COALESCE(EXCLUDED.email, whatsapp_contacts.email),
            updated_at = now()
    `;
  } catch (err) {
    console.error("[Webhook] Erro ao salvar contato:", err);
  }
}

async function saveOrder(
  phone: string,
  nomeCliente: string,
  emailCliente: string,
  carrinho: CarrinhoItem[],
  tipoEntrega: "delivery" | "retirada",
  enderecoEntrega: string
): Promise<string | null> {
  try {
    const resolvedItems = await Promise.all(
      carrinho.map(async (item) => {
        const rows = await sql`
          SELECT id, price, name FROM products
          WHERE name ILIKE ${"%" + item.nome + "%"} AND active = true
          LIMIT 1
        `;
        const product = rows[0];
        const unitPrice = product ? Number(product.price) : item.preco;
        return {
          product_id: product?.id ?? null,
          product_name: product?.name ?? item.nome,
          quantity: item.quantidade,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantidade,
        };
      })
    );

    const subtotal = resolvedItems.reduce((s, i) => s + i.total_price, 0);
    const shipping = 0;
    const total = subtotal;

    const shippingAddress =
      tipoEntrega === "delivery" && enderecoEntrega
        ? {
            name: nomeCliente,
            street: enderecoEntrega,
            number: "",
            complement: "",
            neighborhood: "",
            city: "Ciudad del Este",
            state: "PY",
            zip_code: "",
            phone,
          }
        : null;

    // Vincula ao user_id se o email já estiver cadastrado
    let userId: string | null = null;
    if (emailCliente) {
      const userRow = await sql`SELECT id FROM users WHERE email = ${emailCliente} LIMIT 1`;
      userId = userRow[0]?.id ?? null;
    }

    const notesText = tipoEntrega === "retirada"
      ? "Retirada no balcão — Ciudad del Este"
      : `Pedido via WhatsApp — ${phone}`;

    const [saved] = await sql`
      INSERT INTO orders (
        status, subtotal, shipping, discount, total,
        payment_method, shipping_address, notes,
        customer_name, customer_email, customer_phone, user_id
      )
      VALUES (
        'pending', ${subtotal}, ${shipping}, 0, ${total},
        'whatsapp',
        ${shippingAddress ? sql.json(shippingAddress as never) : null},
        ${notesText},
        ${nomeCliente || phone}, ${emailCliente || null}, ${phone}, ${userId}
      )
      RETURNING id
    `;

    if (saved && resolvedItems.length > 0) {
      await sql`INSERT INTO order_items ${sql(
        resolvedItems.map((item) => ({ order_id: saved.id, ...item }))
      )}`;

      // Debit stock for each resolved product
      for (const item of resolvedItems) {
        if (item.product_id) {
          await sql`
            UPDATE products SET stock = GREATEST(0, stock - ${item.quantity}), updated_at = now()
            WHERE id = ${item.product_id}
          `;
        }
      }
    }

    console.log(`[Webhook] Pedido salvo: ${saved?.id} — ${nomeCliente}`);
    return saved?.id ?? null;
  } catch (err) {
    console.error("[Webhook] Erro ao salvar pedido:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureContextColumn();

    const body = await req.json();
    console.log("[Webhook] evento:", body.event, "| chaves:", Object.keys(body).join(", "));
    const eventName: string = (body.event ?? "").toLowerCase().replace(/_/g, ".");
    if (eventName !== "messages.upsert") return NextResponse.json({ ok: true });

    const rawData = body.data;
    const msg = Array.isArray(rawData) ? rawData[0] : rawData;
    if (!msg || msg.key?.fromMe) return NextResponse.json({ ok: true });

    const remoteJid: string = msg.key?.remoteJid ?? "";
    // sendTo: full JID (incluindo @lid) para Evolution API repassar corretamente
    const sendTo: string = remoteJid;
    // phone: número limpo para DB/sessões (strip @s.whatsapp.net, @g.us, @lid)
    const phone: string = remoteJid
      .replace(/@s\.whatsapp\.net$/, "")
      .replace(/@g\.us$/, "")
      .replace(/@lid$/, "");

    const text: string =
      msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? "";
    if (!phone || !text || remoteJid.endsWith("@g.us"))
      return NextResponse.json({ ok: true });

    console.log(`[Webhook] Mensagem de ${phone}: ${text.slice(0, 60)}`);

    const lower = text.toLowerCase().trim();

    if (CLEAR_KEYWORDS.some((k) => lower.includes(k))) {
      await clearSession(phone);
      await sendMessage(sendTo, "Conversa reiniciada! Como posso te ajudar? 😊");
      return NextResponse.json({ ok: true });
    }

    if (HUMAN_KEYWORDS.some((k) => lower.includes(k))) {
      await sendMessage(
        sendTo,
        "Certo! Vou te transferir para um de nossos atendentes agora. Por favor, aguarde um momento. 🙏"
      );
      return NextResponse.json({ ok: true });
    }

    // Verifica se o bot está pausado
    console.log(`[Webhook] verificando bot_pausado para ${phone}`);
    const sessionRows = await sql`
      SELECT COALESCE(bot_pausado, FALSE) AS bot_pausado
      FROM chat_sessions WHERE session_id = ${phone} AND channel = 'whatsapp' LIMIT 1
    `;
    if (sessionRows[0]?.bot_pausado) {
      await addMessage(phone, { role: "user", content: text }, "whatsapp");
      console.log(`[Webhook] Bot pausado para ${phone} — mensagem salva sem resposta`);
      return NextResponse.json({ ok: true });
    }

    // Lê histórico e contexto
    console.log(`[Webhook] buscando histórico para ${phone}`);
    const history = await getSession(phone);
    console.log(`[Webhook] histórico: ${history.length} msgs`);
    const context = await getSessionContext(phone);
    context.pedidosCliente = await getOrdersByPhone(phone);
    console.log(`[Webhook] contexto estado: ${context.estado} | pedidos: ${context.pedidosCliente.length}`);

    const cleanHistory = history.filter(
      (m) => !m.content?.includes("Novo Pedido — Farmácia Santa Clara") &&
             !m.content?.startsWith("[admin]")
    );

    console.log(`[Webhook] chamando generateReply`);
    const result = await generateReply(cleanHistory, text, context);
    console.log(`[Webhook] reply gerado: ${result.reply.slice(0, 50)}`);

    // Merge defensivo do carrinho: se o bot retornou menos itens do que havia
    // sem o cliente pedir remoção explícita, preserva itens anteriores não mencionados
    const REMOVE_KEYWORDS = ["remove", "tira", "cancela", "sem ", "não quero", "desisti"];
    const clientePediuRemocao = REMOVE_KEYWORDS.some((k) => lower.includes(k));

    let carrinhoFinal = result.carrinhoAtualizado;
    if (!clientePediuRemocao && result.carrinhoAtualizado.length < context.carrinho.length) {
      // Bot perdeu itens do carrinho — mescla: mantém antigos + aplica novos por cima
      const nomesNovos = new Set(result.carrinhoAtualizado.map((i) => i.nome.toLowerCase()));
      const itensPreservados = context.carrinho.filter(
        (i) => !nomesNovos.has(i.nome.toLowerCase())
      );
      carrinhoFinal = [...itensPreservados, ...result.carrinhoAtualizado];
      console.log(`[Webhook] Merge defensivo do carrinho para ${phone}: ${itensPreservados.length} item(ns) recuperado(s)`);
    }

    // Salva mensagens
    await addMessage(phone, { role: "user", content: text }, "whatsapp");
    await sql`
      UPDATE chat_sessions SET last_user_msg_at = now(), follow_up_sent = false
      WHERE session_id = ${phone} AND channel = 'whatsapp'
    `;
    await addMessage(phone, { role: "assistant", content: result.reply }, "whatsapp");

    // Atualiza contexto da sessão
    const novoContext: SessionContext = {
      estado: result.novoEstado,
      carrinho: carrinhoFinal,
      nomeCliente: result.nomeCliente || context.nomeCliente || "",
      emailCliente: result.emailCliente || context.emailCliente || "",
      tipoEntrega: result.tipoEntrega,
      enderecoEntrega: result.enderecoEntrega || context.enderecoEntrega || "",
    };
    await saveContext(phone, novoContext);

    // Envia resposta ao cliente
    console.log(`[Webhook] enviando mensagem para ${sendTo}`);
    await sendMessage(sendTo, result.reply);
    console.log(`[Webhook] mensagem enviada`);

    // Envia catálogo se solicitado
    if (result.enviarCatalogo) await sendCatalog(sendTo);

    // Envia contato de atacado se solicitado
    if (result.enviarContatoAtacado) {
      const numeroAtacado = (await getSetting<string>("whatsapp_atacado_numero")) ?? "+595985254396";
      await sendContact(sendTo, "Atendente Santa Clara", numeroAtacado);
    }

    // Salva pedido quando completo
    if (result.pedidoPronto && carrinhoFinal.length > 0) {
      const nomeF = result.nomeCliente || context.nomeCliente || phone;
      const emailF = result.emailCliente || context.emailCliente || "";
      const tipoF = result.tipoEntrega;
      const enderecoF = result.enderecoEntrega || context.enderecoEntrega || "";
      const orderId = await saveOrder(phone, nomeF, emailF, carrinhoFinal, tipoF, enderecoF);
      await upsertContact(phone, nomeF, emailF);
      await clearSession(phone);
      if (orderId) {
        const orderTotal = carrinhoFinal.reduce((s, i) => s + i.preco * i.quantidade, 0);
        const code = orderId.slice(0, 8).toUpperCase();
        const itemsText = carrinhoFinal.map((i) => `• ${i.nome} x${i.quantidade} — R$ ${(i.preco * i.quantidade).toFixed(2).replace(".", ",")}`).join("\n");
        const entregaLabel = tipoF === "retirada" ? "Retirada no balcão — Ciudad del Este" : `Entrega: ${enderecoF}`;

        sendNewOrderAdminEmail({
          orderId,
          channel: "whatsapp",
          customerName: nomeF,
          customerContact: emailF || phone,
          items: carrinhoFinal.map((i) => ({ name: i.nome, quantity: i.quantidade, price: i.preco })),
          total: orderTotal,
          tipoEntrega: tipoF,
          enderecoEntrega: enderecoF,
        }).catch((err) => console.error("[Webhook] Admin email error:", err));

        sendMessage("595992959689", `🛒 *Novo Pedido #${code}* (WhatsApp)\n\n👤 *Cliente:* ${nomeF}\n📞 *WhatsApp:* ${phone}\n\n${itemsText}\n\n💰 *Total:* R$ ${orderTotal.toFixed(2).replace(".", ",")}\n📦 *Entrega:* ${entregaLabel}`)
          .catch((err) => console.error("[Webhook] Admin WhatsApp error:", err));
      }
      console.log(`[Webhook] Pedido finalizado para ${phone}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Webhook WhatsApp]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "webhook ativo" });
}
