import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

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

    const result = await sql.begin(async (tx) => {
      const [order] = await tx`
        INSERT INTO orders (
          status, subtotal, shipping, discount, total,
          payment_method, delivery_type, shipping_address, notes,
          customer_email
        ) VALUES (
          'pending', ${subtotal}, ${shipping}, 0, ${total},
          ${payment}, ${delivery},
          ${shippingAddress ? tx.json(shippingAddress) : null},
          ${delivery === "pickup" ? "Retirada no balcão — Cidade del Este" : null},
          ${form.email ?? null}
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

      return order;
    });

    return NextResponse.json({ id: result.id });
  } catch (err) {
    console.error("[Orders API]", err);
    return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
  }
}
