import postgres from "postgres";

const BASE_URL = process.env.EVOLUTION_API_URL!;
const API_KEY = process.env.EVOLUTION_API_KEY!;
const INSTANCE = process.env.EVOLUTION_INSTANCE!;

// Conexão ao banco da Evolution API dedicada para resolução de @lid
const evolutionDb = postgres(
  process.env.DATABASE_URL!.replace(/\/farmacia$/, "/evolution_farmacia"),
  { max: 2, idle_timeout: 30 }
);

// Resolve @lid → @s.whatsapp.net consultando a tabela Contact da Evolution API
async function resolveJid(jid: string, pushName?: string): Promise<string> {
  if (!jid.includes("@lid")) return jid;
  try {
    // Método 1: pelo pushName (mais rápido)
    if (pushName) {
      const rows = await evolutionDb`
        SELECT c."remoteJid"
        FROM "Contact" c
        JOIN "Instance" i ON c."instanceId" = i.id
        WHERE i.name = ${INSTANCE}
          AND c."pushName" = ${pushName}
          AND c."remoteJid" LIKE '%@s.whatsapp.net'
        LIMIT 1
      `;
      if (rows[0]) {
        console.log(`[Evolution] @lid ${jid} → ${rows[0].remoteJid} (via pushName)`);
        return rows[0].remoteJid;
      }
    }
    // Método 2: pelo próprio @lid (busca pushName e depois @s.whatsapp.net)
    const rows = await evolutionDb`
      SELECT c2."remoteJid"
      FROM "Contact" c2
      JOIN "Instance" i ON c2."instanceId" = i.id
      WHERE i.name = ${INSTANCE}
        AND c2."remoteJid" LIKE '%@s.whatsapp.net'
        AND c2."pushName" = (
          SELECT c1."pushName" FROM "Contact" c1
          JOIN "Instance" i1 ON c1."instanceId" = i1.id
          WHERE i1.name = ${INSTANCE} AND c1."remoteJid" = ${jid}
          LIMIT 1
        )
      LIMIT 1
    `;
    if (rows[0]) {
      console.log(`[Evolution] @lid ${jid} → ${rows[0].remoteJid} (via fallback)`);
      return rows[0].remoteJid;
    }
  } catch (err) {
    console.error("[Evolution] resolveJid error:", err);
  }
  return jid;
}

async function post(path: string, body: object) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: API_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error(`[Evolution] ${path}:`, await res.text());
}

export async function sendMessage(to: string, text: string, pushName?: string) {
  const jid = await resolveJid(to, pushName);
  await post(`/message/sendText/${INSTANCE}`, { number: jid, text });
}

export async function sendContact(to: string, name: string, phone: string, pushName?: string) {
  const jid = await resolveJid(to, pushName);
  await post(`/message/sendContact/${INSTANCE}`, {
    number: jid,
    contact: [{ fullName: name, wuid: phone.replace(/\D/g, ""), phoneNumber: phone }],
  });
}

export async function sendCatalog(to: string, pushName?: string) {
  const jid = await resolveJid(to, pushName);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://santaclarafarma.com.py";
  await post(`/message/sendMedia/${INSTANCE}`, {
    number: jid,
    mediatype: "document",
    mimetype: "application/pdf",
    media: `${baseUrl}/api/whatsapp/catalogo`,
    fileName: "catalogo-santa-clara.pdf",
    caption: "📋 Catálogo completo da Farmácia Santa Clara",
  });
}
