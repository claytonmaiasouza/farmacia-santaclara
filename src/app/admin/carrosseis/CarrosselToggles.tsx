"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand_name: string | null;
  image_url: string | null;
  price: number;
  in_promo: boolean;
  in_bestseller: boolean;
  in_launch: boolean;
}

interface CarouselConfig {
  key: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
}

interface Props {
  products: Product[];
  config: CarouselConfig[];
}

const LABELS: Record<string, { emoji: string; label: string }> = {
  promo:      { emoji: "🏷️", label: "Promoção" },
  bestseller: { emoji: "⭐", label: "Mais Vendidos" },
  launch:     { emoji: "🆕", label: "Lançamentos" },
};

function TitleEditor({ item, onSave }: { item: CarouselConfig; onSave: (updated: CarouselConfig) => void }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle ?? "");
  const [badge, setBadge] = useState(item.badge ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/carrosseis", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: item.key, title, subtitle: subtitle || null, badge: badge || null }),
    });
    setSaving(false);
    setEditing(false);
    onSave({ ...item, title, subtitle: subtitle || null, badge: badge || null });
  }

  function cancel() {
    setTitle(item.title);
    setSubtitle(item.subtitle ?? "");
    setBadge(item.badge ?? "");
    setEditing(false);
  }

  const meta = LABELS[item.key];

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#718096] uppercase tracking-wide mb-2">
            {meta.emoji} {meta.label}
          </p>
          {editing ? (
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-xs text-[#718096] mb-1 block">Título</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm text-[#1a202c] focus:outline-none focus:border-[#2B7DD4]"
                />
              </div>
              <div>
                <label className="text-xs text-[#718096] mb-1 block">Subtítulo</label>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="(opcional)"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm text-[#1a202c] focus:outline-none focus:border-[#2B7DD4]"
                />
              </div>
              <div>
                <label className="text-xs text-[#718096] mb-1 block">Badge (etiqueta)</label>
                <input
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="ex: NOVO, OFERTA (opcional)"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm text-[#1a202c] focus:outline-none focus:border-[#2B7DD4]"
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-[#1a202c]">
                {item.title}
                {item.badge && (
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                    {item.badge}
                  </span>
                )}
              </p>
              {item.subtitle && <p className="text-sm text-[#718096] mt-0.5">{item.subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex gap-1.5 flex-shrink-0">
          {editing ? (
            <>
              <button
                onClick={save}
                disabled={saving || !title.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A5C2A] text-white hover:bg-[#145023] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Salvar
              </button>
              <button
                onClick={cancel}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0] disabled:opacity-50 transition-colors"
              >
                <X size={12} /> Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0] transition-colors"
            >
              <Pencil size={12} /> Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarrosselToggles({ products: initial, config: initialConfig }: Props) {
  const [products, setProducts] = useState(initial);
  const [config, setConfig] = useState(initialConfig);
  const [pending, startTransition] = useTransition();

  async function toggle(id: string, field: "in_promo" | "in_bestseller" | "in_launch", value: boolean) {
    startTransition(async () => {
      await fetch(`/api/admin/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    });
  }

  const promoCount = products.filter((p) => p.in_promo).length;
  const bestsellerCount = products.filter((p) => p.in_bestseller).length;
  const launchCount = products.filter((p) => p.in_launch).length;

  return (
    <div>
      {/* Edição de títulos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {config.map((item) => (
          <TitleEditor
            key={item.key}
            item={item}
            onSave={(updated) => setConfig((prev) => prev.map((c) => c.key === updated.key ? updated : c))}
          />
        ))}
      </div>

      <div className="flex gap-4 mb-4 text-sm text-[#718096] flex-wrap">
        <span>🏷️ Promoção: <strong className="text-[#1a202c]">{promoCount}</strong> produtos</span>
        <span>⭐ Mais Vendidos: <strong className="text-[#1a202c]">{bestsellerCount}</strong> produtos</span>
        <span>🆕 Lançamentos: <strong className="text-[#1a202c]">{launchCount}</strong> produtos</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide">Produto</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide w-40">🏷️ Promoção</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide w-40">⭐ Mais Vendidos</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096] uppercase tracking-wide w-40">🆕 Lançamentos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f4f6f8]">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-[#f4f6f8] p-0.5 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[#1a202c] truncate">{p.name}</p>
                      {p.brand_name && <p className="text-xs text-[#718096] truncate">{p.brand_name}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={pending}
                    onClick={() => toggle(p.id, "in_promo", !p.in_promo)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                      p.in_promo ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {p.in_promo ? "✓ Incluído" : "Adicionar"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={pending}
                    onClick={() => toggle(p.id, "in_bestseller", !p.in_bestseller)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                      p.in_bestseller ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {p.in_bestseller ? "✓ Incluído" : "Adicionar"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={pending}
                    onClick={() => toggle(p.id, "in_launch", !p.in_launch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                      p.in_launch ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "bg-[#f4f6f8] text-[#718096] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {p.in_launch ? "✓ Incluído" : "Adicionar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
