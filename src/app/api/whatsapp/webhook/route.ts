import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSession, addMessage, clearSession } from "@/lib/whatsapp/session";
import { generateReply, OrderData } from "@/lib/whatsapp/claude";
import { sendMessage } from "@/lib/whatsapp/evolution";

const HUMAN_KEYWORDS = ["humano", "atendente", "falar com pessoa", "quero falar com alguém"];
const CLEAR_KEYWORDS = ["reiniciar", "recomeçar", "nova conversa"];

async function tryParseAndSaveOrder(phone: string, text: string): Promise<boolean> {
  if (!text.includes("Novo Pedido — Farmácia Santa Clara")) return false;

  try {
    const nameMatch = text.match(/\*Cliente:\*\s*(.+)/);
    const phoneMatch = text.match(/\*Telefone:\*\s*(.+)/);
    const emailMatch = text.match(/\*E-mail:\*\s*(.+)/);
    const entregaMatch = text.match(/\*Entrega:\*\s*(.+)/);
    const totalMatch = text.match(/\*Total:\*\s*R\$\s*([\d,.]+)/);
    const subtotalMatch = text.match(/\*Subtotal:\*\s*R\$\s*([\d,.]+)/);
    const freteMatch = text.match(/\*Frete:\*\s*(.+)/);

    const customerName = nameMatch?.[1]?.trim() ?? phone;
    const customerPhone = phoneMatch?.[1]?.trim() ?? phone;
    const customerEmail = emailMatch?.[1]?.trim() ?? null;
    const entregaLine = entregaMatch?.[1]?.trim() ?? "";
    const isPickup = entregaLine.toLowerCase().includes("retirada");
    const total = parseFloat((totalMatch?.[1] ?? "0").replace(".", "").replace(",", "."));
    const subtotal = parseFloat((subtotalMatch?.[1] ?? "0").replace(".", "").replace(",", "."));
    const freteLine = freteMatch?.[1]?.trim() ?? "";
    const shipping = freteLine.toLowerCase().includes("grátis") || freteLine.toLowerCase().includes("retirada")
      ? 0
      : parseFloat((freteLine.match(/[\d,.]+/)?.[0] ?? "0").replace(".", "").replace(",", "."));

    const itemLines = text.match(/^• .+$/gm) ?? [];
    const items = itemLines.map((line) => {
      const m = line.match(/^• (.+?) x(\d+) — R\$ ([\d,.]+)$/);
      if (!m) return null;
      const totalPrice = parseFloat(m[3].replace(".", "").replace(",", "."));
      const qty = parseInt(m[2]);
      return {
        product_name: m[1].trim(),
        product_image: null as string | null,
        quantity: qty,
        unit_price: qty > 0 ? totalPrice / qty : 0,
        total_price: totalPrice,
      };
    }).filter(Boolean);

    let shippingAddress = null;
    if (!isPickup && entregaLine.includes("Entrega —")) {
      const addr = entregaLine.replace("Entrega —", "").trim();
      shippingAddress = { name: customerName, street: addr, number: "", complement: "", neighborhood: "", city: "", state: "", zip_code: "", phone: customerPhone };
    }

    const [order] = await sql`
      INSERT INTO orders (status, subtotal, shipping, discount, total, payment_method, shipping_address, notes, customer_name, customer_phone, customer_email)
      VALUES ('pending', ${subtotal}, ${shipping}, 0, ${total}, 'whatsapp', ${shippingAddress ? JSON.stringify(shippingAddress) : null},
        ${`Pedido via WhatsApp — ${customerPhone}`}, ${customerName}, ${customerPhone}, ${customerEmail})
      RETURNING id
    `;

    if (order && items.length > 0) {
      await sql`INSERT INTO order_items ${sql(items.map((item) => ({ order_id: order.id, ...item! })))}`;
    }

    await sql`DELETE FROM chat_sessions WHERE session_id = ${phone}`;
    console.log(`[Webhook] Pedido salvo: ${order?.id} — ${customerName}`);
  } catch (err) {
    console.error("[Webhook] Erro ao parsear pedido:", err);
  }

  return true;
}

