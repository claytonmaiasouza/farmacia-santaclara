import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function isAdmin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (await createClient()) as any;
  const { data: { user } } = await db.auth.getUser();
  if (!user) return false;
  const { data } = await db.from("profiles").select("is_admin").eq("id", user.id).single();
  return data?.is_admin === true;
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  if (!await isAdmin()) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const { id } = await params;
  const { status } = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (await createClient()) as any;

  const VALID = ["pending","paid","processing","shipped","delivered","cancelled","refunded"];
  if (!VALID.includes(status)) return NextResponse.json({ error: "Status inválido" }, { status: 400 });

  const { error } = await db.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
