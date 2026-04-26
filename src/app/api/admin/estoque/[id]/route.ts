import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const { id } = await params;
  const { stock, min_stock } = await req.json();

  const [row] = await sql`
    UPDATE products
    SET
      stock     = COALESCE(${stock     ?? null}, stock),
      min_stock = COALESCE(${min_stock ?? null}, min_stock),
      updated_at = now()
    WHERE id = ${id}
    RETURNING id, stock, min_stock
  `;

  if (!row) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  return NextResponse.json(row);
}
