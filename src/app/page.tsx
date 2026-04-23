import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import SocialProof from "@/components/home/SocialProof";
import sql from "@/lib/db";
import type { Product } from "@/components/ui/ProductCard";

const STATIC_FALLBACK: Product[] = [
  { id: "1", name: "Produto Teste", brand: "Marca", slug: "produto-teste", price: 999, image: "https://placehold.co/400x400/e8f4fd/2B7DD4?text=Produto" },
];

async function getHomeProducts(): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT p.id, p.name, p.slug, p.price::float AS price,
             p.original_price::float AS original_price, p.image_url,
             b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON b.id = p.brand_id
      WHERE p.active = true
        AND p.image_url IS NOT NULL
        AND p.image_url != ''
      ORDER BY p.price DESC
      LIMIT 50
    ` as { id: string; name: string; slug: string; price: number; original_price: number | null; image_url: string; brand_name: string | null }[];

    if (!rows || rows.length === 0) return STATIC_FALLBACK;

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      brand: r.brand_name ?? "",
      slug: r.slug,
      price: Number(r.price),
      originalPrice: r.original_price ? Number(r.original_price) : undefined,
      image: r.image_url,
    }));
  } catch (e) {
    console.error("[HomePage] getHomeProducts error:", e);
    return STATIC_FALLBACK;
  }
}

export default async function HomePage() {
  const products = await getHomeProducts();

  const promo = products.slice(0, 5);
  const bestsellers = products.slice(5, 10).length > 0 ? products.slice(5, 10) : products.slice(0, 5);

  return (
    <div className="pt-6">
      <HeroBanner />
      <CategoryGrid />

      <ProductCarousel
        title="Promoção de Inauguração"
        subtitle="Preços especiais para os primeiros clientes"
        badge="INAUGURAÇÃO"
        products={promo}
        viewAllHref="/categoria/peptideos"
      />

      <ProductCarousel
        title="Mais Vendidos"
        subtitle="Os favoritos dos nossos clientes"
        products={bestsellers}
        viewAllHref="/categoria/peptideos"
      />

      <SocialProof />

      <section className="mt-14 bg-gradient-to-r from-[#1A5C2A] to-[#2E7D32] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Precisa de orientação?</h3>
          <p className="text-white/80">Nossa equipe de farmacêuticos está pronta para te ajudar.</p>
        </div>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-white text-[#1A5C2A] font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Falar com farmacêutico
        </a>
      </section>
    </div>
  );
}
