import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const body = await req.json();
  const [product] = await sql`
    INSERT INTO products ${sql(body)}
    RETURNING *
  `;
  return NextResponse.json(product, { status: 201 });
}
