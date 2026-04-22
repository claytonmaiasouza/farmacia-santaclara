import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await sql`
    SELECT session_id, channel, messages, updated_at
    FROM chat_sessions
    WHERE channel = 'whatsapp'
    ORDER BY updated_at DESC
    LIMIT 100
  `;

  const conversas = rows.map((r) => {
    const msgs = (r.messages as { role: string; content: string }[]) ?? [];
    const last = msgs[msgs.length - 1];
    return {
      id: r.session_id as string,
      phone: r.session_id as string,
      updated_at: r.updated_at,
      total_messages: msgs.length,
      last_message: last ? { role: last.role, content: last.content } : null,
    };
  });

  return NextResponse.json(conversas);
}
