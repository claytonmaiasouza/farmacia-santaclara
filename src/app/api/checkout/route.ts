import { NextRequest, NextResponse } from "next/server";
import MercadoPago, { Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/context/CartContext";
import type { ShippingAddress, Order } from "@/types/database";

const client = new MercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, form, total, shipping } = body as {
      items: CartItem[];
      form: {
        name: string;
        email: string;
        phone: string;
        cpf: string;
        zip_code: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
      };
      total: number;
      shipping: number;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    // Salva pedido no Supabase (status pending)
    const supabase = await createClient();
    const shippingAddress: ShippingAddress = {
      name: form.name,
      street: form.street,
      number: form.number,
      complement: form.complement,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
      zip_code: form.zip_code,
      phone: form.phone,
    };

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        status: "pending",
        subtotal,
        shipping,
        discount: 0,
        total,
        payment_method: "mercadopago",
        shipping_address: shippingAddress,
      })
      .select()
      .single() as { data: Order | null; error: unknown };

    if (orderError || !order) {
      console.error("Order error:", orderError);
      return NextResponse.json({ error: "Erro ao salvar pedido" }, { status: 500 });
    }

    // Salva itens do pedido
    await db.from("order_items").insert(
      items.map((item: CartItem) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))
    );

    // Cria preferência no MercadoPago
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        external_reference: order.id,
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "BRL",
          picture_url: item.image.startsWith("http") ? item.image : undefined,
        })),
        payer: {
          name: form.name.split(" ")[0],
          surname: form.name.split(" ").slice(1).join(" "),
          email: form.email,
          phone: { number: form.phone.replace(/\D/g, "") },
          identification: { type: "CPF", number: form.cpf.replace(/\D/g, "") },
          address: {
            zip_code: form.zip_code.replace(/\D/g, ""),
            street_name: form.street,
            street_number: form.number,
          },
        },
        shipments: {
          cost: shipping,
          receiver_address: {
            zip_code: form.zip_code.replace(/\D/g, ""),
            street_name: form.street,
            street_number: form.number,
            floor: form.complement ?? "",
            apartment: "",
          },
        },
        back_urls: {
          success: `${baseUrl}/pedido/confirmacao?status=success&order=${order.id}`,
          failure: `${baseUrl}/pedido/confirmacao?status=failure&order=${order.id}`,
          pending: `${baseUrl}/pedido/confirmacao?status=pending&order=${order.id}`,
        },
        auto_return: "approved",
        statement_descriptor: "FARMACIA SANTA CLARA",
      },
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
