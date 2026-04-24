import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mailer";

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

  const hashed = await bcrypt.hash(password, 12);

  const [user] = await sql`
    INSERT INTO users (email, password, full_name)
    VALUES (${email}, ${hashed}, ${name})
    RETURNING id, email, full_name
  `;

  sendWelcomeEmail({ to: email, customerName: name }).catch((err) => console.error("[Mailer welcome]", err));

  return NextResponse.json(user, { status: 201 });
}
