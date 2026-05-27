"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, ImageOff } from "lucide-react";
import { useState } from "react";

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
  const [imgError, setImgError] = useState(false);
  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#2B7DD4] hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Imagem */}
      <div className="relative bg-[#f4f6f8] h-[220px] flex items-center justify-center p-5">
        {product.image && !imgError ? (
          <Image
            src={product.image}
            alt={product.name}
            width={250}
            height={250}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageOff size={48} className="text-[#cbd5e0]" />
        )}
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
      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <span className="text-xs text-[#2B7DD4] font-medium">{product.brand}</span>
        <h3 className="text-base font-medium text-[#1a202c] line-clamp-2 leading-snug group-hover:text-[#2B7DD4] transition-colors">
          {product.name}
        </h3>

        {product.rating && (
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={12} fill="#f6c000" stroke="none" />
            <span className="text-xs text-[#718096]">
              {Number(product.rating).toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="mt-auto pt-2">
          {originalPrice && (
            <span className="text-xs text-[#718096] line-through">
              R$ {originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <div className="text-xl font-bold text-[#1A5C2A]">
            R$ {price.toFixed(2).replace(".", ",")}
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="px-4 pb-4">
        <button className="w-full bg-[#2B7DD4] hover:bg-[#1a5fa8] active:bg-[#1a5fa8] text-white text-base font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <ShoppingCart size={16} />
          Adicionar
        </button>
      </div>
    </Link>
  );
}
