import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Código inválido" }, { status: 400 });

  const [coupon] = await sql`
    SELECT id, code, description, discount_type, discount_value, usage_count, max_uses, expires_at
    FROM coupons
    WHERE code = ${code.toUpperCase().trim()} AND active = true
    LIMIT 1
  `;

  if (!coupon) return NextResponse.json({ error: "Cupom não encontrado ou inativo" }, { status: 404 });
  if (coupon.max_uses !== null && coupon.usage_count >= coupon.max_uses)
    return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });

  return NextResponse.json(coupon);
}
