import nodemailer from "nodemailer";

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.santaclarafarma.com.py",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER ?? "pagamentos@santaclarafarma.com.py",
      pass: process.env.SMTP_PASS ?? process.env.IMAP_PASS,
    },
  });
}

interface PaymentMethod {
  type: string;
  label: string;
  key_value: string;
  holder: string | null;
  bank: string | null;
  agency: string | null;
  account: string | null;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface SendOrderEmailParams {
  to: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  delivery: string;
  paymentMethods: PaymentMethod[];
}

function buildPaymentBlock(methods: PaymentMethod[]): string {
  if (methods.length === 0) {
    return `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:8px">
        <p style="margin:0;font-size:14px;color:#166534">
          <strong>💳 Chave Pix:</strong> XXXXXXXXXXX
        </p>
      </div>`;
  }

  return methods.map((m) => {
    if (m.type === "pix") {
      return `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:8px">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#166534">${m.label}</p>
          <p style="margin:0;font-size:14px;color:#1a202c">💳 Chave Pix: <strong style="font-family:monospace">${m.key_value}</strong></p>
          ${m.holder ? `<p style="margin:4px 0 0;font-size:12px;color:#4b5563">Titular: ${m.holder}</p>` : ""}
        </div>`;
    } else {
      return `
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:8px">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1e40af">${m.label}</p>
          ${m.bank ? `<p style="margin:2px 0;font-size:13px;color:#1a202c">🏦 Banco: <strong>${m.bank}</strong></p>` : ""}
          ${m.agency ? `<p style="margin:2px 0;font-size:13px;color:#1a202c">Agência: <strong>${m.agency}</strong></p>` : ""}
          ${m.account ? `<p style="margin:2px 0;font-size:13px;color:#1a202c">Conta: <strong>${m.account}</strong></p>` : ""}
          ${m.key_value ? `<p style="margin:2px 0;font-size:13px;color:#1a202c">Pix: <strong style="font-family:monospace">${m.key_value}</strong></p>` : ""}
          ${m.holder ? `<p style="margin:4px 0 0;font-size:12px;color:#4b5563">Titular: ${m.holder}</p>` : ""}
        </div>`;
    }
  }).join("");
}

function buildEmailHtml(p: SendOrderEmailParams): string {
  const code = p.orderId.slice(0, 8).toUpperCase();
  const itemsHtml = p.items.map((i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#1a202c">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#718096;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#1a202c;text-align:right">R$ ${(i.price * i.quantity).toFixed(2).replace(".", ",")}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

    <!-- Header -->
    <div style="background:#1A5C2A;padding:28px 32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">Farmácia Santa Clara</h1>
      <p style="margin:6px 0 0;color:#a7f3d0;font-size:14px">santaclarafarma.com.py</p>
    </div>

    <!-- Confirmação -->
    <div style="padding:28px 32px 0">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
        <p style="margin:0 0 6px;font-size:28px">✅</p>
        <h2 style="margin:0 0 4px;color:#166534;font-size:18px">Pedido Confirmado!</h2>
        <p style="margin:0;color:#4b5563;font-size:14px">Olá, <strong>${p.customerName}</strong>! Recebemos seu pedido com sucesso.</p>
        <div style="display:inline-block;background:#166534;color:#fff;font-family:monospace;font-size:16px;font-weight:700;padding:6px 16px;border-radius:8px;margin-top:12px">#${code}</div>
      </div>

      <!-- Itens -->
      <h3 style="margin:0 0 12px;color:#1a202c;font-size:15px">Itens do pedido</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="padding:10px 12px;font-size:12px;color:#718096;text-align:left;font-weight:600">Produto</th>
            <th style="padding:10px 12px;font-size:12px;color:#718096;text-align:center;font-weight:600">Qtd</th>
            <th style="padding:10px 12px;font-size:12px;color:#718096;text-align:right;font-weight:600">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr style="background:#f8fafc">
            <td colspan="2" style="padding:10px 12px;font-size:14px;font-weight:700;color:#1a202c">Total</td>
            <td style="padding:10px 12px;font-size:15px;font-weight:700;color:#1A5C2A;text-align:right">R$ ${p.total.toFixed(2).replace(".", ",")}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Entrega -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:24px">
        <p style="margin:0;font-size:13px;color:#718096"><strong style="color:#1a202c">Entrega:</strong> ${p.delivery}</p>
      </div>

      <!-- Pagamento -->
      <h3 style="margin:0 0 12px;color:#1a202c;font-size:15px">Como pagar</h3>
      ${buildPaymentBlock(p.paymentMethods)}

      <!-- Comprovante -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin:24px 0">
        <h3 style="margin:0 0 10px;color:#92400e;font-size:15px">📧 Envie o comprovante</h3>
        <p style="margin:0 0 8px;font-size:13px;color:#78350f">Após realizar o pagamento, envie o comprovante (foto ou PDF) para:</p>
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1a202c">pagamentos@santaclarafarma.com.py</p>
        <p style="margin:0;font-size:13px;color:#78350f">No assunto do e-mail, escreva: <strong>Comprovante #${code}</strong></p>
      </div>

      <!-- WhatsApp -->
      <div style="text-align:center;margin-bottom:28px">
        <p style="margin:0 0 12px;font-size:13px;color:#718096">Dúvidas? Fale com nossa equipe:</p>
        <a href="https://wa.me/595992959689" style="display:inline-block;background:#25D366;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none">
          💬 Falar pelo WhatsApp
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af">Farmácia Santa Clara · Ciudad del Este, Paraguay · santaclarafarma.com.py</p>
      <p style="margin:4px 0 0;font-size:11px;color:#9ca3af">🔒 Comunicação segura e criptografada</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendVerificationEmail(params: { to: string; customerName: string; token: string }): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", "santaclarafarma.com.py").replace("http://santaclarafarma", "https://santaclarafarma") ?? "https://santaclarafarma.com.py";
  const link = `${baseUrl}/api/auth/verify-email?token=${params.token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.santaclarafarma.com.py",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py",
      pass: process.env.SMTP_CONTACT_PASS ?? process.env.IMAP_PASS,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:#1A5C2A;padding:28px 32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">Farmácia Santa Clara</h1>
      <p style="margin:6px 0 0;color:#a7f3d0;font-size:14px">santaclarafarma.com.py</p>
    </div>
    <div style="padding:32px">
      <div style="text-align:center;margin-bottom:28px">
        <p style="font-size:40px;margin:0">✉️</p>
        <h2 style="margin:12px 0 6px;color:#1a202c;font-size:20px">Confirme seu e-mail</h2>
        <p style="margin:0;color:#718096;font-size:14px">Olá, <strong>${params.customerName}</strong>! Para ativar sua conta, clique no botão abaixo.</p>
      </div>
      <div style="text-align:center;margin-bottom:28px">
        <a href="${link}" style="display:inline-block;background:#1A5C2A;color:#ffffff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none">
          ✅ Confirmar meu e-mail
        </a>
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:24px">
        <p style="margin:0;font-size:12px;color:#718096">Se o botão não funcionar, copie e cole este link no seu navegador:</p>
        <p style="margin:6px 0 0;font-size:11px;color:#4a5568;word-break:break-all;font-family:monospace">${link}</p>
      </div>
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">Este link expira em 24 horas. Se você não criou uma conta, ignore este e-mail.</p>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af">Farmácia Santa Clara · Ciudad del Este, Paraguay</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Farmácia Santa Clara" <${process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py"}>`,
    to: params.to,
    subject: "Confirme seu e-mail — Farmácia Santa Clara",
    html,
  });
}

export async function sendPasswordResetEmail(params: { to: string; customerName: string; token: string }): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", "santaclarafarma.com.py").replace("http://santaclarafarma", "https://santaclarafarma") ?? "https://santaclarafarma.com.py";
  const link = `${baseUrl}/redefinir-senha?token=${params.token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.santaclarafarma.com.py",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py",
      pass: process.env.SMTP_CONTACT_PASS ?? process.env.IMAP_PASS,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:#1A5C2A;padding:28px 32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">Farmácia Santa Clara</h1>
      <p style="margin:6px 0 0;color:#a7f3d0;font-size:14px">santaclarafarma.com.py</p>
    </div>
    <div style="padding:32px">
      <div style="text-align:center;margin-bottom:28px">
        <p style="font-size:40px;margin:0">🔐</p>
        <h2 style="margin:12px 0 6px;color:#1a202c;font-size:20px">Redefinir senha</h2>
        <p style="margin:0;color:#718096;font-size:14px">Olá, <strong>${params.customerName}</strong>! Recebemos uma solicitação para redefinir sua senha.</p>
      </div>
      <div style="text-align:center;margin-bottom:28px">
        <a href="${link}" style="display:inline-block;background:#1A5C2A;color:#ffffff;font-weight:700;font-size:15px;padding:14px 36px;border-radius:10px;text-decoration:none">
          🔑 Redefinir minha senha
        </a>
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:24px">
        <p style="margin:0;font-size:12px;color:#718096">Se o botão não funcionar, copie e cole este link no seu navegador:</p>
        <p style="margin:6px 0 0;font-size:11px;color:#4a5568;word-break:break-all;font-family:monospace">${link}</p>
      </div>
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">Este link expira em 1 hora. Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.</p>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af">Farmácia Santa Clara · Ciudad del Este, Paraguay</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Farmácia Santa Clara" <${process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py"}>`,
    to: params.to,
    subject: "Redefinir senha — Farmácia Santa Clara",
    html,
  });
}

