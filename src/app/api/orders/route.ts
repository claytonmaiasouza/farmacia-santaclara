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

    // Resolve product IDs against the DB (cart may have stale UUIDs)
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

    return NextResponse.json({ id: result.id });
  } catch (err) {
    console.error("[Orders API]", err);
    return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
  }
}
