import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { getProductsByCategory } from "@/lib/queries/products";
import ProductCard from "@/components/ui/ProductCard";
import Filters from "@/components/catalog/Filters";
import Pagination from "@/components/catalog/Pagination";
import type { Metadata } from "next";

const PER_PAGE = 20;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ordem?: string; preco?: string; pagina?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoria não encontrada" };
  return {
    title: `${category.name} — Farmácia Santa Clara`,
    description: category.description ?? `Produtos de ${category.name} com entrega rápida.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { ordem, preco, pagina } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Number(pagina ?? 1);
  const { products, total } = await getProductsByCategory(slug, {
    page,
    limit: PER_PAGE,
    orderBy: ordem ?? "created_at",
    priceRange: preco,
  });

  return (
    <div className="pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6">
        <Link href="/" className="hover:text-[#2B7DD4] transition-colors">Início</Link>
        <ChevronRight size={14} />
        <span className="text-[#1a202c] font-medium">{category.name}</span>
      </nav>

      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1a202c]">{category.name}</h1>
        {category.description && (
          <p className="text-[#718096] mt-1">{category.description}</p>
        )}
      </div>

      {/* Filtros */}
      <Suspense>
        <Filters />
      </Suspense>

      {/* Resultado */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <span className="text-sm text-[#718096]">
          {total === 0
            ? "Nenhum produto encontrado"
            : `${total} produto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-16 text-center">
          <p className="text-[#718096] text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
          <Link href={`/categoria/${slug}`} className="text-[#2B7DD4] text-sm mt-3 inline-block hover:underline">
            Limpar filtros
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                brand: product.brand?.name ?? "",
                slug: product.slug,
                price: product.price,
                originalPrice: product.original_price ?? undefined,
                image: product.image_url ?? "/images/products/placeholder.svg",
              }}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      <Suspense>
        <Pagination total={total} perPage={PER_PAGE} currentPage={page} />
      </Suspense>
    </div>
  );
}
