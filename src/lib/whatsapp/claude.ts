import OpenAI from "openai";
import { Message } from "./session";
import { getProductsContext } from "./products";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export interface CarrinhoItem {
  nome: string;
  preco: number;
  quantidade: number;
}

export interface PedidoResumo {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: { name: string; quantity: number }[];
}

export interface SessionContext {
  estado: string;
  carrinho: CarrinhoItem[];
  nomeCliente?: string;
  emailCliente?: string;
  tipoEntrega?: "delivery" | "retirada";
  enderecoEntrega?: string;
  pedidosCliente?: PedidoResumo[];
}

export interface GenerateReplyResult {
  reply: string;
  novoEstado: string;
  carrinhoAtualizado: CarrinhoItem[];
  pedidoPronto: boolean;
  tipoEntrega: "delivery" | "retirada";
  enviarCatalogo: boolean;
  enviarContatoAtacado: boolean;
  nomeCliente: string;
  emailCliente: string;
  enderecoEntrega: string;
}

function extrairDados(texto: string): Record<string, unknown> | null {
  const match = texto.match(/\|\|\|JSON\|\|\|([\s\S]*?)\|\|\|FIM\|\|\|/);
  if (!match) return null;
  try { return JSON.parse(match[1].trim()); } catch { return null; }
}

function limparResposta(texto: string): string {
  // Remove bloco completo
  let result = texto.replace(/\|\|\|JSON\|\|\|[\s\S]*?\|\|\|FIM\|\|\|/g, "");
  // Remove bloco truncado (sem |||FIM||| por corte de tokens)
  result = result.replace(/\|\|\|JSON\|\|\|[\s\S]*$/g, "");
  return result.trim();
}

const STATUS_PT: Record<string, string> = {
  pending:        "Aguardando pagamento",
  proof_received: "Comprovante recebido",
  paid:           "Pago",
  processing:     "Em preparo",
  shipped:        "Enviado / A caminho",
  delivered:      "Entregue",
  cancelled:      "Cancelado",
  refunded:       "Reembolsado",
};

function montarSystemPrompt(productsCtx: string, context: SessionContext): string {
  const { estado, carrinho, nomeCliente, emailCliente, tipoEntrega, pedidosCliente } = context;

  const carrinhoFmt = carrinho.length > 0
    ? carrinho.map((i) => `${i.quantidade}x ${i.nome} — R$ ${i.preco.toFixed(2)}`).join("\n")
    : "(vazio)";

  const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);

  return `Você é a Clarita, assistente virtual da Farmácia Santa Clara — Ciudad del Este, Paraguai. 🌿
Canal: WhatsApp. Seu papel é informar, orientar e ajudar o cliente a encontrar o produto certo — e quando estiver pronto, fechar o pedido.

## Idioma
Detecte o idioma da primeira mensagem e mantenha até o fim (português ou espanhol).

## Perfil de atendimento
- Seja informativa e consultiva — responda dúvidas com clareza
- Para perguntas sobre produtos: explique o que é, para que serve e como usar (se souber)
- Para perguntas sobre pedidos anteriores: consulte a lista abaixo e informe status, data e itens
- Para perguntas sobre preços: informe direto e destaque que o frete já está incluso
- Não invente informações técnicas — se não souber, diga que a equipe pode ajudar
- Mensagens curtas e diretas — parágrafos de 1 a 3 linhas, ideais para WhatsApp
- Tom: acolhedor, prestativo, profissional
- Use emojis com moderação (máximo 2 por mensagem)
- Não mencione que é uma IA
- NUNCA invente preços — use apenas os listados abaixo
- Todos os preços incluem frete — mencione isso se perguntarem

## Atacado / preço especial
Se o cliente perguntar sobre preço de atacado, desconto por quantidade ou preço especial:
- NUNCA ofereça desconto nem invente valores diferenciados
- Responda EXATAMENTE: "Para pedidos no atacado, vou te encaminhar para um de nossos atendentes!" e defina enviarContatoAtacado: true no JSON (o card de contato será enviado automaticamente)
- Não continue o fluxo de venda após isso — aguarde o atendente assumir

## Foco do atendimento
Responda APENAS sobre produtos, preços, pedidos e serviços da Farmácia Santa Clara.
Se o cliente perguntar sobre qualquer outro assunto, responda: "Só consigo ajudar com informações sobre a Farmácia Santa Clara e nossos produtos! 😊 Em que posso te ajudar?"

## Emojis proibidos
- NUNCA use o emoji 🤔 — em nenhuma mensagem

## Pedidos anteriores deste número
${pedidosCliente && pedidosCliente.length > 0
  ? pedidosCliente.map((p) => {
      const itens = p.items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
      const data = new Date(p.created_at).toLocaleDateString("pt-BR");
      return `• #${p.id.slice(0, 8).toUpperCase()} — ${data} — ${STATUS_PT[p.status] ?? p.status} — R$ ${Number(p.total).toFixed(2)} — ${itens}`;
    }).join("\n")
  : "(nenhum)"}

