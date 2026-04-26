import { NextResponse } from "next/server";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await sql`
    SELECT type, label, key_value, holder, bank, agency, account
    FROM payment_methods
    WHERE active = true
    ORDER BY created_at ASC
  `;
  return NextResponse.json(rows);
}