export async function sendWelcomeEmail(params: { to: string; customerName: string }): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.santaclarafarma.com.py",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py",
      pass: process.env.SMTP_CONTACT_PASS ?? process.env.IMAP_PASS,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">

    <div style="background:#1A5C2A;padding:28px 32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700">Farmácia Santa Clara</h1>
      <p style="margin:6px 0 0;color:#a7f3d0;font-size:14px">santaclarafarma.com.py</p>
    </div>

    <div style="padding:32px">
      <div style="text-align:center;margin-bottom:28px">
        <p style="font-size:36px;margin:0">🎉</p>
        <h2 style="margin:12px 0 6px;color:#1a202c;font-size:20px">Bem-vindo(a), ${params.customerName}!</h2>
        <p style="margin:0;color:#718096;font-size:14px">Sua conta foi criada com sucesso.</p>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-size:14px;color:#166534;font-weight:600">O que você pode fazer agora:</p>
        <ul style="margin:0;padding-left:20px;color:#4b5563;font-size:13px;line-height:1.8">
          <li>Navegar pelo nosso catálogo de produtos</li>
          <li>Adicionar produtos ao carrinho e finalizar pedidos</li>
          <li>Acompanhar seus pedidos na área do cliente</li>
        </ul>
      </div>

      <div style="text-align:center;margin-bottom:28px">
        <a href="https://santaclarafarma.com.py" style="display:inline-block;background:#1A5C2A;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none">
          Acessar o site
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px">

      <p style="margin:0 0 8px;font-size:13px;color:#718096;text-align:center">Dúvidas? Entre em contato:</p>
      <div style="text-align:center">
        <a href="https://wa.me/595992959689" style="display:inline-block;background:#25D366;color:#ffffff;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none">
          💬 WhatsApp
        </a>
      </div>
    </div>

    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af">Farmácia Santa Clara · Ciudad del Este, Paraguay</p>
      <p style="margin:4px 0 0;font-size:11px;color:#9ca3af">🔒 Comunicação segura e criptografada</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Farmácia Santa Clara" <${process.env.SMTP_CONTACT_USER ?? "contacto@santaclarafarma.com.py"}>`,
    to: params.to,
    subject: "Bem-vindo(a) à Farmácia Santa Clara! 🎉",
    html,
  });
}

