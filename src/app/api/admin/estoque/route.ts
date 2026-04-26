import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.image_url,
      p.price,
      p.cost_price,
      p.stock,
      p.min_stock,
      p.active,
      p.sku,
      COALESCE(SUM(oi.quantity), 0)::int        AS units_sold,
      COALESCE(SUM(oi.total_price), 0)::numeric AS revenue,
      COUNT(DISTINCT oi.order_id)::int          AS order_count
    FROM products p
    LEFT JOIN order_items oi ON oi.product_id = p.id
    WHERE p.active = true
    GROUP BY p.id
    ORDER BY units_sold DESC, p.name ASC
  `;

  return NextResponse.json(rows);
}
