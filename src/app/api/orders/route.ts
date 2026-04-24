import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

interface PaymentMethod {
  type: string;
  label: string;
  key_value: string;
  holder: string | null;
  bank: string | null;
  agency: string | null;
  account: string | null;
}

function buildPaymentLines(methods: PaymentMethod[]): string[] {
  if (methods.length === 0) {
    return [`🏦 Chave Pix: \`XXXXXXXXXXX\``];
  }
  const lines: string[] = [];
  for (const m of methods) {
    if (m.type === "pix") {
      lines.push(`💳 *${m.label}* — Chave Pix: \`${m.key_value}\``);
      if (m.holder) lines.push(`   Titular: ${m.holder}`);
    } else {
      lines.push(`🏦 *${m.label}*`);
      if (m.bank) lines.push(`   Banco: ${m.bank}`);
      if (m.agency) lines.push(`   Agência: ${m.agency}`);
      if (m.account) lines.push(`   Conta: ${m.account}`);
      if (m.key_value) lines.push(`   Pix: \`${m.key_value}\``);
      if (m.holder) lines.push(`   Titular: ${m.holder}`);
    }
  }
  return lines;
}

async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    return await sql`SELECT * FROM payment_methods WHERE active = TRUE ORDER BY created_at ASC` as PaymentMethod[];
  } catch { return []; }
}

async function notifyCustomerWhatsApp(phone: string, name: string, orderId: string, total: number, items: { name: string; quantity: number }[], paymentMethods: PaymentMethod[]) {
  const evoUrl = process.env.EVOLUTION_API_URL;
  const evoKey = process.env.EVOLUTION_API_KEY;
  const evoInstance = process.env.EVOLUTION_INSTANCE;
  if (!evoUrl || !evoKey || !evoInstance || !phone) return;

  const code = orderId.slice(0, 8).toUpperCase();
  const cleanPhone = phone.replace(/\D/g, "");
  const itemsList = items.map((i) => `• ${i.name} x${i.quantity}`).join("\n");

  const paymentLines = buildPaymentLines(paymentMethods);

  const text = [
    `*Farmácia Santa Clara — Pedido Confirmado!* ✅`,
    ``,
    `Olá, ${name}! Recebemos seu pedido *#${code}*.`,
    ``,
    `*Para finalizar, realize o pagamento:*`,
    ...paymentLines,
    ``,
    `*Após o pagamento, envie o comprovante para:*`,
    `📧 pagamentos@santaclarafarma.com.py`,
    ``,
    `*No assunto do e-mail, coloque:*`,
    `📋 Comprovante #${code}`,
    ``,
    `*Itens:*`,
    itemsList,
    ``,
    `*Total: R$ ${total.toFixed(2).replace(".", ",")}*`,
    ``,
    `Assim que confirmarmos o pagamento, seu pedido entra em preparo! 🚀`,
  ].join("\n");

  try {
    await fetch(`${evoUrl}/message/sendText/${evoInstance}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: evoKey },
      body: JSON.stringify({ number: cleanPhone, text }),
    });
  } catch {
    // notificação em segundo plano, não bloqueia o pedido
  }
}

export async function POST(req: NextRequest) {
  try {
    const { items, form, subtotal, shipping, total, delivery, payment } = await req.json();

    if (!items?.length || !form?.name || !payment) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const shippingAddress = delivery === "delivery" ? {
      name: form.name,
      street: form.street ?? "",
      number: form.number ?? "",
      complement: form.complement ?? "",
      city: form.city ?? "",
      state: form.state ?? "",
      phone: form.phone ?? "",
    } : null;

    const slugs = items.map((i: { slug?: string }) => i.slug).filter(Boolean);
    const dbProducts = slugs.length
      ? await sql`SELECT id, slug FROM products WHERE slug = ANY(${slugs})`
      : [];
    const slugToId = Object.fromEntries(dbProducts.map((p: { id: string; slug: string }) => [p.slug, p.id]));

    const result = await sql.begin(async (tx) => {
      const [order] = await tx`
        INSERT INTO orders (
          status, subtotal, shipping, discount, total,
          payment_method, shipping_address, notes,
          customer_name, customer_phone, customer_email
        ) VALUES (
          'pending', ${subtotal}, ${shipping}, 0, ${total},
          ${payment}, ${shippingAddress ? tx.json(shippingAddress) : null},
          ${delivery === "pickup" ? "Retirada no balcão — Cidade del Este" : null},
          ${form.name}, ${form.phone ?? null}, ${form.email ?? null}
        )
        RETURNING id
      `;

      await tx`
        INSERT INTO order_items ${tx(
          items.map((item: { slug?: string; name: string; image: string; price: number; quantity: number }) => ({
            order_id: order.id,
            product_id: (item.slug && slugToId[item.slug]) ? slugToId[item.slug] : null,
            product_name: item.name,
            product_image: item.image,
            quantity: item.quantity,
            unit_price: Number(item.price),
            total_price: Number(item.price) * item.quantity,
          }))
        )}
      `;

      return order;
    });

    const paymentMethods = await fetchPaymentMethods();

    notifyCustomerWhatsApp(
      form.phone ?? "",
      form.name,
      result.id,
      total,
      items.map((i: { name: string; quantity: number }) => ({ name: i.name, quantity: i.quantity })),
      paymentMethods
    );

    if (form.email) {
      const deliveryLabel = delivery === "pickup"
        ? "Retirada no balcão — Cidade del Este"
        : `${form.street}, ${form.number}${form.complement ? ` (${form.complement})` : ""}, ${form.city}/${form.state}`;

      sendOrderConfirmationEmail({
        to: form.email,
        customerName: form.name,
        orderId: result.id,
        items: items.map((i: { name: string; quantity: number; price: number }) => ({
          name: i.name,
          quantity: i.quantity,
          price: Number(i.price),
        })),
        total,
        delivery: deliveryLabel,
        paymentMethods,
      }).catch((err) => console.error("[Mailer]", err));
    }

    return NextResponse.json({ id: result.id });
  } catch (err) {
    console.error("[Orders API]", err);
    return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
  }
}
