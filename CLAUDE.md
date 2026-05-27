# Farmácia Santa Clara — Referência do Projeto

## Autonomia
Execute mudanças pequenas e pontuais sem pedir permissão.
Solicite confirmação apenas para mudanças grandes ou destrutivas: alteração de schema sem migração reversível, redesign de fluxo inteiro, remoção de funcionalidades existentes, ou qualquer ação que afete produção de forma irreversível.

---

## VPS / Deploy

- **IP:** `185.137.92.141`
- **Código-fonte:** `/opt/farmacia-santaclara/app/`
- **Docker Compose:** `/opt/farmacia-santaclara/docker-compose.yml`
- **Uploads (runtime):** `/opt/farmacia-santaclara/uploads/` → montado em `/app/public/uploads`

### Fluxo de deploy
```bash
# 1. SCP arquivos alterados
scp src/caminho/arquivo.ts root@185.137.92.141:/opt/farmacia-santaclara/app/src/caminho/arquivo.ts

# 2. Build da imagem no VPS
ssh root@185.137.92.141 "cd /opt/farmacia-santaclara/app && docker build -t farmacia-santaclara:latest ."

# 3. Reiniciar container
ssh root@185.137.92.141 "cd /opt/farmacia-santaclara && docker compose up -d farmacia-app"
```
- Container: `farmacia-santaclara-farmacia-app-1`
- Logs: `docker logs farmacia-santaclara-farmacia-app-1 --tail=20`
- A imagem usa Next.js standalone — arquivos adicionados em `public/` em runtime NÃO são servidos diretamente; usar `/api/uploads/[filename]` (já implementado)

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js App Router (v15+), TypeScript |
| Banco de dados | PostgreSQL (porta 5433) via `postgres.js` v3 |
| Auth | NextAuth.js v4 — `src/lib/auth.ts` |
| Email | Nodemailer — `src/lib/mailer.ts` |
| IA / Bots | OpenRouter API (`anthropic/claude-3-5-haiku`) |
| WhatsApp | Evolution API (porta 59439, instância `santaclara`) |
| Estilos | Tailwind CSS |
| Deploy | Docker + Docker Compose + Traefik (SSL via Let's Encrypt) |

---

## Variáveis de Ambiente

```env
DATABASE_URL=postgresql://farmacia:nootyalC123@185.137.92.141:5433/farmacia
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://santaclarafarma.com.py
NEXT_PUBLIC_BASE_URL=https://santaclarafarma.com.py
NEXT_PUBLIC_WHATSAPP_NUMBER=595992959689

# IA
OPENROUTER_API_KEY=sk-or-v1-...

# WhatsApp (Evolution API)
EVOLUTION_API_URL=http://185.137.92.141:59439
EVOLUTION_API_KEY=yKPtus8DxrVMs8xh8UcJxKPEw2XJVBHK
EVOLUTION_INSTANCE=santaclara

# Email
SMTP_HOST=mail.santaclarafarma.com.py
SMTP_PORT=465
SMTP_USER=vendas@santaclarafarma.com.py       # usado para confirmações e notificações
SMTP_PASS=@lquinG#l33
IMAP_HOST=mail.santaclarafarma.com.py
IMAP_PORT=993
IMAP_USER=pagamentos@santaclarafarma.com.py
IMAP_PASS=@lquinG#l33
SMTP_CONTACT_USER=contacto@santaclarafarma.com.py
SMTP_CONTACT_PASS=@lquinG#l33

# Cron (follow-up WhatsApp)
CRON_SECRET=def710676a97b996f57b140221306a6e725e5cf39116447f
```

---

## Banco de Dados

Conexão: `postgres.js` via `src/lib/db/index.ts` (exporta `sql` como default)

**Atenção `sql.json()`:** Para colunas JSONB, sempre usar `sql.json(value as never)` — `JSON.stringify()` não funciona corretamente com postgres.js v3.

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `products` | Produtos (id, name, price, stock, active, images[], category_id, brand_id) |
| `orders` | Pedidos (id, status, total, shipping_address JSONB, customer_name/email/phone, user_id, notes, payment_method) |
| `order_items` | Itens dos pedidos (order_id, product_id, product_name, quantity, unit_price, total_price) |
| `users` | Clientes cadastrados (id, name, email, password_hash, is_admin, email_verified) |
| `chat_sessions` | Sessões de chat (session_id, channel, messages JSONB[], context JSONB, bot_pausado, last_user_msg_at, follow_up_sent, updated_at) |
| `whatsapp_contacts` | Contatos do WhatsApp (phone, name, email) |
| `categories` | Categorias de produtos |
| `brands` | Marcas de produtos |
| `coupons` | Cupons de desconto |
| `payment_methods` | Métodos de pagamento (pix, transferência) |
| `site_settings` | Configurações do site (key TEXT PK, value JSONB) |

### Status de pedidos (enum `order_status`)
`pending` → `proof_received` → `paid` → `processing` → `shipped` → `delivered`
Cancelamento: `cancelled`, `refunded`

---

## Arquivos-chave

### Bots / IA
| Arquivo | Função |
|---------|--------|
| `src/lib/whatsapp/claude.ts` | Bot WhatsApp — prompt, fluxo, `generateReply()` |
| `src/lib/site/claude.ts` | Bot site — prompt, fluxo, `generateSiteReply()` |
| `src/lib/whatsapp/products.ts` | Busca produtos do banco para o contexto do bot |
| `src/lib/whatsapp/session.ts` | Gerencia histórico de mensagens (`getSession`, `addMessage`, `clearSession`) |
| `src/lib/settings.ts` | Lê configurações do banco (`getSetting`, `getAllSettings`) |

### API Routes
| Rota | Função |
|------|--------|
| `src/app/api/whatsapp/webhook/route.ts` | Recebe mensagens do WhatsApp (Evolution API) |
| `src/app/api/whatsapp/followup/route.ts` | Cron endpoint — envia follow-up após inatividade |
| `src/app/api/chat/route.ts` | Chat do site (Clarita) |
| `src/app/api/orders/route.ts` | Criação de pedidos pelo carrinho do site |
| `src/app/api/admin/settings/route.ts` | GET/POST configurações do admin |
| `src/app/api/admin/pedidos/[id]/route.ts` | Atualização de status de pedido (dispara emails) |
| `src/app/api/uploads/[filename]/route.ts` | Serve arquivos de upload (standalone workaround) |
| `src/app/api/admin/upload/route.ts` | Upload de imagens de produtos |

### Admin Panel
| Rota | Função |
|------|--------|
| `/admin` | Dashboard |
| `/admin/pedidos` | Kanban de pedidos |
| `/admin/produtos` | Gerenciar produtos |
| `/admin/conversas` | Conversas WhatsApp em tempo real |
| `/admin/configuracoes` | Configurações (atacado, follow-up, horários) |

### Frontend
| Arquivo | Função |
|---------|--------|
| `src/app/admin/AdminNav.tsx` | Navegação do admin |
| `src/app/admin/pedidos/KanbanBoard.tsx` | Kanban de pedidos |
| `src/components/layout/Header.tsx` | Header principal (busca, carrinho) |
| `src/app/conta/pedidos/page.tsx` | Pedidos do cliente |

---

## Bot WhatsApp — Fluxo

Estados: `INICIO` → `EXPLORANDO` → `MONTANDO_PEDIDO` → `CONFIRMANDO_PEDIDO` → `AGUARDANDO_ENTREGA` → `AGUARDANDO_ENDERECO` (delivery) / skip (retirada) → `AGUARDANDO_NOME` → `AGUARDANDO_EMAIL` → `FINALIZADO`

- Respostas curtas (máx 3 linhas), tom animado
- Protocolo JSON ao final de cada resposta: `|||JSON|||{...}|||FIM|||`
- Merge defensivo do carrinho no webhook (preserva itens se bot retornou menos)
- Bot pausado (`bot_pausado = true`): mensagem salva mas sem resposta automática
- Follow-up: após N minutos de inatividade (configurável), envia mensagem de reativação
- Atacado: envia card de contato do atendente (número configurável em `/admin/configuracoes`)
- Emoji 🤔 proibido

## Bot Site — Fluxo

Igual ao WhatsApp, mas:
- Canal mais consultivo (pode explicar produtos, verificar pedidos anteriores)
- Usuários logados pulam passos de nome/email
- Atacado: responde com número de WhatsApp no texto (sem card)
- Estado extra `AGUARDANDO_EMAIL` apenas para não-logados

---

## Email

Todos os emails passam por `src/lib/mailer.ts`:

| Função | Trigger | De | Para |
|--------|---------|-----|------|
| `sendOrderConfirmationEmail` | Pedido via carrinho do site | vendas@ | cliente |
| `sendNewOrderAdminEmail` | Qualquer novo pedido (bot ou carrinho) | vendas@ | pedidos@santaclarafarma.com.py |
| `sendPaymentConfirmedEmail` | Status → `paid` | pagamentos@ | cliente |
| `sendStatusUpdateEmail` | Mudança de status | vendas@ | cliente |
| `sendVerificationEmail` | Cadastro novo | contacto@ | cliente |
| `sendWelcomeEmail` | Email verificado | contacto@ | cliente |

---

## Evolution API (WhatsApp)

- Base URL: `http://185.137.92.141:59439`
- Instância: `santaclara` (ownerJid: `595992959689`)
- API Key: `yKPtus8DxrVMs8xh8UcJxKPEw2XJVBHK`
- Webhook configurado em: `https://santaclarafarma.com.py/api/whatsapp/webhook`
- Evento: `MESSAGES_UPSERT`
- Funções em `src/lib/whatsapp/evolution.ts`: `sendMessage`, `sendContact`, `sendCatalog`

---

## Infraestrutura

- **Traefik:** proxy reverso + SSL (Let's Encrypt) — `/opt/traefik/`
- **systemd:** `farmacia-stack.service` — reinicia Traefik + farmacia-app no boot
- **Cron (root):** `*/1 * * * *` → chama `/api/whatsapp/followup` com header `x-cron-secret`
- **Postgres:** container `bot-postgres` na porta `5433`
- **Backup:** cron diário às 3h → `/root/backup-farmacia.sh`

---

## Notas Importantes

1. **Duplicate columns:** `SELECT o.*` junto com expressões `AS customer_name` causa conflito no postgres.js — sempre usar SELECT explícito
2. **JSONB:** usar `sql.json()` para bindings, nunca `JSON.stringify()`
3. **Standalone:** arquivos adicionados em `public/` em runtime não são servidos automaticamente — usar `/api/uploads/[filename]`
4. **Imagens de produtos:** URLs devem usar `/api/uploads/filename.jpg` (não `/uploads/filename.jpg`)
5. **Histórico de chat:** limitado a 20 mensagens por sessão (`HISTORY_LIMIT`)
