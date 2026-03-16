import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import { Product } from "@/components/ui/ProductCard";

// Produtos de exemplo (serão substituídos pelo Supabase)
const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Vitamina C 1000mg Efervescente 10 Comprimidos",
    brand: "Redoxon",
    slug: "vitamina-c-1000mg-redoxon",
    price: 18.9,
    originalPrice: 24.9,
    image: "/images/products/placeholder.svg",
    rating: 4.8,
    reviewCount: 312,
    badge: "Mais vendido",
  },
  {
    id: "2",
    name: "Dipirona Sódica 500mg 20 Comprimidos",
    brand: "Medley",
    slug: "dipirona-500mg-medley",
    price: 6.5,
    image: "/images/products/placeholder.svg",
    rating: 4.7,
    reviewCount: 890,
  },
  {
    id: "3",
    name: "Protetor Solar FPS 60 Facial 40g",
    brand: "La Roche-Posay",
    slug: "protetor-solar-fps60-laroche",
    price: 89.9,
    originalPrice: 119.9,
    image: "/images/products/placeholder.svg",
    rating: 4.9,
    reviewCount: 245,
  },
  {
    id: "4",
    name: "Ômega 3 1000mg 60 Cápsulas",
    brand: "Vitamed",
    slug: "omega3-1000mg-vitamed",
    price: 34.9,
    originalPrice: 45.9,
    image: "/images/products/placeholder.svg",
    rating: 4.6,
    reviewCount: 178,
  },
  {
    id: "5",
    name: "Complexo B 60 Comprimidos",
    brand: "Centrum",
    slug: "complexo-b-centrum",
    price: 22.9,
    image: "/images/products/placeholder.svg",
    rating: 4.5,
    reviewCount: 134,
    badge: "Novo",
  },
];

const newProducts: Product[] = [
  {
    id: "6",
    name: "Vitamina D3 2000UI 60 Cápsulas",
    brand: "Sunvit",
    slug: "vitamina-d3-2000ui-sunvit",
    price: 29.9,
    image: "/images/products/placeholder.svg",
    badge: "Novo",
  },
  {
    id: "7",
    name: "Hidratante Corporal Intensivo 400ml",
    brand: "Eucerin",
    slug: "hidratante-corporal-eucerin",
    price: 54.9,
    originalPrice: 69.9,
    image: "/images/products/placeholder.svg",
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: "8",
    name: "Shampoo Anticaspa 200ml",
    brand: "Neutrogena",
    slug: "shampoo-anticaspa-neutrogena",
    price: 27.9,
    image: "/images/products/placeholder.svg",
    rating: 4.4,
    reviewCount: 203,
  },
  {
    id: "9",
    name: "Probiótico Lactobacillus 30 Cápsulas",
    brand: "Floratil",
    slug: "probiotico-floratil-30",
    price: 48.9,
    originalPrice: 59.9,
    image: "/images/products/placeholder.svg",
    rating: 4.8,
    reviewCount: 156,
    badge: "Novo",
  },
  {
    id: "10",
    name: "Termômetro Digital Infravermelho",
    brand: "G-Tech",
    slug: "termometro-digital-gtech",
    price: 89.9,
    originalPrice: 129.9,
    image: "/images/products/placeholder.svg",
    rating: 4.6,
    reviewCount: 412,
  },
];

export default function HomePage() {
  return (
    <div className="pt-6">
      <HeroBanner />
      <CategoryGrid />
      <ProductSection
        title="Produtos em Destaque"
        subtitle="Os mais vendidos da semana"
        products={featuredProducts}
        viewAllHref="/categoria/destaques"
      />
      <ProductSection
        title="Novidades"
        subtitle="Acabou de chegar"
        products={newProducts}
        viewAllHref="/novidades"
      />

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
