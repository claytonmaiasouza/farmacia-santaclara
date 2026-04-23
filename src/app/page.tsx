import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import SocialProof from "@/components/home/SocialProof";
import { getNewProducts } from "@/lib/queries/products";
import type { Product } from "@/components/ui/ProductCard";

type RawProduct = Awaited<ReturnType<typeof getNewProducts>>[0];

function mapProduct(p: RawProduct): Product {
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
  const all = await getNewProducts(50).catch(() => []);

  const withImage = all.filter((p) => p.image_url && p.image_url.trim() !== "");
  const sorted = [...withImage].sort((a, b) => Number(b.price) - Number(a.price));

  const promo = sorted.slice(0, 5).map(mapProduct);
  const bestsellers = sorted.slice(5, 10).map(mapProduct);

  return (
    <div className="pt-6">
      <HeroBanner />
      <CategoryGrid />

      {promo.length > 0 && (
        <ProductCarousel
          title="Promoção de Inauguração"
          subtitle="Preços especiais para os primeiros clientes"
          badge="INAUGURAÇÃO"
          products={promo}
          viewAllHref="/categoria/peptideos"
        />
      )}

      {bestsellers.length > 0 && (
        <ProductCarousel
          title="Mais Vendidos"
          subtitle="Os favoritos dos nossos clientes"
          products={bestsellers}
          viewAllHref="/categoria/peptideos"
        />
      )}

      <SocialProof />

      {/* Banner CTA */}
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
