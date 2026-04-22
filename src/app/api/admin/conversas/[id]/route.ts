import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`
    SELECT session_id, messages, updated_at, COALESCE(bot_pausado, FALSE) AS bot_pausado
    FROM chat_sessions
    WHERE session_id = ${id} AND channel = 'whatsapp'
    LIMIT 1
  `;
  if (!rows[0]) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  const rawMessages = rows[0].messages as unknown[];
  const messages = rawMessages.flatMap((m) => {
    if (typeof m === "string") {
      try { return JSON.parse(m) as { role: string; content: string }[]; } catch { return []; }
    }
    return m as { role: string; content: string };
  });

  return NextResponse.json({
    phone: rows[0].session_id,
    messages,
    updated_at: rows[0].updated_at,
    bot_pausado: rows[0].bot_pausado,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM chat_sessions WHERE session_id = ${id} AND channel = 'whatsapp'`;
  return NextResponse.json({ ok: true });
}
