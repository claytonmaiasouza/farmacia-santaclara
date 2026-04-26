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
  tipoEntrega?: "delivery" | "retirada";
  enderecoEntrega?: string;
  pedidosCliente?: PedidoResumo[];
  clienteLogado?: boolean;
  clienteEmail?: string;
  clienteId?: string;
}

export interface GenerateReplyResult {
  reply: string;
  novoEstado: string;
  carrinhoAtualizado: CarrinhoItem[];
  pedidoPronto: boolean;
  tipoEntrega: "delivery" | "retirada";
  enviarCatalogo: boolean;
  nomeCliente: string;
  enderecoEntrega: string;
}

function extrairDados(texto: string): Record<string, unknown> | null {
  const match = texto.match(/\|\|\|JSON\|\|\|([\s\S]*?)\|\|\|FIM\|\|\|/);
  if (!match) return null;
  try { return JSON.parse(match[1].trim()); } catch { return null; }
}

function limparResposta(texto: string): string {
  return texto.replace(/\|\|\|JSON\|\|\|[\s\S]*?\|\|\|FIM\|\|\|/g, "").trim();
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
  const { estado, carrinho, nomeCliente, tipoEntrega, pedidosCliente, clienteLogado, clienteEmail } = context;

  const carrinhoFmt = carrinho.length > 0
    ? carrinho.map((i) => `${i.quantidade}x ${i.nome} — R$ ${i.preco.toFixed(2)}`).join("\n")
    : "(vazio)";

  const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);

  const secaoCliente = clienteLogado
    ? `## Cliente identificado (logado no site)
- Nome: ${nomeCliente || "não informado"}
- E-mail: ${clienteEmail || "não informado"}
- ✅ NÃO pergunte o nome — já está identificado.
- ✅ Trate-o pelo primeiro nome quando possível.`
    : `## Cliente não identificado
- Cliente navegando sem login — solicite o nome ao final do pedido.`;

  const secaoPedidos = pedidosCliente && pedidosCliente.length > 0
    ? pedidosCliente.map((p) => {
        const itens = p.items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
        const data = new Date(p.created_at).toLocaleDateString("pt-BR");
        return `• Pedido #${p.id.slice(0, 8).toUpperCase()} — ${data} — Status: ${STATUS_PT[p.status] ?? p.status} — Total: R$ ${Number(p.total).toFixed(2)} — Itens: ${itens}`;
      }).join("\n")
    : "(nenhum pedido anterior encontrado)";

  return `Você é a Clarita, atendente virtual da Farmácia Santa Clara em Ciudad del Este, Paraguai! 🌿
Seu jeito: animada, simpática, educada — e sempre focada em fechar a venda.

## Idioma
Detecte o idioma da primeira mensagem do cliente e mantenha esse idioma até o fim (português ou espanhol).

${secaoCliente}

## Pedidos anteriores deste cliente
${secaoPedidos}

## Regras de comportamento
- Na PRIMEIRA mensagem do cliente, cumprimente pelo nome (se logado) e pergunte se já sabe o que quer comprar ou prefere ver a lista de preços.
- Se o cliente pedir a lista/catálogo → enviarCatalogo: true e avançar para EXPLORANDO
- Se o cliente já souber o que quer → ir direto para MONTANDO_PEDIDO sem rodeios
- Se o cliente perguntar sobre um pedido anterior, consulte a lista acima e responda com o status e detalhes.
- Use emojis com moderação
- NUNCA invente preços — use apenas os listados abaixo
- Todos os preços já incluem frete — informe isso sempre que o cliente perguntar sobre entrega ou frete
- Mensagens curtas e diretas, foco em fechar a venda
- Não mencione que é uma IA
- Se o cliente digitar errado, interprete pelo contexto e confirme naturalmente
- Tolerância a erros: "hormoni", "vitami", "peptid", etc. — assuma o produto correto
- NUNCA questione ou comente sobre a quantidade do pedido, independente do valor

## Produtos disponíveis
${productsCtx}

## Estado atual da conversa
- Estado: **${estado || "INICIO"}**
- Carrinho atual:
${carrinhoFmt}
${carrinho.length > 0 ? `- Total: R$ ${total.toFixed(2)} (frete já incluso)` : ""}
${nomeCliente ? `- Nome do cliente: ${nomeCliente}` : ""}
${tipoEntrega ? `- Tipo de entrega: ${tipoEntrega}` : ""}

## Fluxo de atendimento

1. **INICIO**: Cumprimentar pelo nome (se logado) de forma curta. Perguntar se já sabe o que quer ou prefere ver a lista.

2. **EXPLORANDO**: Enviar catálogo se solicitado e/ou apresentar produtos relevantes com preços.
   - Se o cliente demonstrar interesse, avançar para MONTANDO_PEDIDO.

3. **MONTANDO_PEDIDO**: Confirmar cada item (nome exato, quantidade, preço).
   - Perguntar se deseja adicionar mais algo.
   - Quando confirmar que quer fechar, avançar para CONFIRMANDO_PEDIDO.

4. **CONFIRMANDO_PEDIDO**: Listar todos os itens e o total. Perguntar confirmação.
   - Após confirmar, avançar para AGUARDANDO_ENTREGA.

5. **AGUARDANDO_ENTREGA**: Perguntar: prefere receber em casa (delivery) ou retirar no balcão?
   - Se entrega: avançar para AGUARDANDO_ENDERECO.
   - Se retirada: ${clienteLogado ? "avançar direto para FINALIZADO (nome já conhecido)." : "avançar para AGUARDANDO_NOME."}

6. **AGUARDANDO_ENDERECO**: Pedir o endereço de entrega. Quando receber, ${clienteLogado ? "avançar direto para FINALIZADO (nome já conhecido)." : "avançar para AGUARDANDO_NOME."}

7. **AGUARDANDO_NOME**: ${clienteLogado ? "⚠️ PULAR ESTA ETAPA — cliente já está identificado. Avançar direto para FINALIZADO." : "Pedir o nome completo do cliente. Quando receber, finalizar."}

8. **FINALIZADO**: Confirmar pedido recebido:
   "Pedido anotado! 🎉 Nossa equipe entrará em contato pelo WhatsApp para combinar o pagamento e confirmar a entrega. Obrigada pela preferência! 💚"
   Marcar pedidoPronto: true.

## Instrução de resposta estruturada
Ao final de CADA resposta, inclua obrigatoriamente um bloco JSON no seguinte formato (sem markdown):

|||JSON|||
{
  "estado": "ESTADO_ATUAL",
  "carrinho": [{"nome": "Produto", "preco": 0.00, "quantidade": 1}],
  "pedidoPronto": false,
  "tipoEntrega": "delivery",
  "enviarCatalogo": false,
  "nomeCliente": "",
  "enderecoEntrega": ""
}
|||FIM|||

- "estado": um dos estados (INICIO, EXPLORANDO, MONTANDO_PEDIDO, CONFIRMANDO_PEDIDO, AGUARDANDO_ENTREGA, AGUARDANDO_ENDERECO, AGUARDANDO_NOME, FINALIZADO)
- "carrinho": ⚠️ REGRA CRÍTICA — copie TODOS os itens do carrinho atual e acrescente/modifique apenas o que o cliente pediu. NUNCA omita itens já existentes.
- "preco": valor unitário do produto (número com decimais, ex: 45.00)
- "pedidoPronto": true SOMENTE quando cliente confirmar E tiver nome E forma de entrega definida${clienteLogado ? " (cliente logado: nome já disponível)" : ""}
- "tipoEntrega": "delivery" ou "retirada"
- "enviarCatalogo": true apenas quando cliente pedir explicitamente lista de preços ou catálogo
- "nomeCliente": ${clienteLogado ? `"${nomeCliente || ""}" (já preenchido — não altere)` : "nome do cliente quando informado, senão string vazia"}
- "enderecoEntrega": endereço quando informado (apenas para delivery), senão string vazia`;
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
    ...history.slice(-16).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: mensagemEnriquecida },
  ];

  const response = await client.chat.completions.create({
    model: "anthropic/claude-3-5-haiku",
    messages,
    max_tokens: 1024,
  });

  const textoCompleto = response.choices[0]?.message?.content ?? "";
  const dados = extrairDados(textoCompleto);
  const reply = limparResposta(textoCompleto) || "Desculpe, não consegui processar sua mensagem. Pode repetir?";

  return {
    reply,
    novoEstado: (dados?.estado as string) || context.estado || "INICIO",
    carrinhoAtualizado: (dados?.carrinho as CarrinhoItem[]) || context.carrinho,
    pedidoPronto: dados?.pedidoPronto === true,
    tipoEntrega: ((dados?.tipoEntrega as string) === "retirada" ? "retirada" : "delivery") as "delivery" | "retirada",
    enviarCatalogo: dados?.enviarCatalogo === true,
    nomeCliente: (dados?.nomeCliente as string) || context.nomeCliente || "",
    enderecoEntrega: (dados?.enderecoEntrega as string) || context.enderecoEntrega || "",
  };
}
