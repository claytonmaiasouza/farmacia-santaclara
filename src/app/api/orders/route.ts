import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      neighborhood: "",
      city: form.city ?? "",
      state: form.state ?? "",
      zip_code: "",
      phone: form.phone ?? "",
    } : null;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        status: "pending",
        subtotal,
        shipping,
        discount: 0,
        total,
        payment_method: payment,
        delivery_type: delivery,
        customer_email: form.email || null,
        shipping_address: shippingAddress,
        notes: delivery === "pickup" ? "Retirada no balcão — Cidade del Este" : null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("[Orders API] order error:", orderError);
      return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item: { id: string; name: string; image: string; price: number; quantity: number }) => ({
        order_id: order.id,
        product_id: item.id || null,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: Number(item.price),
        total_price: Number(item.price) * item.quantity,
      }))
    );

    if (itemsError) {
      console.error("[Orders API] items error:", itemsError);
    }

    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("[Orders API]", err);
    return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
  }
}