export async function sendOrderConfirmationEmail(params: SendOrderEmailParams): Promise<void> {
  const transporter = createTransport();
  const code = params.orderId.slice(0, 8).toUpperCase();

  await transporter.sendMail({
    from: `"Farmácia Santa Clara" <${process.env.SMTP_USER ?? "pagamentos@santaclarafarma.com.py"}>`,
    to: params.to,
    subject: `✅ Pedido #${code} confirmado — Farmácia Santa Clara`,
    html: buildEmailHtml(params),
  });
}

function baseHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:#1A5C2A;padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Farmácia Santa Clara</h1>
      <p style="margin:4px 0 0;color:#a7f3d0;font-size:13px">santaclarafarma.com.py</p>
    </div>
    <div style="padding:32px">${content}</div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px 32px;text-align:center">
      <p style="margin:0;font-size:11px;color:#9ca3af">Farmácia Santa Clara · Ciudad del Este, Paraguay</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendPaymentConfirmedEmail(params: {
  to: string;
  customerName: string;
  orderId: string;
  total: number;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.santaclarafarma.com.py",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: {
      user: process.env.IMAP_USER ?? "pagamentos@santaclarafarma.com.py",
      pass: process.env.IMAP_PASS,
    },
  });

  const code = params.orderId.slice(0, 8).toUpperCase();
  const totalFmt = `R$ ${params.total.toFixed(2).replace(".", ",")}`;

  const html = baseHtml(`
    <div style="text-align:center;margin-bottom:24px">
      <p style="font-size:48px;margin:0">✅</p>
      <h2 style="margin:12px 0 6px;color:#1a202c;font-size:20px">Pagamento Confirmado!</h2>
      <p style="margin:0;color:#718096;font-size:14px">Olá, <strong>${params.customerName}</strong>! Recebemos seu pagamento.</p>
    </div>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="margin:0 0 6px;font-size:13px;color:#4b5563">Pedido</p>
      <p style="margin:0;font-family:monospace;font-size:20px;font-weight:700;color:#166534">#${code}</p>
      <p style="margin:8px 0 0;font-size:16px;font-weight:700;color:#1A5C2A">${totalFmt}</p>
    </div>
    <p style="font-size:14px;color:#374151;text-align:center;margin:0 0 24px">
      Seu pedido entrou em preparo e em breve você receberá uma atualização sobre o envio. 🚀
    </p>
    <div style="text-align:center">
      <a href="https://wa.me/595992959689" style="display:inline-block;background:#25D366;color:#fff;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none">💬 Falar pelo WhatsApp</a>
    </div>
  `);

  await transporter.sendMail({
    from: `"Farmácia Santa Clara" <${process.env.IMAP_USER ?? "pagamentos@santaclarafarma.com.py"}>`,
    to: params.to,
    subject: `✅ Pagamento confirmado — Pedido #${code}`,
    html,
  });
}

