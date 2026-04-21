import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, FileText, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { getProductBySlug, getProductsByCategory } from "@/lib/queries/products";
import ImageGallery from "@/components/product/ImageGallery";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductSection from "@/components/home/ProductSection";
import type { Product } from "@/components/ui/ProductCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.name} — Farmácia Santa Clara`,
    description: product.short_description ?? product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const price = Number(product.price);
  const originalPrice = product.original_price ? Number(product.original_price) : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  // Produtos relacionados
  const related =
    product.category_id && product.category
      ? await getProductsByCategory(product.category.slug, { limit: 5 }).then((r) =>
          r.products
            .filter((p) => p.id !== product.id)
            .slice(0, 5)
            .map(toProductCard)
        )
      : [];

  const images = product.images?.length
    ? product.images.map((i) => ({ url: i.url, alt: i.alt }))
    : [{ url: product.image_url ?? "/images/products/placeholder.svg", alt: product.name }];

  return (
    <div className="pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6">
        <Link href="/" className="hover:text-[#2B7DD4] transition-colors">Início</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <Link href={`/categoria/${product.category.slug}`} className="hover:text-[#2B7DD4] transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-[#1a202c] line-clamp-1">{product.name}</span>
      </nav>

      {/* Produto */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galeria */}
        <ImageGallery images={images} productName={product.name} />

        {/* Detalhes */}
        <div className="flex flex-col gap-4">
          {/* Badge prescrição */}
          {product.requires_prescription && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-fit">
              <FileText size={14} />
              Venda sob prescrição médica
            </div>
          )}

          {/* Marca */}
          {product.brand && (
            <Link
              href={`/marca/${product.brand.slug}`}
              className="text-sm text-[#2B7DD4] font-medium hover:underline w-fit"
            >
              {product.brand.name}
            </Link>
          )}

          {/* Nome */}
          <h1 className="text-2xl font-bold text-[#1a202c] leading-snug">
            {product.name}
          </h1>

          {/* SKU */}
          {product.sku && (
            <span className="text-xs text-[#718096]">SKU: {product.sku}</span>
          )}

          <hr className="border-[#e2e8f0]" />

          {/* Preço */}
          <div>
            {originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#718096] line-through">
                  R$ {originalPrice.toFixed(2).replace(".", ",")}
                </span>
                <span className="bg-[#e53e3e] text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  -{discount}%
                </span>
              </div>
            )}
            <div className="text-3xl font-bold text-[#1A5C2A] mt-0.5">
              R$ {price.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-sm text-[#718096] mt-1">
              ou 3x de R$ {(price / 3).toFixed(2).replace(".", ",")} sem juros
            </div>
            <div className="text-sm text-[#6DC040] font-medium mt-1">
              ou R$ {(price * 0.95).toFixed(2).replace(".", ",")} no Pix (5% off)
            </div>
          </div>

          <hr className="border-[#e2e8f0]" />

          {/* Add to cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand?.name ?? "",
              slug: product.slug,
              price: price,
              image: product.image_url ?? "/images/products/placeholder.svg",
              stock: product.stock,
            }}
          />

          {/* Garantias */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { icon: ShieldCheck, label: "Produto original" },
              { icon: Truck, label: "Entrega rápida" },
              { icon: RotateCcw, label: "Troca fácil" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 bg-[#f4f6f8] rounded-xl p-3 text-center">
                <Icon size={20} className="text-[#2B7DD4]" />
                <span className="text-xs text-[#718096] leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Descrição */}
      {product.description && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mt-4">
          <h2 className="text-lg font-bold text-[#1a202c] mb-4">Descrição do produto</h2>
          <div
            className="prose prose-sm max-w-none text-[#4a5568] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {/* Produtos relacionados */}
      {related.length > 0 && (
        <ProductSection
          title="Produtos relacionados"
          products={related}
          viewAllHref={product.category ? `/categoria/${product.category.slug}` : undefined}
        />
      )}
    </div>
  );
}

function toProductCard(p: Awaited<ReturnType<typeof getProductBySlug>>): Product {
  return {
    id: p!.id,
    name: p!.name,
    brand: p!.brand?.name ?? "",
    slug: p!.slug,
    price: Number(p!.price),
    originalPrice: p!.original_price ? Number(p!.original_price) : undefined,
    image: p!.image_url ?? "/images/products/placeholder.svg",
  };
}
