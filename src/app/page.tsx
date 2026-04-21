import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import { getFeaturedProducts, getNewProducts } from "@/lib/queries/products";
import type { Product } from "@/components/ui/ProductCard";

function mapProduct(p: Awaited<ReturnType<typeof getFeaturedProducts>>[0]): Product {
  return {
    id: p.id,
    name: p.name,
    brand: (p as { brand?: { name: string } | null }).brand?.name ?? "",
    slug: p.slug,
    price: Number(p.price),
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    image: p.image_url ?? "https://placehold.co/400x400/e8f4fd/2B7DD4?text=Produto",
  };
}

export default async function HomePage() {
  const [featured, newest] = await Promise.all([
    getFeaturedProducts(5).catch(() => []),
    getNewProducts(5).catch(() => []),
  ]);

  const featuredProducts = featured.map(mapProduct);

  // "Novidades" = produtos não destacados (os mais recentes que não estão em destaque)
  const newProducts = newest
    .filter((p) => !p.featured)
    .slice(0, 5)
    .map(mapProduct);

  return (
    <div className="pt-6">
      <HeroBanner />
      <CategoryGrid />

      {featuredProducts.length > 0 && (
        <ProductSection
          title="Produtos em Destaque"
          subtitle="Os mais procurados da semana"
          products={featuredProducts}
          viewAllHref="/categoria/peptideos"
        />
      )}

      {newProducts.length > 0 && (
        <ProductSection
          title="Novidades"
          subtitle="Acabou de chegar"
          products={newProducts}
          viewAllHref="/categoria/hormonios"
        />
      )}

      {/* Banner CTA */}
      <section className="mt-12 bg-gradient-to-r from-[#1A5C2A] to-[#2E7D32] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            Precisa de orientação?
          </h3>
          <p className="text-white/80">
            Nossa equipe de farmacêuticos está pronta para te ajudar.
          </p>
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
