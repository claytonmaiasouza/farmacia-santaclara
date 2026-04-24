import { ImapFlow } from "imapflow";
import sql from "@/lib/db";

async function ensureProofColumn() {
  try {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_data JSONB`;
    await sql`ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'proof_received' AFTER 'pending'`;
  } catch {
    // já existe — ignora
  }
}

export interface ProofResult {
  orderId: string;
  orderCode: string;
  emailFrom: string;
  emailSubject: string;
}

export async function checkPaymentEmails(): Promise<{ found: ProofResult[]; error?: string }> {
  const host = process.env.IMAP_HOST;
  const port = Number(process.env.IMAP_PORT ?? 993);
  const user = process.env.IMAP_USER;
  const pass = process.env.IMAP_PASS;

  if (!host || !user || !pass) {
    return { found: [], error: "IMAP não configurado. Defina IMAP_HOST, IMAP_USER e IMAP_PASS." };
  }

  await ensureProofColumn();

  const client = new ImapFlow({
    host,
    port,
    secure: port === 993,
    auth: { user, pass },
    logger: false,
  });

  const found: ProofResult[] = [];

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");

    try {
      const uids = await client.search({ seen: false }, { uid: true });

      for (const uid of uids) {
        const msg = await client.fetchOne(String(uid), { envelope: true }, { uid: true });
        if (!msg) continue;

        const subject = msg.envelope?.subject ?? "";
        const from = msg.envelope?.from?.[0]?.address ?? "";

        let orderId: string | null = null;

        // Tenta achar o código do pedido no assunto (primeiros 8 chars do UUID em maiúsculo)
        const codeMatch = subject.match(/[A-F0-9]{8}/i);
        if (codeMatch) {
          const prefix = codeMatch[0].toUpperCase();
          const rows = await sql`
            SELECT id FROM orders
            WHERE UPPER(LEFT(id::text, 8)) = ${prefix}
              AND status = 'pending'
            LIMIT 1
          `;
          if (rows[0]) orderId = rows[0].id as string;
        }

        // Fallback: busca pelo e-mail do cliente
        if (!orderId && from) {
          const rows = await sql`
            SELECT id FROM orders
            WHERE customer_email = ${from}
              AND status = 'pending'
            ORDER BY created_at DESC
            LIMIT 1
          `;
          if (rows[0]) orderId = rows[0].id as string;
        }

        if (orderId) {
          const proofData = {
            email_from: from,
            email_subject: subject,
            received_at: new Date().toISOString(),
          };

          await sql`
            UPDATE orders
            SET status = 'proof_received',
                proof_data = ${sql.json(proofData)}
            WHERE id = ${orderId}
          `;

          await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });

          found.push({
            orderId,
            orderCode: orderId.slice(0, 8).toUpperCase(),
            emailFrom: from,
            emailSubject: subject,
          });
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { found, error: message };
  }

  return { found };
}
