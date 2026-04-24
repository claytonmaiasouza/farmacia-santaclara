import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await sql`
    SELECT id, session_id, messages, started_at, closed_at, total_messages
    FROM conversation_history
    ORDER BY closed_at DESC
    LIMIT 500
  `;

  const historico = rows.map((r) => {
    const msgs = (r.messages as { role: string; content: string }[]) ?? [];
    const last = msgs[msgs.length - 1];
    return {
      id: r.id as string,
      phone: r.session_id as string,
      started_at: r.started_at,
      closed_at: r.closed_at,
      total_messages: r.total_messages ?? msgs.length,
      last_message: last ? { role: last.role, content: last.content } : null,
    };
  });

  return NextResponse.json(historico);
}
