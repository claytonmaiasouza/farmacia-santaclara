import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import sql from "@/lib/db";
import { sendMessage } from "@/lib/whatsapp/evolution";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }
  const { id } = await params;
  const { texto } = await req.json();
  if (!texto?.trim()) return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });

  const rows = await sql`
    SELECT session_id FROM chat_sessions WHERE session_id = ${id} AND channel = 'whatsapp' LIMIT 1
  `;
  if (!rows[0]) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });

  await sendMessage(id, texto.trim());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newMsg = sql.json([{ role: "assistant", content: `[admin] ${texto.trim()}` }] as any);
  await sql`
    UPDATE chat_sessions
    SET messages = messages || ${newMsg}, updated_at = now()
    WHERE session_id = ${id} AND channel = 'whatsapp'
  `;

  return NextResponse.json({ ok: true });
}
