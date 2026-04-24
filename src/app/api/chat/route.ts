import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession, addMessage, clearSession } from "@/lib/whatsapp/session";
import { generateReply, SessionContext, CarrinhoItem } from "@/lib/whatsapp/claude";

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

async function saveOrder(
  sessionId: string,
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
          WHERE name ILIKE ${"%" + item.nome + "%"} AND active = true LIMIT 1
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
    const shipping = tipoEntrega === "retirada" ? 0 : subtotal * 0.35;
    const total = subtotal + shipping;

    const [saved] = await sql`
      INSERT INTO orders (
        status, subtotal, shipping, discount, total,
        payment_method, notes, customer_name
      )
      VALUES (
        'pending', ${subtotal}, ${shipping}, 0, ${total},
        'site_chat',
        ${`Pedido via Chat do Site — sessão ${sessionId}`},
        ${nomeCliente || "Cliente Web"}
      )
      RETURNING id
    `;

    if (saved && resolvedItems.length > 0) {
      await sql`INSERT INTO order_items ${sql(
        resolvedItems.map((item) => ({ order_id: saved.id, ...item }))
      )}`;
    }

    console.log(`[Chat] Pedido salvo: ${saved?.id} — ${nomeCliente}`);
  } catch (err) {
    console.error("[Chat] Erro ao salvar pedido:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureContextColumn();

    const { message, sessionId } = await req.json();
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
    };
    await saveSiteContext(sessionId, novoContext);

    if (result.pedidoPronto && carrinhoFinal.length > 0) {
      await saveOrder(
        sessionId,
        result.nomeCliente || context.nomeCliente || "Cliente Web",
        carrinhoFinal,
        result.tipoEntrega,
        result.enderecoEntrega || context.enderecoEntrega || ""
      );
      await clearSession(sessionId);
    }

    return NextResponse.json({ reply: result.reply });
  } catch (err) {
    console.error("[Chat API]", err);
    return NextResponse.json({ reply: "Ocorreu um erro. Tente novamente." }, { status: 500 });
  }
}
