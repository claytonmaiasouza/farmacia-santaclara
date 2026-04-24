import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const { id } = await params;
  const body = await req.json();

  if (typeof body.active === "boolean") {
    const [row] = await sql`UPDATE payment_methods SET active = ${body.active} WHERE id = ${id} RETURNING *`;
    return NextResponse.json(row);
  }

  return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const { id } = await params;
  await sql`DELETE FROM payment_methods WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
