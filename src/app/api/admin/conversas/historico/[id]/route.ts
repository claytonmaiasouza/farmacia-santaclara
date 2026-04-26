import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }
  const { id } = await params;
  const rows = await sql`
    SELECT session_id, messages, started_at, closed_at, total_messages
    FROM conversation_history
    WHERE id = ${id}
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
    started_at: rows[0].started_at,
    closed_at: rows[0].closed_at,
    total_messages: rows[0].total_messages,
  });
}
