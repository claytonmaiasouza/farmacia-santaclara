"use client";

import { useState, useTransition } from "react";

interface Product {
  id: string;
  name: string;
  brand_name: string | null;
  image_url: string | null;
  price: number;
  in_promo: boolean;
  in_bestseller: boolean;
  in_launch: boolean;
}

interface Props {
  products: Product[];
}

export default function CarrosselToggles({ products: initial }: Props) {
  const [products, setProducts] = useState(initial);
  const [pending, startTransition] = useTransition();

  async function toggle(id: string, field: "in_promo" | "in_bestseller" | "in_launch", value: boolean) {
    startTransition(async () => {
      await fetch(`/api/admin/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    });
  }

  const promoCount = products.filter((p) => p.in_promo).length;
  const bestsellerCount = products.filter((p) => p.in_bestseller).length;
  const launchCount = products.filter((p) => p.in_launch).length;

  return (
    <div>
      <div className="flex gap-4 mb-6 text-sm text-[#718096] flex-wrap">
        <span>🏷️ Promoção: <strong className="text-[#1a202c]">{promoCount}</strong> produtos</span>
        <span>⭐ Mais Vendidos: <strong className="text-[#1a202c]">{bestsellerCount}</strong> produtos</span>
        <span>🆕 Lançamentos: <strong className="text-[#1a202c]">{launchCount}</strong> produtos</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide">Produto</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide w-40">🏷️ Promoção</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide w-40">⭐ Mais Vendidos</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide w-40">🆕 Lançamentos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f6f8]">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-[#f4f6f8] p-0.5 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[#1a202c] truncate">{p.name}</p>
                      {p.brand_name && <p className="text-xs text-[#718096] truncate">{p.brand_name}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={pending}
                    onClick={() => toggle(p.id, "in_promo", !p.in_promo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                      p.in_promo
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {p.in_promo ? "✓ Incluído" : "Adicionar"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={pending}
                    onClick={() => toggle(p.id, "in_bestseller", !p.in_bestseller)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                      p.in_bestseller
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {p.in_bestseller ? "✓ Incluído" : "Adicionar"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={pending}
                    onClick={() => toggle(p.id, "in_launch", !p.in_launch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                      p.in_launch
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        : "bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {p.in_launch ? "✓ Incluído" : "Adicionar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
