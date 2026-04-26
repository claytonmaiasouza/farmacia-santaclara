"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

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
    setTimeout(() => {
      setAdded(false);
      router.back();
    }, 2000);
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

      {/* Botão */}
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all ${
          added
            ? "bg-[#6DC040]"
            : product.stock === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#2B7DD4] hover:bg-[#1a5fa8] active:scale-[0.98]"
        }`}
      >
        {added ? (
          <>
            <Check size={18} />
            Adicionado!
          </>
        ) : product.stock === 0 ? (
          "Fora de estoque"
        ) : (
          <>
            <ShoppingCart size={18} />
            Adicionar ao carrinho
          </>
        )}
      </button>
    </div>
  );
}
