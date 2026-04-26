"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Menu, X } from "lucide-react";
import CartButton from "@/components/layout/CartButton";
import UserMenu from "@/components/layout/UserMenu";
import ExchangeRates from "@/components/layout/ExchangeRates";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  brand: string;
  category: string;
}

function SuggestionList({
  suggestions,
  query,
  onSelect,
  onViewAll,
}: {
  suggestions: Suggestion[];
  query: string;
  onSelect: (slug: string) => void;
  onViewAll: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl z-50 overflow-hidden">
      {suggestions.map((s) => (
        <button
          key={s.id}
          onMouseDown={() => onSelect(s.slug)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f4f6f8] transition-colors text-left border-b border-[#f4f6f8] last:border-0"
        >
          <div className="w-10 h-10 rounded-lg bg-[#f4f6f8] flex-shrink-0 overflow-hidden">
            {s.image_url ? (
              <Image src={s.image_url} alt={s.name} width={40} height={40} className="object-contain w-full h-full p-0.5" />
            ) : (
              <div className="w-full h-full bg-[#e2e8f0]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1a202c] truncate">{s.name}</p>
            <p className="text-xs text-[#718096] truncate">{s.brand || s.category}</p>
          </div>
          <span className="text-sm font-bold text-[#1A5C2A] flex-shrink-0">
            $ {s.price.toFixed(2).replace(".", ",")}
          </span>
        </button>
      ))}
      <button
        onMouseDown={onViewAll as unknown as React.MouseEventHandler}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-[#2B7DD4] font-medium hover:bg-blue-50 transition-colors"
      >
        <Search size={14} />
        Ver todos os resultados para &ldquo;{query}&rdquo;
      </button>
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const inDesktop = desktopRef.current?.contains(e.target as Node);
      const inMobile = mobileRef.current?.contains(e.target as Node);
      if (!inDesktop && !inMobile) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      if (currentY < 60) {
        setHeaderVisible(true);
      } else if (currentY > lastScrollY.current) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleSelect(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/produto/${slug}`);
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Barra superior */}
      <div className="bg-[#1A5C2A] text-white text-sm py-1.5 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <span className="hidden md:flex items-center gap-1.5">
            <MapPin size={13} />
            Ciudad del Este — Paraguay
          </span>
          <ExchangeRates />
          <div className="flex items-center gap-4">
            <Link href="/conta" className="hover:text-[#6DC040] transition-colors hidden sm:block">Minha conta</Link>
            <Link href="/conta/pedidos" className="hover:text-[#6DC040] transition-colors hidden sm:block">Meus pedidos</Link>
          </div>
        </div>
      </div>

      {/* Header principal — desktop */}
      <div className="max-w-7xl mx-auto px-4 py-3 hidden sm:flex items-center gap-6">
        <Link href="/" className="flex-shrink-0 flex flex-col items-center gap-0.5">
          <Image
            src="/images/logo.png"
            alt="Farmácia Santa Clara"
            width={108}
            height={33}
            priority
            className="w-[108px] h-auto"
          />
          <span
            className="tracking-wide leading-tight"
            style={{ fontFamily: "var(--font-nunito)", color: "#1A5C2A", fontWeight: 700, letterSpacing: "0.04em", fontSize: "14px" }}
          >
            Farmácia{" "}<span style={{ color: "#2B7DD4" }}>Santa Clara</span>
          </span>
        </Link>

        <div ref={desktopRef} className="flex-1 relative">
          <form
            className="flex items-center bg-[#f4f6f8] rounded-xl overflow-hidden border border-[#e2e8f0] focus-within:border-[#2B7DD4] transition-colors"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              placeholder="Buscar medicamentos, vitaminas, cosméticos..."
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#718096]"
              autoComplete="off"
            />
            <button type="submit" className="bg-[#2B7DD4] hover:bg-[#1a5fa8] transition-colors px-5 py-3 text-white">
              {loading
                ? <span className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin block" />
                : <Search size={18} />
              }
            </button>
          </form>
          {open && (
            <SuggestionList
              suggestions={suggestions}
              query={query}
              onSelect={handleSelect}
              onViewAll={handleSubmit}
            />
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <UserMenu />
          <CartButton />
          <button
            className="lg:hidden p-2 text-[#718096]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Header mobile — esconde ao rolar para baixo */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          headerVisible ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 py-2 flex items-center gap-2">
          {/* Botão menu — esquerda */}
          <button
            className="p-2 text-[#718096] flex-shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo + Nome — centro */}
          <Link href="/" className="flex-1 flex flex-row items-center justify-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Farmácia Santa Clara"
              width={108}
              height={33}
              priority
              className="w-[44px] h-auto"
            />
            <span
              className="tracking-wide leading-tight"
              style={{ fontFamily: "var(--font-nunito)", color: "#1A5C2A", fontWeight: 700, letterSpacing: "0.04em", fontSize: "clamp(10px, 3vw, 14px)" }}
            >
              Farmácia{" "}<span style={{ color: "#2B7DD4" }}>Santa Clara</span>
            </span>
          </Link>

          {/* Ações — direita */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <UserMenu />
            <CartButton />
          </div>
        </div>
      </div>

      {/* Busca mobile — sempre visível */}
      <div ref={mobileRef} className="sm:hidden px-4 pt-2 pb-2.5 relative">
        <form
          className="flex items-center bg-[#f4f6f8] rounded-xl overflow-hidden border border-[#e2e8f0] focus-within:border-[#2B7DD4] transition-colors"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Buscar produtos..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-[#718096]"
            autoComplete="off"
          />
          <button type="submit" className="bg-[#2B7DD4] hover:bg-[#1a5fa8] transition-colors px-4 py-2.5 text-white">
            {loading
              ? <span className="w-[16px] h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin block" />
              : <Search size={16} />
            }
          </button>
        </form>
        {open && (
          <SuggestionList
            suggestions={suggestions}
            query={query}
            onSelect={handleSelect}
            onViewAll={handleSubmit}
          />
        )}
      </div>

      {/* Navegação desktop */}
      <nav className="border-t border-[#e2e8f0] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center px-6 py-3 text-base font-semibold text-[#1a202c] hover:text-[#2B7DD4] hover:bg-[#f4f6f8] transition-colors tracking-wide"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#e2e8f0] bg-white">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm text-[#1a202c] border-b border-[#e2e8f0] hover:bg-[#f4f6f8]"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

const navItems = [
  { label: "Peptídeos", href: "/categoria/peptideos" },
  { label: "Hormônios", href: "/categoria/hormonios" },
  { label: "Botox",     href: "/categoria/botox" },
];
