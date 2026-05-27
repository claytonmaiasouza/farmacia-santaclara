import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const rows = await sql`SELECT key, title, subtitle, badge FROM carousel_settings ORDER BY key`;
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { key, title, subtitle, badge } = await req.json();
  if (!key || !title) return NextResponse.json({ error: "key e title são obrigatórios" }, { status: 400 });

  await sql`
    UPDATE carousel_settings
    SET title = ${title}, subtitle = ${subtitle ?? null}, badge = ${badge ?? null}
    WHERE key = ${key}
  `;
  return NextResponse.json({ ok: true });
}
