import { requireAdmin } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import sql from "@/lib/db";
import CarrosselToggles from "./CarrosselToggles";

export default async function CarrosseisPage() {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }

  const products = await sql`
    SELECT p.id, p.name, p.image_url, p.price::float AS price,
           p.in_promo, p.in_bestseller,
           b.name AS brand_name
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.active = true
    ORDER BY p.name ASC
  ` as { id: string; name: string; brand_name: string | null; image_url: string | null; price: number; in_promo: boolean; in_bestseller: boolean }[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a202c]">Carrosseis da Home</h1>
        <p className="text-[#718096] text-sm mt-1">Selecione quais produtos aparecem em cada carrossel da página principal.</p>
      </div>
      <CarrosselToggles products={products} />
    </div>
  );
}
