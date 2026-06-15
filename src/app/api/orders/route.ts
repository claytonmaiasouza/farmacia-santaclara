import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/mailer";
import { sendMessage } from "@/lib/whatsapp/evolution";

export async function POST(req: NextRequest) {
  try {
    const { items, form, subtotal, shipping, discount, total, delivery, payment, coupon_code, coupon_id, utm_source, utm_medium, utm_campaign } = await req.json();
    const session = await getServerSession(authOptions);
    let userId: string | null = null;
    if (session?.user?.id) {
      const [u] = await sql`SELECT id FROM users WHERE id = ${session.user.id} LIMIT 1`;
      userId = u?.id ?? null;
    }

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

    const result = await sql.begin(async (tx) => {
      const [order] = await tx`
        INSERT INTO orders (
          status, subtotal, shipping, discount, total,
          payment_method, delivery_type, shipping_address, notes,
          customer_email, coupon_code, coupon_id,
          utm_source, utm_medium, utm_campaign, user_id
        ) VALUES (
          'pending', ${subtotal}, ${shipping ?? 0}, ${discount ?? 0}, ${total},
          ${payment}, ${delivery},
          ${shippingAddress ? tx.json(shippingAddress) : null},
          ${delivery === "pickup" ? "Retirada no balcão — Ciudad del Este" : null},
          ${form.email ?? null},
          ${coupon_code ?? null},
          ${coupon_id ?? null},
          ${utm_source ?? null},
          ${utm_medium ?? null},
          ${utm_campaign ?? null},
          ${userId}
        )
        RETURNING id
      `;

      await tx`
        INSERT INTO order_items ${tx(
          items.map((item: { id?: string; name: string; image: string; price: number; quantity: number }) => ({
            order_id: order.id,
            product_id: item.id ?? null,
            product_name: item.name,
            product_image: item.image ?? null,
            quantity: item.quantity,
            unit_price: Number(item.price),
            total_price: Number(item.price) * item.quantity,
          }))
        )}
      `;

      if (coupon_id) {
        await tx`UPDATE coupons SET usage_count = usage_count + 1, updated_at = now() WHERE id = ${coupon_id}`;
      }

      // Debit stock for each item that has a linked product
      for (const item of items as { id?: string; quantity: number }[]) {
        if (item.id) {
          await tx`
            UPDATE products SET stock = GREATEST(0, stock - ${item.quantity}), updated_at = now()
            WHERE id = ${item.id}
          `;
        }
      }

      return order;
    });

    const paymentMethods = await sql`SELECT type, label, key_value, holder, bank, agency, account FROM payment_methods WHERE active = true ORDER BY id LIMIT 5`;
    const deliveryLabel = delivery === "pickup"
      ? "Retirada no balcão — Ciudad del Este"
      : `Entrega em ${[form.street, form.number, form.complement].filter(Boolean).join(", ")} — ${form.city}`;

    const orderItems = items.map((i: { name: string; price: number; quantity: number }) => ({
      name: i.name,
      quantity: i.quantity,
      price: Number(i.price),
    }));

    if (form.email) {
      sendOrderConfirmationEmail({
        to: form.email,
        customerName: form.name,
        orderId: result.id,
        items: orderItems,
        total,
        delivery: deliveryLabel,
        paymentMethods,
      }).catch((err) => console.error("[Orders API] email cliente error:", err));
    }

    const code = result.id.slice(0, 8).toUpperCase();
    const itemsText = orderItems.map((i: { name: string; quantity: number; price: number }) => `• ${i.name} x${i.quantity} — R$ ${(i.price * i.quantity).toFixed(2).replace(".", ",")}`).join("\n");
    const adminWaText = `🛒 *Novo Pedido #${code}*\n\n👤 *Cliente:* ${form.name}\n📞 *Contato:* ${form.phone ?? form.email ?? "não informado"}\n\n${itemsText}\n\n💰 *Total:* R$ ${total.toFixed(2).replace(".", ",")}\n📦 *Entrega:* ${deliveryLabel}`;

    sendNewOrderAdminEmail({
      orderId: result.id,
      channel: "site",
      customerName: form.name,
      customerContact: form.phone ?? form.email ?? "não informado",
      items: orderItems,
      total,
      tipoEntrega: delivery === "pickup" ? "retirada" : "entrega",
      enderecoEntrega: delivery !== "pickup" ? deliveryLabel : undefined,
    }).catch((err) => console.error("[Orders API] email admin error:", err));

    sendMessage("595992959689", adminWaText)
      .catch((err) => console.error("[Orders API] whatsapp admin error:", err));

    return NextResponse.json({ id: result.id });
  } catch (err) {
    console.error("[Orders API]", err);
    return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
  }
}
