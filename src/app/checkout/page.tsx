"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, MapPin, User, Store, CheckCircle, Copy, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const PIX_KEY = "06541153973";
const PAYMENT_EMAIL = "pagamentos@santaclarafarma.com.py";

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

function SuccessScreen({ orderId }: { orderId: string }) {
  const [copied, setCopied] = useState(false);
  const code = orderId.slice(0, 8).toUpperCase();

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="pt-6 max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={34} className="text-green-500" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1a202c]">Pedido realizado!</h2>
          <p className="text-[#718096] text-sm mt-1">
            Código: <span className="font-bold text-[#1a202c] font-mono">#{code}</span>
          </p>
        </div>

        <div className="w-full bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="font-bold text-[#1a202c] text-sm mb-4">Para finalizar seu pedido:</p>

          <ol className="flex flex-col gap-4">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#1A5C2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#1a202c]">Realize o pagamento via Pix</p>
                <p className="text-xs text-[#718096] mt-0.5 mb-1.5">Chave Pix (CPF):</p>
                <div className="flex items-center gap-2">
                  <code className="bg-white border border-[#e2e8f0] px-2.5 py-1.5 rounded-lg text-sm font-mono font-semibold text-[#1a202c]">
                    {PIX_KEY}
                  </code>
                  <button
                    onClick={copyPix}
                    className="flex items-center gap-1 text-xs text-[#2B7DD4] hover:text-[#1a5fa8] transition-colors"
                  >
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#1A5C2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-semibold text-sm text-[#1a202c]">Envie o comprovante por e-mail</p>
                <p className="text-xs text-[#718096] mt-1">
                  Para: <span className="font-medium text-[#1a202c]">{PAYMENT_EMAIL}</span>
                </p>
                <p className="text-xs text-[#718096]">
                  Assunto: <span className="font-medium text-[#1a202c]">Comprovante #{code}</span>
                </p>
                <p className="text-xs text-[#718096] mt-0.5 italic">Pode ser PDF ou foto do comprovante</p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-6 h-6 bg-[#1A5C2A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-semibold text-sm text-[#1a202c]">Aguarde a confirmação</p>
                <p className="text-xs text-[#718096] mt-0.5">
                  Nossa equipe confirmará o pagamento e seu pedido entra em preparo!
                </p>
              </div>
            </li>
          </ol>
        </div>

        <Link href="/" className="text-[#2B7DD4] text-sm font-medium hover:underline">
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState<CustomerForm>(INITIAL);
  const [delivery, setDelivery] = useState<DeliveryType>("delivery");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const shipping = 0;
  const total = totalPrice + shipping;

  function set(field: keyof CustomerForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, form, subtotal: totalPrice, shipping, total, delivery, payment: "pix" }),
      });
      if (res.ok) {
        const data = await res.json();
        clearCart();
        setOrderId(data.id);
      }
    } catch {
      // silently ignore
    }
    setLoading(false);
  }

  if (orderId) return <SuccessScreen orderId={orderId} />;

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
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="font-bold text-[#1a202c] text-sm">Pagamento via Pix</p>
              <p className="text-xs text-[#4a5568] mt-1 leading-relaxed">
                Após confirmar o pedido, você receberá a chave Pix e as instruções para envio do comprovante por e-mail.
              </p>
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
                className="mt-5 w-full flex items-center justify-center gap-2 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors bg-[#1A5C2A] hover:bg-[#154a22]"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processando...</>
                ) : (
                  "Confirmar Pedido"
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
