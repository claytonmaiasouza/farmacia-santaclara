"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, MapPin, User, Store, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

const WHATSAPP_NUMBER = "595992959689";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
}

const INITIAL: CustomerForm = {
  name: "", email: "", phone: "",
  street: "", number: "", complement: "", city: "", state: "",
};

type DeliveryType = "delivery" | "pickup";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CustomerForm>(INITIAL);
  const [delivery, setDelivery] = useState<DeliveryType>("delivery");
  const [loading, setLoading] = useState(false);

  const shipping = 0;
  const total = totalPrice + shipping;

  function set(field: keyof CustomerForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function buildWhatsAppMessage() {
    const lines = [
      `*Novo Pedido — Farmácia Santa Clara*`,
      ``,
      `*Cliente:* ${form.name}`,
      `*Telefone:* ${form.phone}`,
      `*E-mail:* ${form.email}`,
      ``,
      `*Entrega:* ${delivery === "pickup" ? "Retirada no balcão" : `Entrega — ${form.street}, ${form.number}${form.complement ? ` (${form.complement})` : ""}, ${form.city}/${form.state}`}`,
      ``,
      `*Itens:*`,
      ...items.map((i) => `• ${i.name} x${i.quantity} — R$ ${(i.price * i.quantity).toFixed(2).replace(".", ",")}`),
      ``,
      `*Subtotal:* R$ ${totalPrice.toFixed(2).replace(".", ",")}`,
      `*Frete:* Grátis (incluso no preço)`,
      `*Total:* R$ ${total.toFixed(2).replace(".", ",")}`,
      ``,
      `Gostaria de finalizar este pedido.`,
    ];
    return encodeURIComponent(lines.join("\n"));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    const msg = buildWhatsAppMessage();
    const waWindow = window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");

    setLoading(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, form, subtotal: totalPrice, shipping, total, delivery, payment: "whatsapp" }),
      });
    } catch {
      // registro em segundo plano, não bloqueia o fluxo
    }
    clearCart();
    setLoading(false);
    if (!waWindow) {
      window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-16 text-center">
        <p className="text-[#718096]">Seu carrinho está vazio.</p>
        <Link href="/" className="text-[#2B7DD4] text-sm mt-3 inline-block hover:underline">
          Voltar às compras
        </Link>
      </div>
    );
  }

  const inputCls = "w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]";
  const labelCls = "text-xs font-medium text-[#718096] mb-1 block";

  return (
    <div className="pt-6">
      <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6">
        <Link href="/carrinho" className="hover:text-[#2B7DD4]">Carrinho</Link>
        <ChevronRight size={14} />
        <span className="text-[#1a202c] font-medium">Checkout</span>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Dados pessoais */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <h2 className="font-bold text-[#1a202c] mb-4 flex items-center gap-2">
                <User size={18} className="text-[#2B7DD4]" /> Dados pessoais
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Nome completo *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="João da Silva" />
                </div>
                <div>
                  <label className={labelCls}>E-mail *</label>
                  <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="joao@email.com" />
                </div>
                <div>
                  <label className={labelCls}>Telefone / WhatsApp *</label>
                  <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="+55 11 99999-9999" />
                </div>
              </div>
            </div>

            {/* Tipo de entrega */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <h2 className="font-bold text-[#1a202c] mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#2B7DD4]" /> Entrega
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDelivery("delivery")}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${delivery === "delivery" ? "border-[#2B7DD4] bg-blue-50" : "border-[#e2e8f0] hover:border-[#2B7DD4]"}`}
                >
                  <MapPin size={20} className={delivery === "delivery" ? "text-[#2B7DD4]" : "text-[#718096]"} />
                  <div>
                    <p className="font-semibold text-sm text-[#1a202c]">Entrega no endereço</p>
                    <p className="text-xs text-[#718096] mt-0.5">Enviamos para todo o Brasil</p>
                    <p className="text-xs font-semibold text-[#1A5C2A] mt-1">Frete grátis</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDelivery("pickup")}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${delivery === "pickup" ? "border-[#1A5C2A] bg-green-50" : "border-[#e2e8f0] hover:border-[#1A5C2A]"}`}
                >
                  <Store size={20} className={delivery === "pickup" ? "text-[#1A5C2A]" : "text-[#718096]"} />
                  <div>
                    <p className="font-semibold text-sm text-[#1a202c]">Retirada no balcão</p>
                    <p className="text-xs text-[#718096] mt-0.5">Cidade del Este — Paraguai</p>
                    <p className="text-xs font-semibold text-[#1A5C2A] mt-1">Grátis</p>
                  </div>
                </button>
              </div>

              {delivery === "delivery" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#e2e8f0]">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Rua / Avenida *</label>
                    <input required value={form.street} onChange={(e) => set("street", e.target.value)} className={inputCls} placeholder="Rua Exemplo" />
                  </div>
                  <div>
                    <label className={labelCls}>Número *</label>
                    <input required value={form.number} onChange={(e) => set("number", e.target.value)} className={inputCls} placeholder="123" />
                  </div>
                  <div>
                    <label className={labelCls}>Complemento</label>
                    <input value={form.complement} onChange={(e) => set("complement", e.target.value)} className={inputCls} placeholder="Apto 42" />
                  </div>
                  <div>
                    <label className={labelCls}>Cidade *</label>
                    <input required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} placeholder="Ciudad del Este" />
                  </div>
                  <div>
                    <label className={labelCls}>Estado / País *</label>
                    <input required value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls} placeholder="Alto Paraná, PY" />
                  </div>
                </div>
              )}
            </div>

            {/* Pagamento — informativo */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[#1a202c] text-sm">Pagamento pelo WhatsApp</p>
                <p className="text-xs text-[#4a5568] mt-1 leading-relaxed">
                  Após enviar o pedido, nossa equipe entrará em contato pelo WhatsApp para confirmar a disponibilidade e combinar a forma de pagamento (Pix, transferência, cartão ou outro).
                </p>
              </div>
            </div>

          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sticky top-24">
              <h2 className="font-bold text-[#1a202c] mb-4">Resumo do pedido</h2>

              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#f4f6f8] rounded-lg flex-shrink-0 overflow-hidden">
                      <Image src={item.image} alt={item.name} width={40} height={40} className="object-contain w-full h-full p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#1a202c] line-clamp-1">{item.name}</p>
                      <p className="text-xs text-[#718096]">x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#1a202c] flex-shrink-0">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-[#e2e8f0] mb-3" />

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-[#718096]">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-[#718096]">
                  <span>Frete</span>
                  <span className="text-[#1A5C2A] font-medium">Grátis</span>
                </div>
                <hr className="border-[#e2e8f0]" />
                <div className="flex justify-between font-bold text-[#1a202c] text-base">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors bg-[#25D366] hover:bg-[#1da851]"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processando...</>
                ) : (
                  <><MessageCircle size={18} /> Finalizar pelo WhatsApp</>
                )}
              </button>
              <p className="text-xs text-[#718096] text-center mt-3">🔒 Compra segura</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
