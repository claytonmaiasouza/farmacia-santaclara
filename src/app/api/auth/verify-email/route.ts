import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verificar-email?error=invalid", req.url));
  }

  const rows = await sql`
    SELECT id, email, full_name, email_verified, verification_token_expires_at
    FROM users
    WHERE verification_token = ${token}
    LIMIT 1
  `;

  const user = rows[0];

  if (!user) {
    return NextResponse.redirect(new URL("/verificar-email?error=invalid", req.url));
  }

  if (user.email_verified) {
    return NextResponse.redirect(new URL("/verificar-email?ok=1&already=1", req.url));
  }

  if (user.verification_token_expires_at && new Date(user.verification_token_expires_at as string) < new Date()) {
    return NextResponse.redirect(new URL("/verificar-email?error=expired", req.url));
  }

  await sql`
    UPDATE users
    SET email_verified = TRUE, verification_token = NULL, verification_token_expires_at = NULL
    WHERE id = ${user.id as string}
  `;

  sendWelcomeEmail({
    to: user.email as string,
    customerName: (user.full_name as string) ?? "Cliente",
  }).catch((err) => console.error("[Mailer welcome]", err));

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace("localhost:3000", "santaclarafarma.com.py").replace("http://santaclarafarma", "https://santaclarafarma") ?? "https://santaclarafarma.com.py";
  return NextResponse.redirect(new URL("/verificar-email?ok=1", baseUrl));
}
