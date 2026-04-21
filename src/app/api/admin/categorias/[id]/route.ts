import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const { id } = await params;
  const body = await req.json();
  const [category] = await sql`UPDATE categories SET ${sql(body)} WHERE id = ${id} RETURNING *`;
  return NextResponse.json(category);
}
