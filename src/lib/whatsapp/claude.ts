import OpenAI from "openai";
import { Message } from "./session";
import { getProductsContext } from "./products";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export interface OrderData {
  customer_name: string;
  delivery_type: "delivery" | "pickup";
  items: { product_name: string; quantity: number; unit_price: number }[];
  street?: string;
  city?: string;
  state?: string;
  notes?: string;
}

export interface GenerateReplyResult {
  reply: string;
  order?: OrderData;
  sendCatalog?: boolean;
}

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "registrar_pedido",
      description: `Registra um pedido confirmado pelo cliente.
Use SOMENTE quando o cliente tiver confirmado explicitamente os itens, quantidade e forma de entrega ou retirada.
Não use se ainda faltam informações como nome, itens ou forma de entrega.`,
      parameters: {
        type: "object",
        required: ["customer_name", "delivery_type", "items"],
        properties: {
          customer_name: { type: "string", description: "Nome completo do cliente" },
          delivery_type: {
            type: "string",
            enum: ["delivery", "pickup"],
            description: "'delivery' para entrega, 'pickup' para retirada no balcão",
          },
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["product_name", "quantity", "unit_price"],
              properties: {
                product_name: { type: "string" },
                quantity: { type: "number" },
                unit_price: { type: "number", description: "Preço unitário em reais" },
              },
            },
          },
          street: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          notes: { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "enviar_catalogo",
      description: "Envia o catálogo completo de produtos em PDF para o cliente. Use quando o cliente pedir lista de preços, catálogo ou tabela de produtos.",
      parameters: { type: "object", properties: {} },
    },
  },
];

export async function generateReply(
  history: Message[],
  userMessage: string
): Promise<GenerateReplyResult> {
  const productsContext = await getProductsContext();

  const systemPrompt = `Você é a Clarita, atendente virtual da Farmácia Santa Clara em Cidade del Este, Paraguai! 🌿

Seu jeito: animada, simpática, educada — mas sempre com foco em fechar a venda. Cada conversa é uma oportunidade!

PRODUTOS DISPONÍVEIS:
${productsContext}

COMO ATENDER:
- Cumprimente de forma curta e cordial na primeira mensagem (ex: "Olá! Tudo bem? 😊 Como posso ajudar?")
- Use emojis com moderação para dar vida às respostas 😊💊
- Quando o cliente perguntar sobre um produto, destaque os benefícios E informe o preço logo
- Se o cliente hesitar, ofereça alternativas ou reforce o valor do produto
- Sempre incentive a fechar: "Posso separar pra você?", "Quer aproveitar e levar?"
- Mensagens curtas e diretas, estilo WhatsApp

CATÁLOGO:
- Se o cliente pedir lista de preços, catálogo ou tabela → use enviar_catalogo imediatamente

FECHAR PEDIDO:
Você precisa de apenas 3 informações — pergunte somente o que faltar:
1. Nome do cliente
2. Produto(s) e quantidade(s)
3. Entrega (qualquer endereço) ou Retirada no balcão

NÃO peça: e-mail, CPF, CEP, bairro extra, forma de pagamento.
Assim que tiver as 3 informações → chame registrar_pedido imediatamente.

FRETE: Entrega = 35% do subtotal | Retirada = grátis

APÓS REGISTRAR:
"Pedido anotado! 🎉
[lista: • Produto xQTD — R$ XX,XX]
Subtotal: R$ XX,XX
Frete: R$ XX,XX
*Total: R$ XX,XX*
Nossa equipe vai entrar em contato pelo WhatsApp para combinar o pagamento. Obrigada pela preferência! 💚"

OUTRAS REGRAS:
- Responda sempre em português brasileiro
- Nunca invente preços — use apenas os da lista acima
- Não mencione que é uma IA
- Aceite qualquer quantidade sem questionar`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await client.chat.completions.create({
    model: "anthropic/claude-3-5-haiku",
    messages,
    tools,
    tool_choice: "auto",
    max_tokens: 1024,
  });

  const choice = response.choices[0];

  if (choice.finish_reason === "tool_calls" && choice.message.tool_calls?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolCall = choice.message.tool_calls[0] as any;
    const fn = toolCall.function ?? toolCall;

    if (fn.name === "enviar_catalogo") {
      return { reply: "Aqui está nosso catálogo completo com todos os produtos e preços! 📋💊", sendCatalog: true };
    }

    if (fn.name === "registrar_pedido") {
      const orderData: OrderData = JSON.parse(fn.arguments);

      const confirmMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...messages,
        { role: "assistant", content: null, tool_calls: choice.message.tool_calls },
        { role: "tool", tool_call_id: toolCall.id, content: "Pedido registrado com sucesso no sistema." },
      ];

      const confirmResponse = await client.chat.completions.create({
        model: "anthropic/claude-3-5-haiku",
        messages: confirmMessages,
        max_tokens: 512,
      });

      const reply = confirmResponse.choices[0]?.message?.content
        ?? "Pedido confirmado! Nossa equipe entrará em contato em breve. 😊";

      return { reply, order: orderData };
    }
  }

  const reply = choice.message?.content ?? "Desculpe, não consegui processar sua mensagem.";
  return { reply };
}
