"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
  perPage: number;
  currentPage: number;
}

export default function Pagination({ total, perPage, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] hover:border-[#2B7DD4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, i) => {
        const prev = pages[i - 1];
        return (
          <span key={page} className="flex items-center gap-2">
            {prev && page - prev > 1 && (
              <span className="text-[#718096] text-sm">…</span>
            )}
            <button
              onClick={() => goTo(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-[#2B7DD4] text-white"
                  : "border border-[#e2e8f0] hover:border-[#2B7DD4] text-[#1a202c]"
              }`}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2e8f0] hover:border-[#2B7DD4] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
