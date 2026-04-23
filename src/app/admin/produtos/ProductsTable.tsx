"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Pencil, Search, X } from "lucide-react";
import AdminDeleteProduct from "./DeleteButton";

interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  image_url: string | null;
  brand_name: string | null;
  category_name: string | null;
  parent_name: string | null;
  grandparent_name: string | null;
}

function groupByCategory(products: ProductRow[]) {
  const map = new Map<string, { label: string; items: ProductRow[] }>();
  for (const p of products) {
    const key = p.category_name ?? "__sem_categoria__";
    const parts = [p.grandparent_name, p.parent_name, p.category_name].filter(Boolean);
    const label = parts.length > 0 ? parts.join(" › ") : "Sem categoria";
    if (!map.has(key)) map.set(key, { label, items: [] });
    map.get(key)!.items.push(p);
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

export default function ProductsTable({ products }: { products: ProductRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.brand_name ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (p.category_name ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : products;

  const groups = groupByCategory(filtered);

  return (
    <>
      {/* Busca */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#718096]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, marca ou categoria..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-[#e2e8f0] rounded-xl bg-white focus:outline-none focus:border-[#2B7DD4]"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#1a202c]"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] py-16 text-center">
          <Package size={48} className="text-[#e2e8f0] mx-auto mb-4" />
          <p className="text-[#718096]">Nenhum produto encontrado{query ? ` para "${query}"` : ""}.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {query && (
            <p className="text-xs text-[#718096]">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &quot;{query}&quot;</p>
          )}
          {groups.map((group) => (
            <div key={group.label} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <div className="px-5 py-3 bg-[#f4f6f8] border-b border-[#e2e8f0] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#718096] uppercase tracking-wide">{group.label}</span>
                <span className="text-xs text-[#718096]">{group.items.length} produto{group.items.length !== 1 ? "s" : ""}</span>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#e2e8f0]">
                  {group.items.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f4f6f8] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#f4f6f8] border border-[#e2e8f0] flex-shrink-0 overflow-hidden">
                            {p.image_url ? (
                              <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-contain w-full h-full p-0.5" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={18} className="text-[#cbd5e0]" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#1a202c] line-clamp-1">{p.name}</p>
                            <p className="text-xs text-[#718096]">{p.brand_name ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#1A5C2A] hidden lg:table-cell w-32">
                        R$ {Number(p.price).toFixed(2).replace(".", ",")}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell w-24">
                        <span className={`font-medium ${p.stock <= 5 ? "text-red-600" : "text-[#718096]"}`}>
                          {p.stock} un.
                        </span>
                      </td>
                      <td className="px-4 py-3 w-24">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${p.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-[#718096]"}`}>
                          {p.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 w-20">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/produtos/${p.id}`} className="p-1.5 text-[#718096] hover:text-[#2B7DD4] hover:bg-blue-50 rounded-lg transition-colors">
                            <Pencil size={15} />
                          </Link>
                          <AdminDeleteProduct id={p.id} name={p.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
