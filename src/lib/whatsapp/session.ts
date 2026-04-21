import sql from "@/lib/db";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const HISTORY_LIMIT = 20;

export async function getSession(sessionId: string, channel: "whatsapp" | "site" = "whatsapp"): Promise<Message[]> {
  const rows = await sql`
    SELECT messages FROM chat_sessions
    WHERE session_id = ${sessionId} AND channel = ${channel}
    LIMIT 1
  `;
  if (!rows[0]) return [];
  const messages = rows[0].messages as Message[];
  return messages.slice(-HISTORY_LIMIT);
}

export async function addMessage(sessionId: string, message: Message, channel: "whatsapp" | "site" = "whatsapp") {
  await sql`
    INSERT INTO chat_sessions (session_id, channel, messages)
    VALUES (${sessionId}, ${channel}, ${JSON.stringify([message])}::jsonb)
    ON CONFLICT (session_id, channel) DO UPDATE
    SET messages = chat_sessions.messages || ${JSON.stringify([message])}::jsonb,
        updated_at = now()
  `;
}

export async function clearSession(sessionId: string) {
  await sql`DELETE FROM chat_sessions WHERE session_id = ${sessionId}`;
}
