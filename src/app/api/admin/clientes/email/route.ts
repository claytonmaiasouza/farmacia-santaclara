import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Não autorizado" }, { status: 403 }); }

  const { recipients, subject, message } = await req.json();

  if (!recipients?.length || !subject || !message) {
    return NextResponse.json({ error: "Destinatários, assunto e mensagem são obrigatórios." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.santaclarafarma.com.py",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py",
      pass: process.env.SMTP_CONTACT_PASS ?? process.env.IMAP_PASS,
    },
  });

  const from = `"Farmácia Santa Clara" <${process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py"}>`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:#1A5C2A;padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Farmácia Santa Clara</h1>
      <p style="margin:4px 0 0;color:#a7f3d0;font-size:13px">santaclarafarma.com.py</p>
    </div>
    <div style="padding:32px">
      <div style="font-size:14px;color:#374151;line-height:1.8;white-space:pre-wrap">${message.replace(/\n/g, "<br>")}</div>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 20px">
      <div style="text-align:center">
        <a href="https://wa.me/595992959689" style="display:inline-block;background:#25D366;color:#fff;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none">💬 Falar pelo WhatsApp</a>
      </div>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px 32px;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af">Farmácia Santa Clara · Ciudad del Este, Paraguay · santaclarafarma.com.py</p>
    </div>
  </div>
</body>
</html>`;

  let sent = 0;
  const errors: string[] = [];

  for (const email of recipients as string[]) {
    try {
      await transporter.sendMail({ from, to: email, subject, html });
      sent++;
    } catch {
      errors.push(email);
    }
  }

  return NextResponse.json({ sent, errors });
}
