"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  const shipping = totalPrice >= 150 ? 0 : 15.9;
  const pix = totalPrice * 0.95;
  const orderTotal = totalPrice + shipping;

  if (totalItems === 0) {
    return (
      <div className="pt-16 flex flex-col items-center gap-6 text-center">
        <ShoppingBag size={72} className="text-[#e2e8f0]" />
        <div>
          <h1 className="text-2xl font-bold text-[#1a202c]">Carrinho vazio</h1>
          <p className="text-[#718096] mt-1">Adicione produtos para continuar.</p>
        </div>
        <Link
          href="/"
          className="bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold text-[#1a202c] mb-6">
        Carrinho ({totalItems} {totalItems === 1 ? "item" : "itens"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de itens */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {/* Frete grátis banner */}
          {totalPrice < 150 && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-sm text-[#2B7DD4] flex items-center gap-2">
              <Tag size={15} />
              Faltam{" "}
              <strong>R$ {(150 - totalPrice).toFixed(2).replace(".", ",")}</strong>{" "}
              para frete grátis!
            </div>
          )}
          {totalPrice >= 150 && (
            <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 text-sm text-[#1A5C2A] flex items-center gap-2">
              <Tag size={15} />
              Você ganhou <strong>frete grátis!</strong>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex gap-4"
            >
              {/* Imagem */}
              <Link href={`/produto/${item.slug}`} className="flex-shrink-0">
                <div className="w-20 h-20 bg-[#f4f6f8] rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span className="text-xs text-[#2B7DD4] font-medium">{item.brand}</span>
                <Link href={`/produto/${item.slug}`}>
                  <h3 className="text-sm font-medium text-[#1a202c] line-clamp-2 hover:text-[#2B7DD4] transition-colors">
                    {item.name}
                  </h3>
                </Link>
                <div className="text-base font-bold text-[#1A5C2A] mt-1">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </div>
              </div>

              {/* Qty + remover */}
              <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[#718096] hover:text-[#e53e3e] transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center border border-[#e2e8f0] rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.id, item.quantity - 1)
                        : removeItem(item.id)
                    }
                    className="px-2.5 py-1.5 hover:bg-[#f4f6f8] transition-colors text-[#718096]"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="px-3 py-1.5 text-sm font-semibold min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1.5 hover:bg-[#f4f6f8] transition-colors text-[#718096]"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <div className="text-sm font-bold text-[#1a202c]">
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-[#2B7DD4] hover:text-[#1a5fa8] transition-colors w-fit"
          >
            ← Continuar comprando
          </Link>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sticky top-24">
            <h2 className="font-bold text-[#1a202c] text-lg mb-4">Resumo do pedido</h2>

            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-[#718096]">
                <span>Subtotal ({totalItems} itens)</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-[#718096]">
                <span>Frete</span>
                <span className={shipping === 0 ? "text-[#6DC040] font-medium" : ""}>
                  {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                </span>
              </div>

              <hr className="border-[#e2e8f0] my-1" />

              <div className="flex justify-between font-bold text-[#1a202c] text-base">
                <span>Total</span>
                <span>R$ {orderTotal.toFixed(2).replace(".", ",")}</span>
              </div>

              <div className="bg-green-50 rounded-xl px-3 py-2 text-xs text-[#1A5C2A] flex justify-between">
                <span>💰 No Pix (5% off)</span>
                <span className="font-bold">R$ {(pix + shipping).toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Finalizar compra
              <ChevronRight size={18} />
            </Link>

            <p className="text-xs text-[#718096] text-center mt-3">
              🔒 Pagamento 100% seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
