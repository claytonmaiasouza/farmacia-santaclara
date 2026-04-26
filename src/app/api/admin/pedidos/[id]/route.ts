import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";
import { sendPaymentConfirmedEmail, sendStatusUpdateEmail } from "@/lib/mailer";

const VALID_STATUS = ["pending","proof_received","paid","processing","shipped","delivered","cancelled","refunded"];
const STATUS_EMAIL_TRIGGER = new Set(["paid","processing","shipped","delivered","cancelled","refunded"]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  // Fetch current status before updating to detect transitions
  const [current] = await sql`SELECT status FROM orders WHERE id = ${id} LIMIT 1`;
  const oldStatus = current?.status as string | undefined;

  await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;

  const wasCancelled = oldStatus === "cancelled";
  const isCancelled  = status === "cancelled";

  if (!wasCancelled && isCancelled) {
    // Active → Cancelled: restore stock
    await sql`
      UPDATE products p
      SET stock = p.stock + oi.quantity, updated_at = now()
      FROM order_items oi
      WHERE oi.order_id = ${id} AND oi.product_id IS NOT NULL AND oi.product_id = p.id
    `;
  } else if (wasCancelled && !isCancelled) {
    // Cancelled → Active: deduct stock again
    await sql`
      UPDATE products p
      SET stock = GREATEST(0, p.stock - oi.quantity), updated_at = now()
      FROM order_items oi
      WHERE oi.order_id = ${id} AND oi.product_id IS NOT NULL AND oi.product_id = p.id
    `;
  }

  if (STATUS_EMAIL_TRIGGER.has(status)) {
    const rows = await sql`
      SELECT customer_email, customer_name, total FROM orders WHERE id = ${id} LIMIT 1
    `;
    const order = rows[0];

    if (order?.customer_email) {
      const emailParams = {
        to: order.customer_email as string,
        customerName: (order.customer_name as string) ?? "Cliente",
        orderId: id,
        total: Number(order.total),
      };

      if (status === "paid") {
        sendPaymentConfirmedEmail(emailParams).catch((e) => console.error("[Mailer paid]", e));
      } else {
        sendStatusUpdateEmail({ ...emailParams, status }).catch((e) => console.error("[Mailer status]", e));
      }
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }
  const { id } = await params;
  await sql`DELETE FROM orders WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
