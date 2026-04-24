import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { checkPaymentEmails } from "@/lib/imap-checker";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const result = await checkPaymentEmails();
  return NextResponse.json(result);
}
