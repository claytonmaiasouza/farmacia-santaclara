"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Tag, Loader2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Coupon {
  id: string;
  code: string;
  discount_type: "tracking" | "percentage" | "fixed";
  discount_value: number;
}

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem("applied_coupon") || "null"); } catch { return null; }
  });
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const discount = coupon
    ? coupon.discount_type === "percentage"
      ? (totalPrice * coupon.discount_value) / 100
      : coupon.discount_type === "fixed"
      ? Math.min(coupon.discount_value, totalPrice)
      : 0
    : 0;

  const orderTotal = Math.max(0, totalPrice - discount);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput }),
    });
    if (res.ok) {
      const data = await res.json();
      setCoupon(data);
      sessionStorage.setItem("applied_coupon", JSON.stringify(data));
      setCouponInput("");
    } else {
      const d = await res.json();
      setCouponError(d.error || "Cupom inválido");
    }
    setCouponLoading(false);
  }

  function removeCoupon() {
    setCoupon(null);
    sessionStorage.removeItem("applied_coupon");
  }

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
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sticky top-24 flex flex-col gap-4">
            <h2 className="font-bold text-[#1a202c] text-lg">Resumo do pedido</h2>

            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-[#718096]">
                <span>Subtotal ({totalItems} itens)</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-[#718096]">
                <span>Frete</span>
                <span className="text-[#6DC040] font-medium">Grátis</span>
              </div>
              {coupon && discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Desconto ({coupon.code})</span>
                  <span>− R$ {discount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <hr className="border-[#e2e8f0]" />
              <div className="flex justify-between font-bold text-[#1a202c] text-base">
                <span>Total</span>
                <span>R$ {orderTotal.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Campo de cupom */}
            {coupon ? (
              <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-violet-600" />
                  <span className="text-xs font-bold text-violet-700 font-mono">{coupon.code}</span>
                  {coupon.discount_type !== "tracking" && (
                    <span className="text-xs text-violet-600">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}% off`
                        : `R$ ${Number(coupon.discount_value).toFixed(2)} off`}
                    </span>
                  )}
                </div>
                <button onClick={removeCoupon} className="text-violet-400 hover:text-violet-700 transition">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder="Código do cupom"
                    className="flex-1 border border-[#e2e8f0] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#2B7DD4]"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-3 py-2 bg-[#2B7DD4] hover:bg-[#2266b8] text-white text-sm font-medium rounded-xl transition disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Aplicar"}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500">{couponError}</p>}
              </div>
            )}

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white font-semibold py-3.5 rounded-xl transition-colors"
            >
              Finalizar compra
              <ChevronRight size={18} />
            </Link>

            <p className="text-xs text-[#718096] text-center">
              🔒 Pagamento 100% seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
