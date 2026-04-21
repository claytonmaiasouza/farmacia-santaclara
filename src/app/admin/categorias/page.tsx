import sql from "@/lib/db";
import type { Category } from "@/types/database";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function AdminCategoriasPage() {
  const cats = await sql<Category[]>`SELECT * FROM categories ORDER BY sort_order`;
  const parents = cats.filter((c) => !c.parent_id);
  const children = cats.filter((c) => c.parent_id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a202c]">Categorias</h1>
        <Link
          href="/admin/categorias/nova"
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus size={16} /> Nova categoria
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {parents.map((parent) => {
          const subs = children.filter((c) => c.parent_id === parent.id);
          return (
            <div key={parent.id} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-[#f4f6f8] border-b border-[#e2e8f0]">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#1a202c]">{parent.name}</span>
                  <span className="text-xs font-mono text-[#718096]">{parent.slug}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${parent.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-[#718096]"}`}>
                    {parent.active ? "Ativa" : "Inativa"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/categorias/nova?parent=${parent.id}`} className="flex items-center gap-1.5 text-xs text-[#2B7DD4] hover:underline">
                    <Plus size={13} /> Adicionar marca
                  </Link>
                  <Link href={`/admin/categorias/${parent.id}`} className="p-1.5 rounded-lg hover:bg-[#e2e8f0] transition-colors">
                    <Pencil size={14} className="text-[#718096]" />
                  </Link>
                </div>
              </div>

              {subs.length > 0 ? (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {subs.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#f4f6f8]">
                        <td className="px-8 py-2.5 text-[#1a202c]">{sub.name}</td>
                        <td className="px-5 py-2.5 text-[#718096] font-mono text-xs">{sub.slug}</td>
                        <td className="px-5 py-2.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${sub.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-[#718096]"}`}>
                            {sub.active ? "Ativa" : "Inativa"}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 text-right">
                          <Link href={`/admin/categorias/${sub.id}`} className="p-1.5 rounded-lg hover:bg-[#e2e8f0] transition-colors inline-flex">
                            <Pencil size={14} className="text-[#718096]" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-8 py-3 text-xs text-[#718096] italic">Nenhuma subcategoria ainda.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
