import sql from "@/lib/db";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const HISTORY_LIMIT = 20;

function normalizeMessages(raw: unknown[]): Message[] {
  return raw.flatMap((m) => {
    if (typeof m === "string") {
      try { return JSON.parse(m) as Message[]; } catch { return []; }
    }
    return m as Message;
  });
}

export async function getSession(sessionId: string, channel: "whatsapp" | "site" = "whatsapp"): Promise<Message[]> {
  const rows = await sql`
    SELECT messages FROM chat_sessions
    WHERE session_id = ${sessionId} AND channel = ${channel}
    LIMIT 1
  `;
  if (!rows[0]) return [];
  const messages = normalizeMessages(rows[0].messages as unknown[]);
  return messages.slice(-HISTORY_LIMIT);
}

export async function addMessage(sessionId: string, message: Message, channel: "whatsapp" | "site" = "whatsapp") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonMsg = sql.json([message] as any);
  await sql`
    INSERT INTO chat_sessions (session_id, channel, messages)
    VALUES (${sessionId}, ${channel}, ${jsonMsg})
    ON CONFLICT (session_id, channel) DO UPDATE
    SET messages = chat_sessions.messages || ${jsonMsg},
        updated_at = now()
  `;
}

export async function clearSession(sessionId: string) {
  await sql`DELETE FROM chat_sessions WHERE session_id = ${sessionId}`;
}
