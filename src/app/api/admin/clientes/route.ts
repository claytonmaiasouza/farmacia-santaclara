import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const rows = await sql`
    SELECT
      u.id, u.email, u.full_name AS name, u.phone, u.created_at,
      COUNT(o.id)::int AS total_orders,
      'site' AS source
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.is_admin = FALSE
    GROUP BY u.id

    UNION ALL

    SELECT
      wc.id, wc.email, wc.name, wc.phone, wc.created_at,
      COUNT(o.id)::int AS total_orders,
      'whatsapp' AS source
    FROM whatsapp_contacts wc
    LEFT JOIN orders o ON o.customer_phone = wc.phone
    GROUP BY wc.id

    ORDER BY created_at DESC
  `;

  return NextResponse.json(rows);
}
