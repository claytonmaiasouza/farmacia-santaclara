import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sql from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing[0]) {
    return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
  }

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(64)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMPTZ`;

  const hashed = await bcrypt.hash(password, 12);
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [user] = await sql`
    INSERT INTO users (email, password, full_name, email_verified, verification_token, verification_token_expires_at)
    VALUES (${email}, ${hashed}, ${name}, FALSE, ${token}, ${expiresAt.toISOString()})
    RETURNING id, email, full_name
  `;

  sendVerificationEmail({ to: email, customerName: name, token }).catch((err) =>
    console.error("[Mailer verify]", err)
  );

  return NextResponse.json(user, { status: 201 });
}
