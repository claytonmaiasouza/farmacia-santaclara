"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/components/ui/ProductCard";

interface Props {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductCarousel({ title, subtitle, badge, products, viewAllHref }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("[data-card]") as HTMLElement | null;
    const cardW = card ? card.offsetWidth + 16 : 220;
    scrollRef.current.scrollBy({ left: dir === "right" ? cardW * 2 : -cardW * 2, behavior: "smooth" });
  }

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between mb-5">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#1a202c]">{title}</h2>
              {badge && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 tracking-wide">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-[#718096] text-sm mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link href={viewAllHref} className="text-[#2B7DD4] text-sm font-medium hover:underline hidden sm:block">
              Ver todos
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-xl border border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4] transition-colors bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-xl border border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4] transition-colors bg-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/produto/${p.slug}`}
            data-card
            className="flex-shrink-0 w-44 sm:w-52 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#2B7DD4] hover:shadow-md transition-all overflow-hidden group"
          >
            <div className="relative w-full aspect-square bg-[#f4f6f8]">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                sizes="208px"
              />
              {p.originalPrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
                  -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                </span>
              )}
            </div>
            <div className="p-3">
              {p.brand && <p className="text-[10px] text-[#718096] font-medium uppercase tracking-wide truncate">{p.brand}</p>}
              <p className="text-sm font-semibold text-[#1a202c] line-clamp-2 leading-snug mt-0.5">{p.name}</p>
              <div className="mt-2">
                {p.originalPrice && (
                  <p className="text-xs text-[#718096] line-through">
                    $ {p.originalPrice.toFixed(2).replace(".", ",")}
                  </p>
                )}
                <p className="text-base font-bold text-[#1A5C2A]">
                  $ {p.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
