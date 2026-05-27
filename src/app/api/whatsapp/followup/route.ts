import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { sendMessage } from "@/lib/whatsapp/evolution";
import { getSetting } from "@/lib/settings";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ativo = await getSetting<boolean>("followup_ativo");
  if (!ativo) return NextResponse.json({ ok: true, skipped: "disabled" });

  const minutos = (await getSetting<number>("followup_minutos")) ?? 5;
  const mensagem = (await getSetting<string>("followup_mensagem")) ??
    "Olá! Ainda está por aí? 😊 Posso continuar te ajudando com seu pedido na Farmácia Santa Clara!";

  const cutoffMin = new Date(Date.now() - Number(minutos) * 60 * 1000).toISOString();
  const cutoffMax = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const sessions = await sql`
    SELECT session_id
    FROM chat_sessions
    WHERE channel = 'whatsapp'
      AND COALESCE(bot_pausado, false) = false
      AND COALESCE(follow_up_sent, false) = false
      AND last_user_msg_at IS NOT NULL
      AND last_user_msg_at < ${cutoffMin}
      AND last_user_msg_at > ${cutoffMax}
      AND context->>'estado' IS NOT NULL
      AND context->>'estado' NOT IN ('INICIO', 'FINALIZADO', '')
  `;

  let sent = 0;
  for (const session of sessions) {
    try {
      // Claim the row first to avoid double-send if cron overlaps
      const claimed = await sql`
        UPDATE chat_sessions
        SET follow_up_sent = true
        WHERE session_id = ${session.session_id}
          AND channel = 'whatsapp'
          AND COALESCE(follow_up_sent, false) = false
        RETURNING session_id
      `;
      if (claimed.length === 0) continue;
      await sendMessage(session.session_id, mensagem);
      sent++;
    } catch (err) {
      console.error(`[Followup] Erro ao enviar para ${session.session_id}:`, err);
    }
  }

  console.log(`[Followup] Enviado para ${sent} sessão(ões)`);
  return NextResponse.json({ ok: true, sent });
}

export async function GET() {
  return NextResponse.json({ status: "followup endpoint ativo" });
}
