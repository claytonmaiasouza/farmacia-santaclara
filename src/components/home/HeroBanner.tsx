"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Peptídeos & Hormônios",
    subtitle: "Linha Premium",
    description: "Os melhores peptídeos e hormônios com procedência garantida. Frete já incluso no preço.",
    cta: "Ver produtos",
    href: "/categoria/peptideos",
    bg: "from-[#1A5C2A] to-[#2E7D32]",
    accent: "#6DC040",
    icon: "🧬",
  },
  {
    id: 2,
    title: "Botox & Toxinas",
    subtitle: "Estética Avançada",
    description: "Nabota, Botulax, Elitox e muito mais. Produtos originais direto de Cidade del Este.",
    cta: "Ver produtos",
    href: "/categoria/botox",
    bg: "from-[#2B7DD4] to-[#1a5fa8]",
    accent: "#93c5fd",
    icon: "💉",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);
  const next = () => setCurrent((c) => (c + 1) % banners.length);

  const banner = banners[current];

  return (
    <div className={`relative w-full bg-gradient-to-r ${banner.bg} rounded-2xl overflow-hidden transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-8 py-14 flex items-center justify-between">
        {/* Conteúdo */}
        <div className="max-w-xl">
          <span
            className="inline-block text-sm font-bold uppercase tracking-widest mb-3 px-3 py-1 rounded-full"
            style={{ backgroundColor: banner.accent, color: "#fff" }}
          >
            {banner.subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {banner.title}
          </h2>
          <p className="text-white/80 text-lg mb-6">{banner.description}</p>
          <Link
            href={banner.href}
            className="inline-flex items-center gap-2 bg-white text-[#1A5C2A] font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {banner.cta}
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Decoração */}
        <div className="hidden md:flex items-center justify-center opacity-20">
          <div className="w-52 h-52 rounded-full border-8 border-white" />
        </div>
      </div>

      {/* Controles */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
