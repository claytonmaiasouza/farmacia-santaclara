import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return !!session?.user?.isAdmin;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const [updated] = await sql`
    UPDATE coupons SET
      active = COALESCE(${body.active ?? null}, active),
      description = COALESCE(${body.description ?? null}, description),
      max_uses = COALESCE(${body.max_uses ?? null}, max_uses),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await sql`DELETE FROM coupons WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
