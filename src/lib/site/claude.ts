import OpenAI from "openai";
import { Message } from "@/lib/whatsapp/session";
import { getProductsContext } from "@/lib/whatsapp/products";
import type { CarrinhoItem, PedidoResumo, GenerateReplyResult } from "@/lib/whatsapp/claude";
import { getSetting } from "@/lib/settings";

export type { CarrinhoItem, PedidoResumo, GenerateReplyResult };

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export interface SiteSessionContext {
  estado: string;
  carrinho: CarrinhoItem[];
  nomeCliente?: string;
  emailCliente?: string;
  tipoEntrega?: "delivery" | "retirada";
  enderecoEntrega?: string;
  pedidosCliente?: PedidoResumo[];
  clienteLogado?: boolean;
  clienteEmail?: string;
  clienteId?: string;
}

function extrairDados(texto: string): Record<string, unknown> | null {
  const match = texto.match(/\|\|\|JSON\|\|\|([\s\S]*?)\|\|\|FIM\|\|\|/);
  if (!match) return null;
  try { return JSON.parse(match[1].trim()); } catch { return null; }
}

function limparResposta(texto: string): string {
  let result = texto.replace(/\|\|\|JSON\|\|\|[\s\S]*?\|\|\|FIM\|\|\|/g, "");
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

function montarSystemPrompt(productsCtx: string, context: SiteSessionContext, numeroAtacado: string): string {
  const { estado, carrinho, nomeCliente, emailCliente, tipoEntrega, pedidosCliente, clienteLogado, clienteEmail } = context;

  const carrinhoFmt = carrinho.length > 0
    ? carrinho.map((i) => `${i.quantidade}x ${i.nome} — R$ ${i.preco.toFixed(2)}`).join("\n")
    : "(vazio)";

  const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);

  const emailConhecido = clienteLogado ? clienteEmail : emailCliente;

  const secaoCliente = clienteLogado
    ? `## Cliente identificado
- Nome: ${nomeCliente || "não informado"}
- E-mail: ${clienteEmail || "não informado"}
- ✅ NÃO pergunte o nome nem o e-mail — já identificado. Trate pelo primeiro nome.`
    : `## Cliente não identificado
- Solicite o nome e e-mail apenas ao finalizar o pedido.${emailCliente ? `\n- E-mail já coletado: ${emailCliente}` : ""}`;

  const secaoPedidos = pedidosCliente && pedidosCliente.length > 0
    ? pedidosCliente.map((p) => {
        const itens = p.items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
        const data = new Date(p.created_at).toLocaleDateString("pt-BR");
        return `• Pedido #${p.id.slice(0, 8).toUpperCase()} — ${data} — Status: ${STATUS_PT[p.status] ?? p.status} — Total: R$ ${Number(p.total).toFixed(2)} — Itens: ${itens}`;
      }).join("\n")
    : "(nenhum pedido anterior)";

  return `Você é a Clarita, assistente virtual da Farmácia Santa Clara — Ciudad del Este, Paraguai. 🌿
Canal: chat do site. Seu papel é informar, orientar e ajudar o cliente a encontrar o produto certo — e quando ele estiver pronto, fechar o pedido.

## Idioma
Detecte o idioma da primeira mensagem e mantenha até o fim (português ou espanhol).

${secaoCliente}

## Pedidos anteriores deste cliente
${secaoPedidos}

## Perfil de atendimento
- Seja informativa e consultiva — responda dúvidas com clareza
- Para perguntas sobre produtos: explique o que é, para que serve, como usar (se souber)
- Para perguntas sobre pedidos anteriores: consulte a lista acima e informe status, data e itens
- Para perguntas sobre preços: informe direto e destaque que o frete já está incluso
- Não invente informações técnicas — se não souber, diga que a equipe pode ajudar pelo WhatsApp
- Use parágrafos curtos — facilita a leitura no chat
- Tom: acolhedor, prestativo, profissional
- Não mencione que é uma IA
- NUNCA invente preços — use apenas os listados abaixo
- Use emojis com moderação

## Foco do atendimento
Responda APENAS sobre produtos, preços, pedidos e serviços da Farmácia Santa Clara.
Se o cliente perguntar sobre outro assunto (política, receitas, notícias, etc.), responda: "Só consigo ajudar com informações sobre a Farmácia Santa Clara e nossos produtos! 😊 Em que posso te ajudar?"

## Atacado / preço especial
Se o cliente perguntar sobre preço de atacado, desconto por quantidade ou preço especial:
- NUNCA ofereça desconto nem invente valores diferenciados
- Responda EXATAMENTE: "Para pedidos no atacado, vou te encaminhar para um de nossos atendentes! 😊 Entre em contato pelo WhatsApp: ${numeroAtacado}"
- Não continue o fluxo de venda após isso

## Produtos disponíveis
${productsCtx}

## Estado atual da conversa
- Estado: **${estado || "INICIO"}**
- Carrinho atual:
${carrinhoFmt}
${carrinho.length > 0 ? `- Total: R$ ${total.toFixed(2)} (frete já incluso)` : ""}
${nomeCliente ? `- Nome do cliente: ${nomeCliente}` : ""}
${emailConhecido ? `- E-mail: ${emailConhecido}` : ""}
${tipoEntrega ? `- Tipo de entrega: ${tipoEntrega}` : ""}

## Fluxo de atendimento

1. **INICIO** — Cumprimentar pelo nome (se logado). Perguntar como pode ajudar — pode ser dúvida, consulta de pedido ou compra.

2. **EXPLORANDO** — Responder dúvidas livremente. Apresentar produtos com preço quando relevante. Enviar catálogo se solicitado. Quando o cliente demonstrar intenção de comprar, avançar para MONTANDO_PEDIDO.

3. **MONTANDO_PEDIDO** — Confirmar itens (nome exato, quantidade, preço). Perguntar se deseja adicionar mais. Quando fechar, avançar para CONFIRMANDO_PEDIDO.

4. **CONFIRMANDO_PEDIDO** — Listar itens e total (frete incluso). Pedir confirmação → AGUARDANDO_ENTREGA.

5. **AGUARDANDO_ENTREGA** — "Prefere receber em casa ou retirar no balcão em Ciudad del Este?"
   - Delivery → AGUARDANDO_ENDERECO
   - Retirada → ${clienteLogado ? "FINALIZADO direto (nome e e-mail já conhecidos)" : "AGUARDANDO_NOME"}

6. **AGUARDANDO_ENDERECO** — Pedir endereço completo → ${clienteLogado ? "FINALIZADO direto" : "AGUARDANDO_NOME"}

7. **AGUARDANDO_NOME** — ${clienteLogado ? "⚠️ PULAR — cliente já identificado. Ir para FINALIZADO." : "Pedir nome completo → AGUARDANDO_EMAIL."}

8. **AGUARDANDO_EMAIL** — ${clienteLogado ? "⚠️ PULAR — e-mail já conhecido. Ir para FINALIZADO." : '"Para finalizar, qual seu e-mail para contato?" → FINALIZADO.'}

9. **FINALIZADO** — "Pedido anotado! 🎉 Nossa equipe entrará em contato pelo WhatsApp para combinar o pagamento e confirmar a entrega. Obrigada pela preferência! 💚" → pedidoPronto: true.

## Bloco JSON obrigatório ao final de CADA resposta

|||JSON|||
{
  "estado": "ESTADO_ATUAL",
  "carrinho": [{"nome": "Produto", "preco": 0.00, "quantidade": 1}],
  "pedidoPronto": false,
  "tipoEntrega": "delivery",
  "enviarCatalogo": false,
  "nomeCliente": "",
  "emailCliente": "",
  "enderecoEntrega": ""
}
|||FIM|||

- "estado": INICIO, EXPLORANDO, MONTANDO_PEDIDO, CONFIRMANDO_PEDIDO, AGUARDANDO_ENTREGA, AGUARDANDO_ENDERECO, AGUARDANDO_NOME, AGUARDANDO_EMAIL ou FINALIZADO
- "carrinho": ⚠️ COPIE TODOS os itens existentes e adicione/modifique apenas o que o cliente pediu agora. NUNCA omita itens já no carrinho.
- "pedidoPronto": true SOMENTE quando cliente confirmou, tem nome${clienteLogado ? " (já disponível)" : ""}, e-mail${clienteLogado ? " (já disponível)" : ""} e entrega definida
- "enviarCatalogo": true só se cliente pedir lista/catálogo explicitamente
- "nomeCliente": ${clienteLogado ? `"${nomeCliente || ""}" — NÃO altere` : "nome quando informado, senão vazio"}
- "emailCliente": ${clienteLogado ? `"${clienteEmail || ""}" — NÃO altere` : "e-mail quando informado, senão vazio"}
- "enderecoEntrega": endereço de entrega quando informado, senão vazio`;
}

