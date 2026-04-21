import { Suspense } from "react";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { searchProducts } from "@/lib/queries/products";
import ProductCard from "@/components/ui/ProductCard";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Busca — Farmácia Santa Clara` : "Busca — Farmácia Santa Clara",
  };
}

async function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center">
        <Search size={48} className="text-[#e2e8f0] mx-auto mb-4" />
        <p className="text-[#718096]">Digite algo para buscar produtos.</p>
      </div>
    );
  }

  const products = await searchProducts(query, 40);

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center">
        <Search size={48} className="text-[#e2e8f0] mx-auto mb-4" />
        <p className="text-lg font-medium text-[#1a202c] mb-2">Nenhum resultado para &quot;{query}&quot;</p>
        <p className="text-[#718096] text-sm">Tente palavras diferentes ou navegue pelas categorias.</p>
        <Link href="/" className="mt-4 inline-block text-[#2B7DD4] text-sm hover:underline">
          Ir para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-[#718096] mb-4">
        {products.length} resultado{products.length !== 1 ? "s" : ""} para &quot;{query}&quot;
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand?.name ?? "",
              slug: product.slug,
              price: Number(product.price),
              originalPrice: product.original_price ? Number(product.original_price) : undefined,
              image: product.image_url ?? "/images/products/placeholder.svg",
            }}
          />
        ))}
      </div>
    </>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;

  return (
    <div className="pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6">
        <Link href="/" className="hover:text-[#2B7DD4] transition-colors">Início</Link>
        <ChevronRight size={14} />
        <span className="text-[#1a202c] font-medium">Busca</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#1a202c] mb-6">
        {q ? `Resultados para "${q}"` : "Buscar produtos"}
      </h1>

      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] aspect-[3/4] animate-pulse" />
          ))}
        </div>
      }>
        <SearchResults query={q} />
      </Suspense>
    </div>
  );
}
