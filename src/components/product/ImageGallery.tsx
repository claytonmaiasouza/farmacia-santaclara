"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: { url: string; alt?: string | null }[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const list = images.length > 0 ? images : [{ url: "/images/products/placeholder.svg", alt: productName }];

  return (
    <div className="flex flex-col gap-3">
      {/* Imagem principal */}
      <div
        className="relative bg-[#f4f6f8] rounded-2xl overflow-hidden aspect-square flex items-center justify-center cursor-zoom-in group"
        onClick={() => setZoomed(true)}
      >
        <Image
          src={list[current].url}
          alt={list[current].alt ?? productName}
          width={500}
          height={500}
          className="object-contain w-full h-full p-6 group-hover:scale-105 transition-transform duration-300"
          priority
        />
        <button className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={18} className="text-[#718096]" />
        </button>
        {list.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + list.length) % list.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % list.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                i === current ? "border-[#2B7DD4]" : "border-[#e2e8f0] hover:border-[#2B7DD4]/50"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                width={64}
                height={64}
                className="object-contain w-full h-full p-1 bg-[#f4f6f8]"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal zoom */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden">
            <Image
              src={list[current].url}
              alt={list[current].alt ?? productName}
              width={800}
              height={800}
              className="object-contain w-full h-full"
            />
            <button
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-100"
              onClick={() => setZoomed(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
