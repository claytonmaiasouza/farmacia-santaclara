"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrinho"
      className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] transition-colors text-white px-4 py-2.5 rounded-xl relative"
    >
      <ShoppingCart size={20} />
      <span className="text-sm font-medium hidden lg:block">Carrinho</span>
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-[#6DC040] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
