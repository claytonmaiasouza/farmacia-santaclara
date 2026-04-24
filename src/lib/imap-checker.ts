import { ImapFlow } from "imapflow";
import sql from "@/lib/db";
import fs from "fs";
import path from "path";

const PROOFS_DIR = path.join(process.cwd(), "public", "uploads", "proofs");

async function ensureSchema() {
  try {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS proof_data JSONB`;
    await sql`ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'proof_received' AFTER 'pending'`;
  } catch { /* já existe */ }
}

function ensureProofsDir() {
  if (!fs.existsSync(PROOFS_DIR)) {
    fs.mkdirSync(PROOFS_DIR, { recursive: true });
  }
}

type MimeNode = {
  type?: string;
  subtype?: string;
  part?: string;
  disposition?: string;
  dispositionParameters?: Record<string, string>;
  childNodes?: MimeNode[];
};

function findAttachments(node: MimeNode): Array<{ part: string; subtype: string; filename?: string }> {
  if (!node) return [];
  const results: Array<{ part: string; subtype: string; filename?: string }> = [];

  if (node.childNodes) {
    for (const child of node.childNodes) {
      results.push(...findAttachments(child));
    }
  }

  const type = (node.type ?? "").toLowerCase();
  const subtype = (node.subtype ?? "").toLowerCase();
  const isImage = type === "image";
  const isPdf = type === "application" && subtype === "pdf";
  const isAttachment = node.disposition === "attachment";

  if (node.part && (isImage || isPdf || isAttachment)) {
    results.push({
      part: node.part,
      subtype,
      filename: node.dispositionParameters?.filename,
    });
  }

  return results;
}

function extFromSubtype(subtype: string, filename?: string): string {
  if (filename) {
    const ext = path.extname(filename);
    if (ext) return ext;
  }
  const map: Record<string, string> = {
    jpeg: ".jpg", jpg: ".jpg", png: ".png", gif: ".gif",
    webp: ".webp", pdf: ".pdf", "octet-stream": ".bin",
  };
  return map[subtype] ?? `.${subtype}`;
}

export interface ProofResult {
  orderId: string;
  orderCode: string;
  emailFrom: string;
  emailSubject: string;
  proofFile?: string;
}

export async function checkPaymentEmails(): Promise<{ found: ProofResult[]; error?: string }> {
  const host = process.env.IMAP_HOST;
  const port = Number(process.env.IMAP_PORT ?? 993);
  const user = process.env.IMAP_USER;
  const pass = process.env.IMAP_PASS;

  if (!host || !user || !pass) {
    return { found: [], error: "IMAP não configurado. Defina IMAP_HOST, IMAP_USER e IMAP_PASS." };
  }

  await ensureSchema();
  ensureProofsDir();

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
        const msg = await client.fetchOne(
          String(uid),
          { envelope: true, bodyStructure: true },
          { uid: true }
        );
        if (!msg) continue;

        const subject = msg.envelope?.subject ?? "";
        const from = msg.envelope?.from?.[0]?.address ?? "";

        let orderId: string | null = null;

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

        if (!orderId) continue;

        // Baixar o primeiro anexo (PDF ou imagem)
        let proofFile: string | null = null;
        const attachments = findAttachments(msg.bodyStructure as MimeNode ?? {});

        if (attachments.length > 0) {
          const ap = attachments[0];
          const ext = extFromSubtype(ap.subtype, ap.filename);
          const filename = `${orderId}-${Date.now()}${ext}`;
          const filePath = path.join(PROOFS_DIR, filename);

          try {
            const { content } = await client.download(String(uid), ap.part, { uid: true });
            await new Promise<void>((resolve, reject) => {
              const ws = fs.createWriteStream(filePath);
              content.pipe(ws);
              ws.on("finish", resolve);
              ws.on("error", reject);
              content.on("error", reject);
            });
            proofFile = `/api/proofs/${filename}`;
          } catch (e) {
            console.error("[IMAP] Falha ao salvar anexo:", e);
          }
        }

        const proofData = {
          email_from: from,
          email_subject: subject,
          received_at: new Date().toISOString(),
          proof_file: proofFile,
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
          proofFile: proofFile ?? undefined,
        });
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
