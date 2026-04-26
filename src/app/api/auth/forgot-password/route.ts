import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import sql from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });

  const [user] = await sql`SELECT id, full_name FROM users WHERE email = ${email} LIMIT 1`;

  // Always return success to avoid user enumeration
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
    ON CONFLICT (token) DO NOTHING
  `;

  sendPasswordResetEmail({
    to: email,
    customerName: user.full_name ?? email,
    token,
  }).catch((err) => console.error("[Mailer reset]", err));

  return NextResponse.json({ ok: true });
}
