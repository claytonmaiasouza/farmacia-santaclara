import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession, addMessage, clearSession } from "@/lib/whatsapp/session";
import { generateReply, SessionContext, CarrinhoItem, PedidoResumo } from "@/lib/whatsapp/claude";

export const dynamic = "force-dynamic";

const CLEAR_KEYWORDS = ["reiniciar", "recomeçar", "nova conversa"];
const REMOVE_KEYWORDS = ["remove", "tira", "cancela", "sem ", "não quero", "desisti"];

async function ensureContextColumn() {
  await sql`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS context JSONB DEFAULT '{}'::jsonb`;
}

async function getSiteContext(sessionId: string): Promise<SessionContext> {
  const rows = await sql`
    SELECT context FROM chat_sessions
    WHERE session_id = ${sessionId} AND channel = 'site' LIMIT 1
  `;
  const ctx = rows[0]?.context as SessionContext | undefined;
  return {
    estado: ctx?.estado || "INICIO",
    carrinho: (ctx?.carrinho as CarrinhoItem[]) || [],
    nomeCliente: ctx?.nomeCliente || "",
    tipoEntrega: ctx?.tipoEntrega,
    enderecoEntrega: ctx?.enderecoEntrega || "",
    clienteLogado: ctx?.clienteLogado,
    clienteEmail: ctx?.clienteEmail,
    clienteId: ctx?.clienteId,
  };
}

async function saveSiteContext(sessionId: string, context: SessionContext) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await sql`
    UPDATE chat_sessions
    SET context = ${sql.json(context as any)}, updated_at = now()
    WHERE session_id = ${sessionId} AND channel = 'site'
  `;
}

async function getOrdersByUser(userId: string): Promise<PedidoResumo[]> {
  const rows = await sql`
    SELECT
      o.id, o.status, o.total, o.created_at,
      COALESCE(
        json_agg(json_build_object('name', oi.product_name, 'quantity', oi.quantity))
        FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ${userId}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 5
  `;
  return rows as PedidoResumo[];
}

async function saveOrder(
  sessionId: string,
  nomeCliente: string,
  carrinho: CarrinhoItem[],
  tipoEntrega: "delivery" | "retirada",
  enderecoEntrega: string,
  userId?: string | null,
  customerEmail?: string | null,
) {
  try {
    const resolvedItems = await Promise.all(
      carrinho.map(async (item) => {
        const rows = await sql`
          SELECT id, price, name FROM products
          WHERE name ILIKE ${"%" + item.nome + "%"} AND active = true LIMIT 1
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
    const total = subtotal;

    const shippingAddress =
      tipoEntrega === "delivery" && enderecoEntrega
        ? { name: nomeCliente, street: enderecoEntrega, city: "Ciudad del Este", state: "PY" }
        : null;

    const [saved] = await sql`
      INSERT INTO orders (
        status, subtotal, shipping, discount, total,
        payment_method, shipping_address, notes,
        customer_name, customer_email, user_id
      ) VALUES (
        'pending'::order_status, ${subtotal}, 0, 0, ${total},
        'site_chat',
        ${shippingAddress ? JSON.stringify(shippingAddress) : null},
        ${tipoEntrega === "retirada" ? "Retirada no balcão — Ciudad del Este" : null},
        ${nomeCliente || "Cliente Web"},
        ${customerEmail ?? null},
        ${userId ?? null}
      )
      RETURNING id
    `;

    if (saved && resolvedItems.length > 0) {
      await sql`INSERT INTO order_items ${sql(
        resolvedItems.map((item) => ({ order_id: saved.id, ...item }))
      )}`;

      for (const item of resolvedItems) {
        if (item.product_id) {
          await sql`
            UPDATE products SET stock = GREATEST(0, stock - ${item.quantity}), updated_at = now()
            WHERE id = ${item.product_id}
          `;
        }
      }
    }

    console.log(`[Chat] Pedido salvo: ${saved?.id} — ${nomeCliente}`);
  } catch (err) {
    console.error("[Chat] Erro ao salvar pedido:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureContextColumn();

    const { message, sessionId, userId, userName, userEmail } = await req.json();
    if (!message || !sessionId) {
      return NextResponse.json({ reply: "Mensagem inválida." }, { status: 400 });
    }

    const lower = message.toLowerCase().trim();

    if (CLEAR_KEYWORDS.some((k) => lower.includes(k))) {
      await clearSession(sessionId);
      return NextResponse.json({ reply: "Conversa reiniciada! Como posso te ajudar? 😊" });
    }

    const [history, context] = await Promise.all([
      getSession(sessionId, "site"),
      getSiteContext(sessionId),
    ]);

    // Enriquece contexto com dados do usuário logado
    if (userId) {
      context.clienteLogado = true;
      context.clienteId = userId;
      context.clienteEmail = userEmail ?? context.clienteEmail;
      if (!context.nomeCliente && userName) context.nomeCliente = userName;
      context.pedidosCliente = await getOrdersByUser(userId);
    }

    const result = await generateReply(history, message, context);

    // Merge defensivo: preserva itens do carrinho se IA retornou menos sem o cliente pedir
    let carrinhoFinal = result.carrinhoAtualizado;
    const clientePediuRemocao = REMOVE_KEYWORDS.some((k) => lower.includes(k));
    if (!clientePediuRemocao && result.carrinhoAtualizado.length < context.carrinho.length) {
      const nomesNovos = new Set(result.carrinhoAtualizado.map((i) => i.nome.toLowerCase()));
      const itensPreservados = context.carrinho.filter((i) => !nomesNovos.has(i.nome.toLowerCase()));
      carrinhoFinal = [...itensPreservados, ...result.carrinhoAtualizado];
    }

    await addMessage(sessionId, { role: "user", content: message }, "site");
    await addMessage(sessionId, { role: "assistant", content: result.reply }, "site");

    const novoContext: SessionContext = {
      estado: result.novoEstado,
      carrinho: carrinhoFinal,
      nomeCliente: result.nomeCliente || context.nomeCliente || "",
      tipoEntrega: result.tipoEntrega,
      enderecoEntrega: result.enderecoEntrega || context.enderecoEntrega || "",
      clienteLogado: context.clienteLogado,
      clienteEmail: context.clienteEmail,
      clienteId: context.clienteId,
    };
    await saveSiteContext(sessionId, novoContext);

    if (result.pedidoPronto && carrinhoFinal.length > 0) {
      await saveOrder(
        sessionId,
        result.nomeCliente || context.nomeCliente || userName || "Cliente Web",
        carrinhoFinal,
        result.tipoEntrega,
        result.enderecoEntrega || context.enderecoEntrega || "",
        userId ?? null,
        userEmail ?? context.clienteEmail ?? null,
      );
      await clearSession(sessionId);
    }

    return NextResponse.json({ reply: result.reply });
  } catch (err) {
    console.error("[Chat API]", err);
    return NextResponse.json({ reply: "Ocorreu um erro. Tente novamente." }, { status: 500 });
  }
}
