import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) return false;
  return true;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const coupons = await sql`
    SELECT id, code, description, discount_type, discount_value, active,
           usage_count, max_uses, expires_at, created_at
    FROM coupons ORDER BY created_at DESC
  `;
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code, description, discount_type, discount_value, max_uses, expires_at } = await req.json();
  if (!code) return NextResponse.json({ error: "Código obrigatório" }, { status: 400 });

  const [coupon] = await sql`
    INSERT INTO coupons (code, description, discount_type, discount_value, max_uses, expires_at)
    VALUES (
      ${code.toUpperCase().trim()},
      ${description || null},
      ${discount_type || "tracking"},
      ${Number(discount_value) || 0},
      ${max_uses ? Number(max_uses) : null},
      ${expires_at || null}
    )
    RETURNING *
  `;
  return NextResponse.json(coupon, { status: 201 });
}
