"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2, MapPin, User, Mail, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface AddressForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  zip_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

const INITIAL: AddressForm = {
  name: "", email: "", phone: "", cpf: "",
  zip_code: "", street: "", number: "", complement: "",
  neighborhood: "", city: "", state: "",
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<AddressForm>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = totalPrice >= 150 ? 0 : 15.9;
  const total = totalPrice + shipping;

  function set(field: keyof AddressForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function fetchCep(cep: string) {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          street: data.logradouro ?? "",
          neighborhood: data.bairro ?? "",
          city: data.localidade ?? "",
          state: data.uf ?? "",
        }));
      }
    } finally {
      setCepLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, form, total, shipping }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Erro ao processar pagamento");

      // Redireciona para o MercadoPago
      clearCart();
      window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
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

  return (
    <div className="pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#718096] mb-6">
        <Link href="/carrinho" className="hover:text-[#2B7DD4]">Carrinho</Link>
        <ChevronRight size={14} />
        <span className="text-[#1a202c] font-medium">Checkout</span>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Formulário */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Dados pessoais */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <h2 className="font-bold text-[#1a202c] mb-4 flex items-center gap-2">
                <User size={18} className="text-[#2B7DD4]" /> Dados pessoais
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Nome completo *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="João da Silva" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">E-mail *</label>
                  <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="joao@email.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Telefone *</label>
                  <input required value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">CPF *</label>
                  <input required value={form.cpf} onChange={(e) => set("cpf", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="000.000.000-00" />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <h2 className="font-bold text-[#1a202c] mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#2B7DD4]" /> Endereço de entrega
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">CEP *</label>
                  <div className="relative">
                    <input required value={form.zip_code}
                      onChange={(e) => { set("zip_code", e.target.value); fetchCep(e.target.value); }}
                      className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                      placeholder="00000-000" maxLength={9} />
                    {cepLoading && <Loader2 size={14} className="absolute right-3 top-3 animate-spin text-[#718096]" />}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Rua *</label>
                  <input required value={form.street} onChange={(e) => set("street", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="Rua Exemplo" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Número *</label>
                  <input required value={form.number} onChange={(e) => set("number", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="123" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Complemento</label>
                  <input value={form.complement} onChange={(e) => set("complement", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="Apto 42" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Bairro *</label>
                  <input required value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="Centro" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Cidade *</label>
                  <input required value={form.city} onChange={(e) => set("city", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="São Paulo" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#718096] mb-1 block">Estado *</label>
                  <input required value={form.state} onChange={(e) => set("state", e.target.value)}
                    className="w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]"
                    placeholder="SP" maxLength={2} />
                </div>
              </div>
            </div>

            {/* Pagamento */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
              <h2 className="font-bold text-[#1a202c] mb-2 flex items-center gap-2">
                <Mail size={18} className="text-[#2B7DD4]" /> Pagamento
              </h2>
              <p className="text-sm text-[#718096]">
                Você será redirecionado ao <strong>MercadoPago</strong> para escolher a forma de pagamento:
                Pix, cartão de crédito, boleto e mais.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Pix", "Crédito", "Débito", "Boleto"].map((p) => (
                  <span key={p} className="text-xs bg-[#f4f6f8] border border-[#e2e8f0] px-3 py-1 rounded-lg text-[#718096]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sticky top-24">
              <h2 className="font-bold text-[#1a202c] mb-4">Resumo</h2>

              {/* Itens */}
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
                  <span className={shipping === 0 ? "text-[#6DC040] font-medium" : ""}>
                    {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                  </span>
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
                className="mt-5 w-full flex items-center justify-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processando...</>
                ) : (
                  <>Pagar com MercadoPago <ChevronRight size={18} /></>
                )}
              </button>
              <p className="text-xs text-[#718096] text-center mt-3">🔒 Ambiente seguro</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
