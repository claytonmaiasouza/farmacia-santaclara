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
    image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1600",
    overlay: "from-[#0f3d1a]/90 via-[#1A5C2A]/65 to-[#1A5C2A]/10",
    accent: "#6DC040",
  },
  {
    id: 2,
    title: "Botox & Toxinas",
    subtitle: "Estética Avançada",
    description: "Nabota, Botulax, Elitox e muito mais. Produtos originais direto de Ciudad del Este.",
    cta: "Ver produtos",
    href: "/categoria/botox",
    image: "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=1600",
    overlay: "from-[#0d2647]/92 via-[#1a3f7a]/65 to-[#1a3f7a]/10",
    accent: "#60a5fa",
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

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "360px" }}>
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `url(${banner.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay gradiente da esquerda */}
          <div className={`absolute inset-0 bg-gradient-to-r ${banner.overlay}`} />

          {/* Conteúdo */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-8 md:px-12 w-full">
              <div className="max-w-lg">
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full shadow"
                  style={{ backgroundColor: banner.accent, color: "#fff" }}
                >
                  {banner.subtitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                  {banner.title}
                </h2>
                <p className="text-white/90 text-base md:text-lg mb-7 drop-shadow leading-relaxed">
                  {banner.description}
                </p>
                <Link
                  href={banner.href}
                  className="inline-flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-xl text-[#1A5C2A]"
                >
                  {banner.cta}
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controles */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/25 hover:bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/25 hover:bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors z-10 backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-6" : "bg-white/50 w-2.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
