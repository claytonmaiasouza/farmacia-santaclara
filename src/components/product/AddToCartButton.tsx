"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Minus, Plus, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    brand: string;
    slug: string;
    price: number;
    image: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      slug: product.slug,
      price: product.price,
      image: product.image,
      quantity,
    });
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Seletor de quantidade */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#718096]">Quantidade:</span>
        <div className="flex items-center border border-[#e2e8f0] rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-[#f4f6f8] transition-colors text-[#718096]"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 py-2 text-sm font-semibold min-w-[2.5rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-2 hover:bg-[#f4f6f8] transition-colors text-[#718096]"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-[#718096]">{product.stock} disponíveis</span>
      </div>

      {added ? (
        <div className="flex flex-col gap-2">
          <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-[#6DC040]">
            <Check size={18} />
            Adicionado ao carrinho!
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-sm border border-[#e2e8f0] text-[#4a5568] hover:border-[#2B7DD4] hover:text-[#2B7DD4] transition-colors bg-white"
            >
              <ArrowLeft size={15} />
              Continuar comprando
            </button>
            <Link
              href="/carrinho"
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-sm bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white transition-colors"
            >
              <ShoppingCart size={15} />
              Ir para o carrinho
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all ${
            product.stock === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#2B7DD4] hover:bg-[#1a5fa8] active:scale-[0.98]"
          }`}
        >
          {product.stock === 0 ? (
            "Fora de estoque"
          ) : (
            <>
              <ShoppingCart size={18} />
              Adicionar ao carrinho
            </>
          )}
        </button>
      )}
    </div>
  );
}
