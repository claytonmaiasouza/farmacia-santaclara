import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Package } from "lucide-react";
import type { Product, Brand, Category } from "@/types/database";
import AdminDeleteProduct from "./DeleteButton";

interface ProductRow extends Product {
  brand: Brand | null;
  category: Category | null;
}

export default async function AdminProductsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (await createClient()) as any;

  const { data } = await db
    .from("products")
    .select("*, brand:brands(name), category:categories(name)")
    .order("created_at", { ascending: false }) as { data: ProductRow[] | null };

  const products = data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a202c]">Produtos</h1>
          <p className="text-sm text-[#718096]">{products.length} produto{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Novo produto
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={48} className="text-[#e2e8f0] mx-auto mb-4" />
            <p className="text-[#718096]">Nenhum produto cadastrado.</p>
            <Link href="/admin/produtos/novo" className="text-[#2B7DD4] text-sm mt-2 inline-block hover:underline">
              Adicionar primeiro produto
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f4f6f8]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide">Produto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide hidden md:table-cell">Categoria</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide hidden lg:table-cell">Preço</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide hidden lg:table-cell">Estoque</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#f4f6f8] transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#1a202c] line-clamp-1">{p.name}</p>
                    <p className="text-xs text-[#718096]">{p.brand?.name ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-[#718096] hidden md:table-cell">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-[#1A5C2A] hidden lg:table-cell">
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`font-medium ${p.stock <= 5 ? "text-red-600" : "text-[#1a202c]"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      p.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-[#718096]"
                    }`}>
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="p-1.5 text-[#718096] hover:text-[#2B7DD4] hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <AdminDeleteProduct id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
