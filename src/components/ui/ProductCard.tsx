import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#2B7DD4] hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Imagem */}
      <div className="relative bg-[#f4f6f8] aspect-square flex items-center justify-center p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
        {discount && (
          <span className="absolute top-2 left-2 bg-[#e53e3e] text-white text-xs font-bold px-2 py-0.5 rounded-lg">
            -{discount}%
          </span>
        )}
        {product.badge && !discount && (
          <span className="absolute top-2 left-2 bg-[#6DC040] text-white text-xs font-bold px-2 py-0.5 rounded-lg">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <span className="text-xs text-[#2B7DD4] font-medium">{product.brand}</span>
        <h3 className="text-sm font-medium text-[#1a202c] line-clamp-2 leading-snug group-hover:text-[#2B7DD4] transition-colors">
          {product.name}
        </h3>

        {product.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={12} fill="#f6c000" stroke="none" />
            <span className="text-xs text-[#718096]">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="mt-auto pt-2">
          {product.originalPrice && (
            <span className="text-xs text-[#718096] line-through">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <div className="text-lg font-bold text-[#1A5C2A]">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </div>
          <div className="text-xs text-[#718096]">
            ou 3x de R$ {(product.price / 3).toFixed(2).replace(".", ",")} sem juros
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="px-3 pb-3">
        <button className="w-full bg-[#2B7DD4] hover:bg-[#1a5fa8] active:bg-[#1a5fa8] text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <ShoppingCart size={16} />
          Adicionar
        </button>
      </div>
    </Link>
  );
}
