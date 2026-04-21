"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import type { Category } from "@/types/database";

interface CategoryFormProps {
  category?: Category;
  allCategories: Category[];
  defaultParentId?: string;
}

type FormState = {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  image_url: string;
  sort_order: string;
  active: boolean;
};

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function CategoryForm({ category, allCategories, defaultParentId }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const [form, setForm] = useState<FormState>({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    parent_id: category?.parent_id ?? defaultParentId ?? "",
    image_url: category?.image_url ?? "",
    sort_order: category?.sort_order?.toString() ?? "0",
    active: category?.active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : toSlug(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      parent_id: form.parent_id || null,
      image_url: form.image_url || null,
      sort_order: parseInt(form.sort_order) || 0,
      active: form.active,
    };

    const url = isEdit ? `/api/admin/categorias/${category.id}` : "/api/admin/categorias";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar categoria");
      setLoading(false);
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  }

  const input = "w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]";
  const label = "text-xs font-medium text-[#718096] mb-1 block";

  // Filter out self and own children from parent options
  const parentOptions = allCategories.filter(
    (c) => c.id !== category?.id && c.parent_id !== category?.id
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex flex-col gap-4">

        <div>
          <label className={label}>Nome *</label>
          <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>Slug (URL)</label>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>Categoria pai (deixe vazio para categoria principal)</label>
          <select value={form.parent_id} onChange={(e) => set("parent_id", e.target.value)} className={input}>
            <option value="">— Categoria principal —</option>
            {parentOptions.filter(c => !c.parent_id).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Descrição</label>
          <input value={form.description} onChange={(e) => set("description", e.target.value)} className={input} placeholder="Ex: Tirzepatida marca Lipoless" />
        </div>

        <div>
          <label className={label}>URL da imagem (banner)</label>
          <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} className={input} placeholder="https://..." />
        </div>

        <div>
          <label className={label}>Ordem de exibição</label>
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} className={input} />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set("active", e.target.checked)}
            className="w-4 h-4 accent-[#2B7DD4]"
          />
          <span className="text-sm text-[#1a202c]">Categoria ativa (visível na loja)</span>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar categoria"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#718096] hover:border-[#2B7DD4] transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
