"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, BarChart2, Percent, Minus } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "tracking" | "percentage" | "fixed";
  discount_value: number;
  active: boolean;
  usage_count: number;
  max_uses: number | null;
  expires_at: string | null;
  created_at: string;
}

const EMPTY_FORM = {
  code: "",
  description: "",
  discount_type: "tracking" as Coupon["discount_type"],
  discount_value: "",
  max_uses: "",
  expires_at: "",
};

const TYPE_LABELS: Record<string, string> = {
  tracking: "Rastreamento",
  percentage: "% Desconto",
  fixed: "R$ Desconto",
};

export default function CuponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/cupons");
    if (res.ok) setCoupons(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  function setField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/cupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        discount_value: Number(form.discount_value) || 0,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
        expires_at: form.expires_at || null,
      }),
    });
    if (res.ok) {
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } else {
      const d = await res.json();
      setError(d.error || "Erro ao salvar");
    }
    setSaving(false);
  }

  async function toggleActive(c: Coupon) {
    await fetch(`/api/admin/cupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    setCoupons((prev) => prev.map((x) => x.id === c.id ? { ...x, active: !x.active } : x));
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este cupom?")) return;
    await fetch(`/api/admin/cupons/${id}`, { method: "DELETE" });
    setCoupons((prev) => prev.filter((x) => x.id !== id));
  }

  const inputCls = "w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]";
  const labelCls = "text-xs font-medium text-[#718096] mb-1 block";

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Cupons</h1>
          <p className="text-sm text-[#718096] mt-0.5">
            Gerencie cupons de rastreamento e desconto. Cada pedido registra qual cupom foi usado.
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(""); }}
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#2266b8] text-white text-sm font-medium px-4 py-2 rounded-xl transition"
        >
          <Plus size={16} /> Novo cupom
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 mb-6 flex flex-col gap-4">
          <h2 className="font-semibold text-[#1a202c] text-sm">Novo cupom</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Código do cupom *</label>
              <input
                required
                value={form.code}
                onChange={(e) => setField("code", e.target.value.toUpperCase())}
                className={inputCls}
                placeholder="Ex: INSTAGRAM10, TRAFEGO2024"
              />
            </div>
            <div>
              <label className={labelCls}>Tipo</label>
              <select value={form.discount_type} onChange={(e) => setField("discount_type", e.target.value)} className={inputCls}>
                <option value="tracking">Rastreamento (sem desconto)</option>
                <option value="percentage">Desconto em %</option>
                <option value="fixed">Desconto em R$</option>
              </select>
            </div>
          </div>

          {form.discount_type !== "tracking" && (
            <div>
              <label className={labelCls}>
                {form.discount_type === "percentage" ? "Desconto (%)" : "Desconto (R$)"} *
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.discount_value}
                onChange={(e) => setField("discount_value", e.target.value)}
                className={inputCls}
                placeholder={form.discount_type === "percentage" ? "Ex: 10" : "Ex: 50.00"}
              />
            </div>
          )}

          <div>
            <label className={labelCls}>Descrição / Origem</label>
            <input
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={inputCls}
              placeholder="Ex: Cupom para campanha Instagram — Abril 2025"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Limite de usos (vazio = ilimitado)</label>
              <input
                type="number"
                min="1"
                value={form.max_uses}
                onChange={(e) => setField("max_uses", e.target.value)}
                className={inputCls}
                placeholder="Ex: 100"
              />
            </div>
            <div>
              <label className={labelCls}>Expira em (opcional)</label>
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setField("expires_at", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm px-4 py-2 rounded-xl border border-[#e2e8f0] text-[#718096] hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="text-sm px-4 py-2 rounded-xl bg-[#2B7DD4] hover:bg-[#2266b8] text-white font-medium transition disabled:opacity-60">
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center text-[#718096] text-sm">
          Nenhum cupom cadastrado ainda.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {coupons.map((c) => (
            <div key={c.id} className={`bg-white rounded-2xl border p-4 flex items-start justify-between gap-4 transition ${c.active ? "border-[#e2e8f0]" : "border-[#e2e8f0] opacity-60"}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  {c.discount_type === "tracking" ? <Tag size={16} className="text-violet-600" /> :
                   c.discount_type === "percentage" ? <Percent size={16} className="text-violet-600" /> :
                   <Minus size={16} className="text-violet-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-[#1a202c] font-mono">{c.code}</p>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                      {TYPE_LABELS[c.discount_type]}
                    </span>
                    {c.discount_type !== "tracking" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {c.discount_type === "percentage" ? `${c.discount_value}% off` : `R$ ${Number(c.discount_value).toFixed(2)} off`}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  {c.description && <p className="text-xs text-[#718096] mt-0.5">{c.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-[#4a5568]">
                      <BarChart2 size={11} /> {c.usage_count} uso{c.usage_count !== 1 ? "s" : ""}
                      {c.max_uses !== null && ` / ${c.max_uses}`}
                    </span>
                    {c.expires_at && (
                      <span className="text-xs text-[#718096]">
                        Expira: {new Date(c.expires_at).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(c)} className="text-[#718096] hover:text-[#2B7DD4] transition" title={c.active ? "Desativar" : "Ativar"}>
                  {c.active ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} />}
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-[#718096] hover:text-red-500 transition" title="Remover">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-[#4a5568]">
        <strong className="text-[#1a202c]">Como usar:</strong> Cupons de <strong>rastreamento</strong> identificam a origem do cliente (Instagram, tráfego pago, influencer, etc.) sem dar desconto. Cupons de desconto reduzem o total do pedido automaticamente no checkout.
      </div>
    </div>
  );
}
