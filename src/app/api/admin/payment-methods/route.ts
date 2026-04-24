import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS payment_methods (
      id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      type        TEXT NOT NULL,
      label       TEXT NOT NULL,
      key_value   TEXT NOT NULL,
      holder      TEXT,
      bank        TEXT,
      agency      TEXT,
      account     TEXT,
      active      BOOLEAN DEFAULT TRUE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }
  await ensureTable();
  const rows = await sql`SELECT * FROM payment_methods ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }
  await ensureTable();

  const body = await req.json();
  const { type, label, key_value, holder, bank, agency, account } = body;

  if (!type || !label || !key_value) {
    return NextResponse.json({ error: "Campos obrigatórios: tipo, label, chave/conta" }, { status: 400 });
  }

  const [row] = await sql`
    INSERT INTO payment_methods (type, label, key_value, holder, bank, agency, account)
    VALUES (${type}, ${label}, ${key_value}, ${holder ?? null}, ${bank ?? null}, ${agency ?? null}, ${account ?? null})
    RETURNING *
  `;

  return NextResponse.json(row, { status: 201 });
}
