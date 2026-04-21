import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

const VALID_STATUS = ["pending","paid","processing","shipped","delivered","cancelled","refunded"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
