"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Phone, MapPin, Menu, X } from "lucide-react";
import CartButton from "@/components/layout/CartButton";
import UserMenu from "@/components/layout/UserMenu";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Barra superior */}
      <div className="bg-[#1A5C2A] text-white text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              (11) 9999-9999
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              Encontre nossa loja
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/conta" className="hover:text-[#6DC040] transition-colors">
              Minha conta
            </Link>
            <Link href="/pedidos" className="hover:text-[#6DC040] transition-colors">
              Meus pedidos
            </Link>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        {/* Logo + nome */}
        <Link href="/" className="flex-shrink-0 flex flex-col items-center gap-0.5">
          <Image
            src="/images/logo.png"
            alt="Farmácia Santa Clara"
            width={180}
            height={55}
            priority
          />
          <span
            className="text-sm tracking-wide"
            style={{ fontFamily: "var(--font-nunito)", color: "#1A5C2A", fontWeight: 700, letterSpacing: "0.04em" }}
          >
            Farmácia <span style={{ color: "#2B7DD4" }}>Santa Clara</span>
          </span>
        </Link>

        {/* Busca */}
        <form
          className="flex-1 flex items-center bg-[#f4f6f8] rounded-xl overflow-hidden border border-[#e2e8f0] focus-within:border-[#2B7DD4] transition-colors"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`;
            }
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar medicamentos, vitaminas, cosméticos..."
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#718096]"
          />
          <button
            type="submit"
            className="bg-[#2B7DD4] hover:bg-[#1a5fa8] transition-colors px-5 py-3 text-white"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Ações */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <UserMenu />

          <CartButton />

          {/* Menu mobile */}
          <button
            className="lg:hidden p-2 text-[#718096]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Navegação */}
      <nav className="border-t border-[#e2e8f0] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 text-sm font-medium text-[#1a202c] hover:text-[#2B7DD4] hover:bg-[#f4f6f8] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Destaque: Promoções */}
            <li className="ml-auto">
              <Link
                href="/promocoes"
                className="px-4 py-3 text-sm font-bold text-[#e53e3e] hover:text-[#c53030] transition-colors flex items-center gap-1"
              >
                🔥 Promoções
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Menu mobile aberto */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#e2e8f0] bg-white">
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
  { label: "Peptídeos",             href: "/categoria/peptideos" },
  { label: "Hormônios",             href: "/categoria/hormonios" },
  { label: "Vitaminas",             href: "/categoria/vitaminas" },
  { label: "Suplementos",           href: "/categoria/suplementos" },
  { label: "Insumos Hospitalares",  href: "/categoria/insumos-hospitalares" },
];
