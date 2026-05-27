import { requireAdmin } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";
import sql from "@/lib/db";
import CarrosselToggles from "./CarrosselToggles";

export default async function CarrosseisPage() {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }

  const [products, config] = await Promise.all([
    sql`
      SELECT p.id, p.name, p.image_url, p.price::float AS price,
             p.in_promo, p.in_bestseller, p.in_launch,
             b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.active = true
      ORDER BY p.name ASC
    ` as Promise<{ id: string; name: string; brand_name: string | null; image_url: string | null; price: number; in_promo: boolean; in_bestseller: boolean; in_launch: boolean }[]>,
    sql`SELECT key, title, subtitle, badge FROM carousel_settings ORDER BY key`,
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a202c]">Carrosseis da Home</h1>
        <p className="text-[#718096] text-sm mt-1">Edite os títulos e selecione quais produtos aparecem em cada carrossel.</p>
      </div>
      <CarrosselToggles products={products} config={config as { key: string; title: string; subtitle: string | null; badge: string | null }[]} />
    </div>
  );
}
