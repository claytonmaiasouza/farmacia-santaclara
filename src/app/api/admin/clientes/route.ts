import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const rows = await sql`
    SELECT
      u.id, u.email, u.full_name, u.phone, u.cpf, u.birth_date,
      u.created_at,
      COUNT(o.id)::int AS total_orders
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.is_admin = FALSE
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;

  return NextResponse.json(rows);
}
