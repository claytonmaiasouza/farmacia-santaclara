import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await sql`
    ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS bot_pausado BOOLEAN DEFAULT FALSE
  `;

  const rows = await sql`
    UPDATE chat_sessions
    SET bot_pausado = NOT COALESCE(bot_pausado, FALSE)
    WHERE session_id = ${id} AND channel = 'whatsapp'
    RETURNING bot_pausado
  `;

  if (!rows[0]) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json({ bot_pausado: rows[0].bot_pausado });
}
