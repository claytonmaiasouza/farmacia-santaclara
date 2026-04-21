import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [user] = await sql`
    SELECT full_name, phone, cpf, birth_date, email
    FROM users WHERE id = ${session.user.id} LIMIT 1
  `;
  return NextResponse.json(user ?? {});
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { full_name, phone, cpf, birth_date } = await req.json();

  await sql`
    UPDATE users SET
      full_name  = ${full_name ?? null},
      phone      = ${phone ?? null},
      cpf        = ${cpf ?? null},
      birth_date = ${birth_date || null}
    WHERE id = ${session.user.id}
  `;

  return NextResponse.json({ ok: true });
}
