import { NextResponse } from "next/server";

export const revalidate = 300; // cache 5 minutos

interface CambioItem {
  isoCode: string;
  purchasePrice: number;
  salePrice: number;
  updatedAt: string;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://www.cambioschaco.com.py/api/branch_office/1/exchange",
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error("Cambios Chaco API error");

    const data = await res.json();
    const items: CambioItem[] = data.items ?? [];

    const usd = items.find((i) => i.isoCode === "USD");
    const brl = items.find((i) => i.isoCode === "BRL");

    if (!usd || !brl) throw new Error("Moedas não encontradas");

    const usdGs   = usd.salePrice;
    const brlGs   = brl.salePrice;
    const usdBrl  = (usdGs / brlGs).toFixed(2);

    return NextResponse.json({
      usd_gs:   usdGs,
      brl_gs:   brlGs,
      usd_brl:  usdBrl,
      updatedAt: data.updateTs,
    });
  } catch {
    // fallback com valores fixos caso a API esteja indisponível
    return NextResponse.json({
      usd_gs:   6500,
      brl_gs:   1260,
      usd_brl:  "5.16",
      updatedAt: null,
    });
  }
}
