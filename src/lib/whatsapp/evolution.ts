const BASE_URL = process.env.EVOLUTION_API_URL!;
const API_KEY = process.env.EVOLUTION_API_KEY!;
const INSTANCE = process.env.EVOLUTION_INSTANCE!;

async function post(path: string, body: object) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: API_KEY },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error(`[Evolution] ${path}:`, await res.text());
}

export async function sendMessage(to: string, text: string) {
  await post(`/message/sendText/${INSTANCE}`, { number: to, text });
}

export async function sendCatalog(to: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://santaclarafarma.com.py";
  await post(`/message/sendMedia/${INSTANCE}`, {
    number: to,
    mediatype: "document",
    mimetype: "application/pdf",
    media: `${baseUrl}/api/whatsapp/catalogo`,
    fileName: "catalogo-santa-clara.pdf",
    caption: "📋 Catálogo completo da Farmácia Santa Clara",
  });
}