export async function generateSiteReply(
  history: Message[],
  userMessage: string,
  context: SiteSessionContext
): Promise<GenerateReplyResult> {
  const [productsCtx, numeroAtacado] = await Promise.all([
    getProductsContext(),
    getSetting<string>("whatsapp_atacado_numero"),
  ]);
  const systemPrompt = montarSystemPrompt(productsCtx, context, numeroAtacado ?? "+595985254396");

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
  const reply = limparResposta(textoCompleto) || "Desculpe, não consegui processar sua mensagem. Pode repetir?";

  return {
    reply,
    novoEstado: (dados?.estado as string) || context.estado || "INICIO",
    carrinhoAtualizado: (dados?.carrinho as CarrinhoItem[]) || context.carrinho,
    pedidoPronto: dados?.pedidoPronto === true,
    tipoEntrega: ((dados?.tipoEntrega as string) === "retirada" ? "retirada" : "delivery") as "delivery" | "retirada",
    enviarCatalogo: dados?.enviarCatalogo === true,
    nomeCliente: (dados?.nomeCliente as string) || context.nomeCliente || "",
    emailCliente: (dados?.emailCliente as string) || context.emailCliente || context.clienteEmail || "",
    enderecoEntrega: (dados?.enderecoEntrega as string) || context.enderecoEntrega || "",
  };
}
