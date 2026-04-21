import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import sql from "@/lib/db";
import type { Message } from "@/lib/whatsapp/session";

export const dynamic = "force-dynamic";

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY ?? "placeholder",
    baseURL: "https://openrouter.ai/api/v1",
  });
}

async function getProductsContext(): Promise<string> {
  const products = await sql`
    SELECT p.name, p.price, p.stock,
           c.name AS category_name, b.name AS brand_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.active = true
    ORDER BY p.name
  `;
  if (!products.length) return "Nenhum produto disponível.";
  return products.map((p) => {
    const price = Number(p.price) > 0 ? `R$ ${Number(p.price).toFixed(2).replace(".", ",")}` : "Consulte o preço";
    const stock = Number(p.stock) > 0 ? "Em estoque" : "Fora de estoque";
    return `• ${p.name} | Marca: ${p.brand_name ?? "—"} | Preço: ${price} | ${stock}`;
  }).join("\n");
}

async function getHistory(sessionId: string): Promise<Message[]> {
  const rows = await sql`
    SELECT messages FROM chat_sessions
    WHERE session_id = ${sessionId} AND channel = 'site'
    LIMIT 1
  `;
  if (!rows[0]) return [];
  return (rows[0].messages as Message[]).slice(-20);
}

async function saveMessages(sessionId: string, userMsg: string, assistantMsg: string) {
  const newMsgs = JSON.stringify([
    { role: "user", content: userMsg },
    { role: "assistant", content: assistantMsg },
  ]);
  await sql`
    INSERT INTO chat_sessions (session_id, channel, messages)
    VALUES (${sessionId}, 'site', ${newMsgs}::jsonb)
    ON CONFLICT (session_id, channel) DO UPDATE
    SET messages = chat_sessions.messages || ${newMsgs}::jsonb,
        updated_at = now()
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();
    if (!message || !sessionId) return NextResponse.json({ reply: "Mensagem inválida." }, { status: 400 });

    const [productsContext, history] = await Promise.all([
      getProductsContext(),
      getHistory(sessionId),
    ]);

    const systemPrompt = `Você é o assistente virtual da Farmácia Santa Clara, localizada em Cidade del Este, Paraguai.
Atenda clientes pelo chat do site, tire dúvidas sobre produtos e ajude a fechar vendas.

PRODUTOS DISPONÍVEIS:
${productsContext}

INSTRUÇÕES:
- Seja simpático, profissional e objetivo
- Responda sempre em português brasileiro
- Informe preço e disponibilidade quando perguntado
- Se o cliente quiser comprar, sugira finalizar pelo WhatsApp ou pelo carrinho do site
- Mensagens curtas e diretas
- Nunca invente preços ou informações fora da lista`;

    const response = await getClient().chat.completions.create({
      model: "anthropic/claude-3-5-haiku",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: message },
      ],
      max_tokens: 512,
    });

    const reply = response.choices[0]?.message?.content ?? "Desculpe, não consegui responder.";
    await saveMessages(sessionId, message, reply);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[Chat API]", err);
    return NextResponse.json({ reply: "Ocorreu um erro. Tente novamente." }, { status: 500 });
  }
}
