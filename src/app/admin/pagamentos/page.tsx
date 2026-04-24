"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, CreditCard, Building2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "pix" | "transferencia";
  label: string;
  key_value: string;
  holder: string | null;
  bank: string | null;
  agency: string | null;
  account: string | null;
  active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  type: "pix" as "pix" | "transferencia",
  label: "",
  key_value: "",
  holder: "",
  bank: "",
  agency: "",
  account: "",
};

export default function PagamentosPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/payment-methods");
    if (res.ok) setMethods(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  function setField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    }
    setSaving(false);
  }

  async function toggleActive(m: PaymentMethod) {
    await fetch(`/api/admin/payment-methods/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !m.active }),
    });
    setMethods((prev) => prev.map((x) => x.id === m.id ? { ...x, active: !x.active } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este meio de pagamento?")) return;
    await fetch(`/api/admin/payment-methods/${id}`, { method: "DELETE" });
    setMethods((prev) => prev.filter((x) => x.id !== id));
  }

  const inputCls = "w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]";
  const labelCls = "text-xs font-medium text-[#718096] mb-1 block";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Meios de Pagamento</h1>
          <p className="text-sm text-[#718096] mt-0.5">
            Contas e chaves usadas pelo agente para informar clientes com pedidos aguardando pagamento.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#2266b8] text-white text-sm font-medium px-4 py-2 rounded-xl transition"
        >
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 mb-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[#1a202c] text-sm">Novo meio de pagamento</h2>

          {/* Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setField("type", "pix")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition ${form.type === "pix" ? "border-[#2B7DD4] bg-blue-50 text-[#2B7DD4]" : "border-[#e2e8f0] text-[#718096] hover:border-[#2B7DD4]"}`}
            >
              <CreditCard size={16} /> Pix
            </button>
            <button
              type="button"
              onClick={() => setField("type", "transferencia")}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition ${form.type === "transferencia" ? "border-[#2B7DD4] bg-blue-50 text-[#2B7DD4]" : "border-[#e2e8f0] text-[#718096] hover:border-[#2B7DD4]"}`}
            >
              <Building2 size={16} /> Transferência
            </button>
          </div>

          {/* Label */}
          <div>
            <label className={labelCls}>Nome / Identificação *</label>
            <input
              required
              value={form.label}
              onChange={(e) => setField("label", e.target.value)}
              className={inputCls}
              placeholder={form.type === "pix" ? "Ex: Pix Principal" : "Ex: Conta Bradesco"}
            />
          </div>

          {form.type === "pix" ? (
            <div>
              <label className={labelCls}>Chave Pix *</label>
              <input
                required
                value={form.key_value}
                onChange={(e) => setField("key_value", e.target.value)}
                className={inputCls}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Banco *</label>
                <input required value={form.bank} onChange={(e) => setField("bank", e.target.value)} className={inputCls} placeholder="Bradesco" />
              </div>
              <div>
                <label className={labelCls}>Agência *</label>
                <input required value={form.agency} onChange={(e) => setField("agency", e.target.value)} className={inputCls} placeholder="0001" />
              </div>
              <div>
                <label className={labelCls}>Conta *</label>
                <input required value={form.account} onChange={(e) => setField("account", e.target.value)} className={inputCls} placeholder="12345-6" />
              </div>
              <div>
                <label className={labelCls}>Chave Pix (opcional)</label>
                <input value={form.key_value} onChange={(e) => setField("key_value", e.target.value)} className={inputCls} placeholder="Se tiver Pix também" />
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>Titular da conta</label>
            <input
              value={form.holder}
              onChange={(e) => setField("holder", e.target.value)}
              className={inputCls}
              placeholder="Nome completo ou razão social"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm px-4 py-2 rounded-xl border border-[#e2e8f0] text-[#718096] hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-sm px-4 py-2 rounded-xl bg-[#2B7DD4] hover:bg-[#2266b8] text-white font-medium transition disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      {methods.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center text-[#718096] text-sm">
          Nenhum meio de pagamento cadastrado ainda.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {methods.map((m) => (
            <div key={m.id} className={`bg-white rounded-2xl border p-4 flex items-start justify-between gap-4 transition ${m.active ? "border-[#e2e8f0]" : "border-[#e2e8f0] opacity-60"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${m.type === "pix" ? "bg-blue-100" : "bg-purple-100"}`}>
                  {m.type === "pix" ? <CreditCard size={16} className="text-[#2B7DD4]" /> : <Building2 size={16} className="text-purple-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-[#1a202c]">{m.label}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {m.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  {m.type === "pix" ? (
                    <p className="text-sm text-[#4a5568] mt-0.5">
                      Chave Pix: <span className="font-mono font-medium">{m.key_value}</span>
                    </p>
                  ) : (
                    <div className="text-sm text-[#4a5568] mt-0.5 flex flex-col gap-0.5">
                      {m.bank && <span>Banco: <strong>{m.bank}</strong></span>}
                      {m.agency && <span>Agência: <strong>{m.agency}</strong></span>}
                      {m.account && <span>Conta: <strong>{m.account}</strong></span>}
                      {m.key_value && <span>Pix: <span className="font-mono font-medium">{m.key_value}</span></span>}
                    </div>
                  )}

                  {m.holder && <p className="text-xs text-[#718096] mt-1">Titular: {m.holder}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(m)}
                  className="text-[#718096] hover:text-[#2B7DD4] transition"
                  title={m.active ? "Desativar" : "Ativar"}
                >
                  {m.active
                    ? <ToggleRight size={24} className="text-green-500" />
                    : <ToggleLeft size={24} />}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-[#718096] hover:text-red-500 transition"
                  title="Remover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {methods.some((m) => m.active) && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-[#4a5568]">
          <strong className="text-[#1a202c]">Meios ativos</strong> são enviados automaticamente no WhatsApp ao cliente quando um pedido é criado e usados pelo agente para informar sobre o pagamento.
        </div>
      )}
    </div>
  );
}
