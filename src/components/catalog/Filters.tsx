"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

const ORDER_OPTIONS = [
  { value: "created_at", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name", label: "A - Z" },
];

const PRICE_RANGES = [
  { value: "", label: "Todos os preços" },
  { value: "0-30", label: "Até R$ 30" },
  { value: "30-80", label: "R$ 30 a R$ 80" },
  { value: "80-200", label: "R$ 80 a R$ 200" },
  { value: "200+", label: "Acima de R$ 200" },
];

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const order = searchParams.get("ordem") ?? "created_at";
  const preco = searchParams.get("preco") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("pagina"); // volta p/ pág 1 ao filtrar
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-[#718096]">
        <SlidersHorizontal size={16} />
        Filtros:
      </div>

      {/* Ordenação */}
      <select
        value={order}
        onChange={(e) => update("ordem", e.target.value)}
        className="text-sm border border-[#e2e8f0] rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#2B7DD4] cursor-pointer"
      >
        {ORDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Faixa de preço */}
      <select
        value={preco}
        onChange={(e) => update("preco", e.target.value)}
        className="text-sm border border-[#e2e8f0] rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#2B7DD4] cursor-pointer"
      >
        {PRICE_RANGES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
    </div>
  );
}
