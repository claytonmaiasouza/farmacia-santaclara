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
}

const registrarPedidoTool: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "registrar_pedido",
    description: `Registra um pedido confirmado pelo cliente.
Use esta função SOMENTE quando o cliente tiver confirmado explicitamente os itens, quantidade e forma de entrega ou retirada.
Não use se ainda faltam informações como nome, itens ou forma de entrega.`,
    parameters: {
      type: "object",
      required: ["customer_name", "delivery_type", "items"],
      properties: {
        customer_name: {
          type: "string",
          description: "Nome completo do cliente",
        },
        delivery_type: {
          type: "string",
          enum: ["delivery", "pickup"],
          description: "'delivery' para entrega no endereço, 'pickup' para retirada no balcão",
        },
        items: {
          type: "array",
          description: "Lista de itens do pedido",
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
        street: { type: "string", description: "Endereço de entrega (se delivery)" },
        city: { type: "string" },
        state: { type: "string" },
        notes: { type: "string", description: "Observações adicionais" },
      },
    },
  },
};

export async function generateReply(
  history: Message[],
  userMessage: string
): Promise<GenerateReplyResult> {
  const productsContext = await getProductsContext();

  const systemPrompt = `Você é o assistente virtual da Farmácia Santa Clara, localizada em Cidade del Este, Paraguai.
Seu papel é atender clientes pelo WhatsApp, tirar dúvidas sobre produtos e fechar pedidos rapidamente.

PRODUTOS DISPONÍVEIS:
${productsContext}

REGRAS PARA FECHAR PEDIDO:
Para registrar um pedido você precisa de APENAS 3 informações — pergunte somente o que estiver faltando:
1. Nome do cliente
2. Produto(s) e quantidade(s)
3. Entrega (qualquer endereço serve) ou Retirada no balcão

NÃO peça: e-mail, CPF, CEP, bairro, telefone extra, forma de pagamento nem confirmação redundante.
Assim que tiver as 3 informações, chame registrar_pedido imediatamente.

FRETE: Para entrega = 35% do subtotal. Para retirada = grátis.

APÓS REGISTRAR, envie esta mensagem exata substituindo os valores:
"Pedido confirmado! 🎉
[lista de itens: • Produto xQTD — R$ XX,XX]
Subtotal: R$ XX,XX
Frete (35%): R$ XX,XX
*Total: R$ XX,XX*
Nossa equipe entrará em contato pelo WhatsApp para combinar o pagamento. 💊"

OUTRAS INSTRUÇÕES:
- Responda sempre em português brasileiro
- Mensagens curtas e diretas, estilo WhatsApp
- Informe preço e disponibilidade quando perguntado
- Nunca invente preços — use apenas os da lista acima
- Não mencione que é uma IA
- NUNCA questione a quantidade do pedido, independente do valor — aceite qualquer quantidade sem comentários`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await client.chat.completions.create({
    model: "anthropic/claude-3-5-haiku",
    messages,
    tools: [registrarPedidoTool],
    tool_choice: "auto",
    max_tokens: 1024,
  });

  const choice = response.choices[0];

  // Verificar se o modelo quer chamar a ferramenta
  if (choice.finish_reason === "tool_calls" && choice.message.tool_calls?.length) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toolCall = choice.message.tool_calls[0] as any;
    const fn = toolCall.function ?? toolCall;

    if (fn.name === "registrar_pedido") {
      const orderData: OrderData = JSON.parse(fn.arguments);

      // Gera mensagem de confirmação com um segundo turno
      const confirmMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...messages,
        { role: "assistant", content: null, tool_calls: choice.message.tool_calls },
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: "Pedido registrado com sucesso no sistema.",
        },
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