const STATUS_INFO: Record<string, { emoji: string; title: string; body: string; color: string }> = {
  processing: {
    emoji: "🔧",
    title: "Pedido em preparo!",
    body: "Estamos preparando seus produtos com todo o cuidado. Em breve seu pedido será enviado!",
    color: "#6366f1",
  },
  shipped: {
    emoji: "🚚",
    title: "Pedido enviado!",
    body: "Seu pedido está a caminho! Aguarde a entrega no endereço informado.",
    color: "#8b5cf6",
  },
  delivered: {
    emoji: "📦",
    title: "Pedido entregue!",
    body: "Seu pedido foi entregue com sucesso. Obrigado por comprar na Farmácia Santa Clara!",
    color: "#22c55e",
  },
  cancelled: {
    emoji: "❌",
    title: "Pedido cancelado",
    body: "Seu pedido foi cancelado. Se tiver dúvidas, entre em contato com nossa equipe.",
    color: "#ef4444",
  },
  refunded: {
    emoji: "💰",
    title: "Reembolso processado",
    body: "Seu reembolso foi processado. O valor será devolvido conforme o meio de pagamento utilizado.",
    color: "#6b7280",
  },
};

export async function sendStatusUpdateEmail(params: {
  to: string;
  customerName: string;
  orderId: string;
  total: number;
  status: string;
}): Promise<void> {
  const info = STATUS_INFO[params.status];
  if (!info) return;

  const transporter = createTransport();
  const code = params.orderId.slice(0, 8).toUpperCase();
  const totalFmt = `R$ ${params.total.toFixed(2).replace(".", ",")}`;

  const html = baseHtml(`
    <div style="text-align:center;margin-bottom:24px">
      <p style="font-size:48px;margin:0">${info.emoji}</p>
      <h2 style="margin:12px 0 6px;color:#1a202c;font-size:20px">${info.title}</h2>
      <p style="margin:0;color:#718096;font-size:14px">Olá, <strong>${params.customerName}</strong>!</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:13px;color:#718096">Pedido</p>
      <p style="margin:0;font-family:monospace;font-size:18px;font-weight:700;color:${info.color}">#${code}</p>
      <p style="margin:6px 0 0;font-size:14px;font-weight:600;color:#1a202c">${totalFmt}</p>
    </div>
    <p style="font-size:14px;color:#374151;text-align:center;line-height:1.7;margin:0 0 24px">${info.body}</p>
    <div style="text-align:center">
      <a href="https://wa.me/595992959689" style="display:inline-block;background:#25D366;color:#fff;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none">💬 Falar pelo WhatsApp</a>
    </div>
  `);

  await transporter.sendMail({
    from: `"Farmácia Santa Clara" <${process.env.SMTP_USER ?? "vendas@santaclarafarma.com.py"}>`,
    to: params.to,
    subject: `${info.emoji} ${info.title} — Pedido #${code}`,
    html,
  });
}
