import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || !password) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });

  const [row] = await sql`
    SELECT id, user_id, expires_at, used FROM password_reset_tokens
    WHERE token = ${token} LIMIT 1
  `;

  if (!row) return NextResponse.json({ error: "Link inválido ou expirado." }, { status: 400 });
  if (row.used) return NextResponse.json({ error: "Este link já foi utilizado." }, { status: 400 });
  if (new Date(row.expires_at) < new Date()) return NextResponse.json({ error: "Link expirado. Solicite um novo." }, { status: 400 });

  const hashed = await bcrypt.hash(password, 12);

  await sql`UPDATE users SET password = ${hashed} WHERE id = ${row.user_id}`;
  await sql`UPDATE password_reset_tokens SET used = true WHERE id = ${row.id}`;

  return NextResponse.json({ ok: true });
}
