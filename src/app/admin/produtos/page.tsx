import Link from "next/link";
import Image from "next/image";
import sql from "@/lib/db";
import { Plus, Pencil, Package } from "lucide-react";
import type { Product } from "@/types/database";
import AdminDeleteProduct from "./DeleteButton";
import ExportButton from "./ExportButton";

interface ProductRow extends Product {
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

export default async function AdminProductsPage() {
  const products = await sql<ProductRow[]>`
    SELECT p.*,
           b.name AS brand_name,
           c.name AS category_name,
           pc.name AS parent_name,
           gpc.name AS grandparent_name
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN categories pc ON pc.id = c.parent_id
    LEFT JOIN categories gpc ON gpc.id = pc.parent_id
    ORDER BY grandparent_name NULLS LAST, parent_name NULLS LAST, category_name NULLS LAST, p.name
  `;

  const groups = groupByCategory(products);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a202c]">Produtos</h1>
          <p className="text-sm text-[#718096]">{products.length} produto{products.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton />
          <Link
            href="/admin/produtos/novo"
            className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} /> Novo produto
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] py-16 text-center">
          <Package size={48} className="text-[#e2e8f0] mx-auto mb-4" />
          <p className="text-[#718096]">Nenhum produto cadastrado.</p>
          <Link href="/admin/produtos/novo" className="text-[#2B7DD4] text-sm mt-2 inline-block hover:underline">
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
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
                              <Image
                                src={p.image_url}
                                alt={p.name}
                                width={40}
                                height={40}
                                className="object-contain w-full h-full p-0.5"
                              />
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
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                          p.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-[#718096]"
                        }`}>
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
    </div>
  );
}
