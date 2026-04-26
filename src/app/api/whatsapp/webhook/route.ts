import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession, addMessage, clearSession } from "@/lib/whatsapp/session";
import { generateReply, SessionContext, CarrinhoItem, PedidoResumo } from "@/lib/whatsapp/claude";
import { sendMessage, sendCatalog } from "@/lib/whatsapp/evolution";

const HUMAN_KEYWORDS = ["humano", "atendente", "falar com pessoa", "quero falar com alguém"];
const CLEAR_KEYWORDS = ["reiniciar", "recomeçar", "nova conversa"];

async function ensureContextColumn() {
  await sql`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'::jsonb`;
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

async function saveOrder(
  phone: string,
  nomeCliente: string,
  carrinho: CarrinhoItem[],
  tipoEntrega: "delivery" | "retirada",
  enderecoEntrega: string
) {
  try {
    const resolvedItems = await Promise.all(
      carrinho.map(async (item) => {
        const rows = await sql`
          SELECT price, name FROM products
          WHERE name ILIKE ${"%" + item.nome + "%"} AND active = true
          LIMIT 1
        `;
        const product = rows[0];
        const unitPrice = product ? Number(product.price) : item.preco;
        return {
          product_name: product?.name ?? item.nome,
          quantity: item.quantidade,
          unit_price: unitPrice,
          total_price: unitPrice * item.quantidade,
        };
      })
    );

    const subtotal = resolvedItems.reduce((s, i) => s + i.total_price, 0);
    const shipping = 0; // frete já incluso nos preços
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

    const [saved] = await sql`
      INSERT INTO orders (
        status, subtotal, shipping, discount, total,
        payment_method, shipping_address, notes,
        customer_name, customer_phone
      )
      VALUES (
        'pending', ${subtotal}, ${shipping}, 0, ${total},
        'whatsapp',
        ${shippingAddress ? JSON.stringify(shippingAddress) : null},
        ${`Pedido via WhatsApp — ${phone}`},
        ${nomeCliente || phone}, ${phone}
      )
      RETURNING id
    `;

    if (saved && resolvedItems.length > 0) {
      await sql`INSERT INTO order_items ${sql(
        resolvedItems.map((item) => ({ order_id: saved.id, ...item }))
      )}`;
    }

    console.log(`[Webhook] Pedido salvo: ${saved?.id} — ${nomeCliente}`);
  } catch (err) {
    console.error("[Webhook] Erro ao salvar pedido:", err);
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

    const phone: string =
      msg.key?.remoteJid?.replace("@s.whatsapp.net", "").replace("@g.us", "") ?? "";
    const text: string =
      msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? "";
    if (!phone || !text || msg.key?.remoteJid?.endsWith("@g.us"))
      return NextResponse.json({ ok: true });

    console.log(`[Webhook] Mensagem de ${phone}: ${text.slice(0, 60)}`);

    const lower = text.toLowerCase().trim();

    if (CLEAR_KEYWORDS.some((k) => lower.includes(k))) {
      await clearSession(phone);
      await sendMessage(phone, "Conversa reiniciada! Como posso te ajudar? 😊");
      return NextResponse.json({ ok: true });
    }

    if (HUMAN_KEYWORDS.some((k) => lower.includes(k))) {
      await sendMessage(
        phone,
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
    await addMessage(phone, { role: "assistant", content: result.reply }, "whatsapp");

    // Atualiza contexto da sessão
    const novoContext: SessionContext = {
      estado: result.novoEstado,
      carrinho: carrinhoFinal,
      nomeCliente: result.nomeCliente || context.nomeCliente || "",
      tipoEntrega: result.tipoEntrega,
      enderecoEntrega: result.enderecoEntrega || context.enderecoEntrega || "",
    };
    await saveContext(phone, novoContext);

    // Envia resposta ao cliente
    console.log(`[Webhook] enviando mensagem para ${phone}`);
    await sendMessage(phone, result.reply);
    console.log(`[Webhook] mensagem enviada`);

    // Envia catálogo se solicitado
    if (result.enviarCatalogo) await sendCatalog(phone);

    // Salva pedido quando completo
    if (result.pedidoPronto && carrinhoFinal.length > 0) {
      await saveOrder(
        phone,
        result.nomeCliente || context.nomeCliente || phone,
        carrinhoFinal,
        result.tipoEntrega,
        result.enderecoEntrega || context.enderecoEntrega || ""
      );
      await clearSession(phone);
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
