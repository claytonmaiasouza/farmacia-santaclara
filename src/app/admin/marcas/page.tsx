import sql from "@/lib/db";
import type { Brand } from "@/types/database";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function AdminMarcasPage() {
  const brands = await sql<Brand[]>`SELECT * FROM brands ORDER BY name`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a202c]">Marcas</h1>
        <Link
          href="/admin/marcas/nova"
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus size={16} /> Nova marca
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide">Marca</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide">Slug</th>
              <th className="text-center px-5 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f6f8]">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {b.logo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.logo_url} alt={b.name} className="h-8 w-14 object-contain rounded border border-[#e2e8f0] p-0.5 bg-white" />
                    )}
                    <span className="font-medium text-[#1a202c]">{b.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#718096] font-mono text-xs">{b.slug}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${b.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-[#718096]"}`}>
                    {b.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/marcas/${b.id}`} className="p-1.5 rounded-lg hover:bg-[#e2e8f0] transition-colors inline-flex">
                    <Pencil size={14} className="text-[#718096]" />
                  </Link>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[#718096] text-sm">Nenhuma marca cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
