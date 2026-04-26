import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const [order] = await sql`
    SELECT status FROM orders WHERE id = ${id} AND user_id = ${session.user.id} LIMIT 1
  `;
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });

  return NextResponse.json({ status: order.status });
}

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  const [order] = await sql`
    SELECT status FROM orders WHERE id = ${id} AND user_id = ${session.user.id} LIMIT 1
  `;
  if (!order) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  if (order.status !== "pending") {
    return NextResponse.json({ error: "Apenas pedidos aguardando pagamento podem ser cancelados." }, { status: 422 });
  }

  await sql`UPDATE orders SET status = 'cancelled'::order_status WHERE id = ${id}`;

  await sql`
    UPDATE products p
    SET stock = p.stock + oi.quantity, updated_at = now()
    FROM order_items oi
    WHERE oi.order_id = ${id} AND oi.product_id IS NOT NULL AND oi.product_id = p.id
  `;

  return NextResponse.json({ ok: true });
}
