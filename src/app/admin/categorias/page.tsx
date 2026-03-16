import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";
import Link from "next/link";

export default async function AdminCategoriasPage() {
  const db = (await createClient()) as any;
  const { data } = await db.from("categories").select("*").order("sort_order") as { data: Category[] | null };
  const cats = data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-[#1a202c]">Categorias</h1>
      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f4f6f8]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Nome</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Slug</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {cats.map((c) => (
              <tr key={c.id} className="hover:bg-[#f4f6f8]">
                <td className="px-5 py-3 font-medium text-[#1a202c]">{c.name}</td>
                <td className="px-5 py-3 text-[#718096] font-mono text-xs">{c.slug}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${c.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-[#718096]"}`}>
                    {c.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