async function saveConversationOrder(phone: string, order: OrderData) {
  try {
    const resolvedItems = await Promise.all(
      order.items.map(async (item) => {
        const rows = await sql`
          SELECT price, name FROM products
          WHERE name ILIKE ${"%" + item.product_name + "%"} AND active = true
          LIMIT 1
        `;
        const product = rows[0];
        const unit_price = product ? Number(product.price) : (item.unit_price ?? 0);
        return {
          product_name: product?.name ?? item.product_name,
          quantity: item.quantity,
          unit_price,
          total_price: unit_price * item.quantity,
        };
      })
    );

    const subtotal = resolvedItems.reduce((s, i) => s + i.total_price, 0);
    const shipping = order.delivery_type === "pickup" ? 0 : subtotal * 0.35;
    const total = subtotal + shipping;

    const shippingAddress = order.delivery_type === "delivery" ? {
      name: order.customer_name, street: order.street ?? "", number: "", complement: "",
      neighborhood: "", city: order.city ?? "", state: order.state ?? "", zip_code: "", phone,
    } : null;

    const [saved] = await sql`
      INSERT INTO orders (status, subtotal, shipping, discount, total, payment_method, shipping_address, notes, customer_name, customer_phone)
      VALUES ('pending', ${subtotal}, ${shipping}, 0, ${total}, 'whatsapp', ${shippingAddress ? JSON.stringify(shippingAddress) : null},
        ${order.notes ?? `Pedido via WhatsApp — ${phone}`}, ${order.customer_name}, ${phone})
      RETURNING id
    `;

    if (saved) {
      await sql`INSERT INTO order_items ${sql(resolvedItems.map((item) => ({ order_id: saved.id, ...item })))}`;
    }

    console.log(`[Webhook] Pedido de conversa salvo: ${saved?.id} — ${order.customer_name}`);
  } catch (err) {
    console.error("[Webhook] saveConversationOrder:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventName: string = (body.event ?? "").toLowerCase().replace(/_/g, ".");
    if (eventName !== "messages.upsert") return NextResponse.json({ ok: true });

    // Evolution v2 pode enviar data como array ou objeto
    const rawData = body.data;
    const msg = Array.isArray(rawData) ? rawData[0] : rawData;
    if (!msg || msg.key?.fromMe) return NextResponse.json({ ok: true });

    const phone: string = msg.key?.remoteJid?.replace("@s.whatsapp.net", "").replace("@g.us", "") ?? "";
    const text: string = msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? "";
    if (!phone || !text || msg.key?.remoteJid?.endsWith("@g.us")) return NextResponse.json({ ok: true });

    console.log(`[Webhook] Mensagem de ${phone}: ${text.slice(0, 50)}`);

    const lower = text.toLowerCase().trim();

    if (CLEAR_KEYWORDS.some((k) => lower.includes(k))) {
      await clearSession(phone);
      await sendMessage(phone, "Conversa reiniciada! Como posso te ajudar? 😊");
      return NextResponse.json({ ok: true });
    }

    if (HUMAN_KEYWORDS.some((k) => lower.includes(k))) {
      await sendMessage(phone, "Certo! Vou transferir você para um de nossos atendentes agora. Por favor, aguarde um momento. 🙏");
      return NextResponse.json({ ok: true });
    }

    const isCheckoutOrder = await tryParseAndSaveOrder(phone, text);
    if (isCheckoutOrder) return NextResponse.json({ ok: true });

    const rawHistory = await getSession(phone);
    const history = rawHistory.filter((m) => !m.content?.includes("Novo Pedido — Farmácia Santa Clara"));
    const { reply, order } = await generateReply(history, text);

    if (order) {
      await saveConversationOrder(phone, order);
      await clearSession(phone);
    }

    await addMessage(phone, { role: "user", content: text }, "whatsapp");
    await addMessage(phone, { role: "assistant", content: reply }, "whatsapp");
    await sendMessage(phone, reply);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Webhook WhatsApp]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "webhook ativo" });
}
