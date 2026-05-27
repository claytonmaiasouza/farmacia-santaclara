import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key       TEXT PRIMARY KEY,
      value     JSONB NOT NULL DEFAULT 'null'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
}

function isAdmin(session: unknown): boolean {
  const s = session as { user?: { isAdmin?: boolean } } | null;
  return !!(s?.user?.isAdmin);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  await ensureTable();
  const rows = await sql`SELECT key, value FROM site_settings ORDER BY key`;
  const settings: Record<string, unknown> = {};
  for (const row of rows) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  await ensureTable();
  const body = await req.json() as Record<string, unknown>;
  for (const [key, value] of Object.entries(body)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${key}, ${sql.json(value as never)})
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = now()
    `;
  }
  return NextResponse.json({ ok: true });
}