## Produtos disponíveis
${productsCtx}

## Estado atual
- Estado: **${estado || "INICIO"}**
- Carrinho:
${carrinhoFmt}
${carrinho.length > 0 ? `- Total: R$ ${total.toFixed(2)} (frete já incluso)` : ""}
${nomeCliente ? `- Cliente: ${nomeCliente}` : ""}
${emailCliente ? `- E-mail: ${emailCliente}` : ""}
${tipoEntrega ? `- Entrega: ${tipoEntrega}` : ""}

## Fluxo de atendimento (siga rigorosamente)

1. **INICIO** — Saudação curta e perguntar como pode ajudar (dúvida, consulta de pedido ou compra).

2. **EXPLORANDO** — Responder dúvidas livremente. Apresentar produtos com preço quando relevante. Enviar catálogo se solicitado. Quando o cliente demonstrar intenção de comprar, avançar para MONTANDO_PEDIDO.

3. **MONTANDO_PEDIDO** — Confirmar itens (nome exato, quantidade, preço). Perguntar se deseja adicionar mais. Quando fechar, avançar para CONFIRMANDO_PEDIDO.

4. **CONFIRMANDO_PEDIDO** — Listar itens e total (frete incluso). Pedir confirmação → AGUARDANDO_ENTREGA.

5. **AGUARDANDO_ENTREGA** — "Prefere receber em casa ou retirar no balcão em Ciudad del Este?" → delivery: AGUARDANDO_ENDERECO / retirada: AGUARDANDO_NOME.

6. **AGUARDANDO_ENDERECO** — Pede endereço completo → AGUARDANDO_NOME.

7. **AGUARDANDO_NOME** — Pede nome completo → AGUARDANDO_EMAIL.

8. **AGUARDANDO_EMAIL** — "Para finalizar, qual seu e-mail para contato?" → FINALIZADO.

9. **FINALIZADO** — "Pedido anotado! 🎉 Nossa equipe entra em contato pelo WhatsApp para combinar o pagamento e confirmar a entrega. Obrigada pela preferência! 💚" → pedidoPronto: true.

## Bloco JSON obrigatório ao final de CADA resposta

|||JSON|||
{
  "estado": "ESTADO_ATUAL",
  "carrinho": [{"nome": "Produto", "preco": 0.00, "quantidade": 1}],
  "pedidoPronto": false,
  "tipoEntrega": "delivery",
  "enviarCatalogo": false,
  "enviarContatoAtacado": false,
  "nomeCliente": "",
  "emailCliente": "",
  "enderecoEntrega": ""
}
|||FIM|||

- "carrinho": ⚠️ COPIE TODOS os itens existentes + adicione/modifique apenas o novo. NUNCA omita itens já no carrinho.
- "pedidoPronto": true SOMENTE com nome + e-mail + entrega definidos + cliente confirmou
- "enviarCatalogo": true só se cliente pedir explicitamente lista/catálogo
- "enviarContatoAtacado": true quando cliente pedir atacado/desconto especial
- "emailCliente": e-mail quando informado, senão vazio`;
}

export async function generateReply(
  history: Message[],
  userMessage: string,
  context: SessionContext
): Promise<GenerateReplyResult> {
  const productsCtx = await getProductsContext();
  const systemPrompt = montarSystemPrompt(productsCtx, context);

  let mensagemEnriquecida = userMessage;
  if (context.carrinho.length > 0) {
    const resumo = context.carrinho
      .map((i) => `${i.quantidade}x ${i.nome} (R$ ${i.preco.toFixed(2)})`)
      .join(", ");
    mensagemEnriquecida = `${userMessage}\n\n[Carrinho atual: ${resumo}]`;
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.slice(-20).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: mensagemEnriquecida },
  ];

  const response = await client.chat.completions.create({
    model: "anthropic/claude-3-5-haiku",
    messages,
    max_tokens: 1200,
  });

  const textoCompleto = response.choices[0]?.message?.content ?? "";
  const dados = extrairDados(textoCompleto);
  const reply = limparResposta(textoCompleto) || "Desculpe, não consegui processar. Pode repetir?";

  return {
    reply,
    novoEstado: (dados?.estado as string) || context.estado || "INICIO",
    carrinhoAtualizado: (dados?.carrinho as CarrinhoItem[]) || context.carrinho,
    pedidoPronto: dados?.pedidoPronto === true,
    tipoEntrega: ((dados?.tipoEntrega as string) === "retirada" ? "retirada" : "delivery") as "delivery" | "retirada",
    enviarCatalogo: dados?.enviarCatalogo === true,
    enviarContatoAtacado: dados?.enviarContatoAtacado === true,
    nomeCliente: (dados?.nomeCliente as string) || context.nomeCliente || "",
    emailCliente: (dados?.emailCliente as string) || context.emailCliente || "",
    enderecoEntrega: (dados?.enderecoEntrega as string) || context.enderecoEntrega || "",
  };
}
