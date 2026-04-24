"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Copy, Upload } from "lucide-react";
import type { Category, Brand, Product } from "@/types/database";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}

type FormState = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  sku: string;
  price: string;
  original_price: string;
  cost_price: string;
  stock: string;
  min_stock: string;
  category_id: string;
  brand_id: string;
  image_url: string;
  featured: boolean;
  active: boolean;
  requires_prescription: boolean;
  in_promo: boolean;
  in_bestseller: boolean;
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

export default function ProductForm({ product, categories, brands }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    short_description: product?.short_description ?? "",
    description: product?.description ?? "",
    sku: product?.sku ?? "",
    price: product?.price?.toString() ?? "",
    original_price: product?.original_price?.toString() ?? "",
    cost_price: product?.cost_price?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    min_stock: product?.min_stock?.toString() ?? "5",
    category_id: product?.category_id ?? "",
    brand_id: product?.brand_id ?? "",
    image_url: product?.image_url ?? "",
    featured: product?.featured ?? false,
    active: product?.active ?? true,
    requires_prescription: product?.requires_prescription ?? false,
    in_promo: (product as any)?.in_promo ?? false,
    in_bestseller: (product as any)?.in_bestseller ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erro ao fazer upload"); return; }
      set("image_url", data.url);
    } catch {
      setError("Erro ao fazer upload da imagem");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function set(field: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : toSlug(name) }));
  }

  async function handleSaveAsNew() {
    setError("");
    setLoadingNew(true);

    const suffix = `-${Date.now().toString(36)}`;
    const payload = {
      name: form.name,
      slug: toSlug(form.name) + suffix,
      short_description: form.short_description || null,
      description: form.description || null,
      sku: null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      stock: parseInt(form.stock),
      min_stock: parseInt(form.min_stock),
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      image_url: form.image_url || null,
      featured: form.featured,
      active: form.active,
      requires_prescription: form.requires_prescription,
      in_promo: form.in_promo,
      in_bestseller: form.in_bestseller,
    };

    const res = await fetch("/api/admin/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao criar produto");
      setLoadingNew(false);
      return;
    }

    const data = await res.json();
    router.push(`/admin/produtos/${data.id}`);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      short_description: form.short_description || null,
      description: form.description || null,
      sku: form.sku || null,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      cost_price: form.cost_price ? parseFloat(form.cost_price) : null,
      stock: parseInt(form.stock),
      min_stock: parseInt(form.min_stock),
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      image_url: form.image_url || null,
      featured: form.featured,
      active: form.active,
      requires_prescription: form.requires_prescription,
      in_promo: form.in_promo,
      in_bestseller: form.in_bestseller,
    };

    const url = isEdit ? `/api/admin/produtos/${product.id}` : "/api/admin/produtos";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar produto");
      setLoading(false);
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  const input = "w-full border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B7DD4]";
  const label = "text-xs font-medium text-[#718096] mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Coluna principal */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Info básica */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <h3 className="font-semibold text-[#1a202c] mb-4">Informações básicas</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className={label}>Nome *</label>
                <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>Slug (URL)</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>Descrição curta</label>
                <input value={form.short_description} onChange={(e) => set("short_description", e.target.value)} className={input} placeholder="Ex: Vitamina C 1000mg, 10 comprimidos" />
              </div>
              <div>
                <label className={label}>Descrição completa</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={5}
                  className={`${input} resize-none`}
                  placeholder="Descrição detalhada do produto..."
                />
              </div>
            </div>
          </div>

          {/* Preços */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <h3 className="font-semibold text-[#1a202c] mb-4">Preços</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={label}>Preço de venda *</label>
                <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className={input} placeholder="0,00" />
              </div>
              <div>
                <label className={label}>Preço original (riscado)</label>
                <input type="number" step="0.01" min="0" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} className={input} placeholder="0,00" />
              </div>
              <div>
                <label className={label}>Preço de custo</label>
                <input type="number" step="0.01" min="0" value={form.cost_price} onChange={(e) => set("cost_price", e.target.value)} className={input} placeholder="0,00" />
              </div>
            </div>
          </div>

          {/* Estoque */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <h3 className="font-semibold text-[#1a202c] mb-4">Estoque</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Quantidade em estoque</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>Estoque mínimo (alerta)</label>
                <input type="number" min="0" value={form.min_stock} onChange={(e) => set("min_stock", e.target.value)} className={input} />
              </div>
              <div>
                <label className={label}>SKU</label>
                <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={input} placeholder="Ex: VITA-C-1000" />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="flex flex-col gap-4">

          {/* Status */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <h3 className="font-semibold text-[#1a202c] mb-4">Status</h3>
            <div className="flex flex-col gap-3">
              {[
                { field: "active" as const, label: "Produto ativo (visível na loja)" },
                { field: "featured" as const, label: "Destaque na home" },
                { field: "requires_prescription" as const, label: "Requer prescrição médica" },
                { field: "in_promo" as const, label: "🏷️ Carrossel: Promoção de Inauguração" },
                { field: "in_bestseller" as const, label: "⭐ Carrossel: Mais Vendidos" },
              ].map(({ field, label: lbl }) => (
                <label key={field} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[field] as boolean}
                    onChange={(e) => set(field, e.target.checked)}
                    className="w-4 h-4 accent-[#2B7DD4]"
                  />
                  <span className="text-sm text-[#1a202c]">{lbl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categoria e Marca */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <h3 className="font-semibold text-[#1a202c] mb-4">Organização</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className={label}>Categoria</label>
                <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className={input}>
                  <option value="">Sem categoria</option>
                  {categories.filter(c => !c.parent_id).map((parent) => {
                    const children = categories.filter(c => c.parent_id === parent.id);
                    return children.length > 0 ? (
                      <optgroup key={parent.id} label={parent.name}>
                        <option value={parent.id}>{parent.name} (geral)</option>
                        {children.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </optgroup>
                    ) : (
                      <option key={parent.id} value={parent.id}>{parent.name}</option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className={label}>Marca</label>
                <select value={form.brand_id} onChange={(e) => set("brand_id", e.target.value)} className={input}>
                  <option value="">Sem marca</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <h3 className="font-semibold text-[#1a202c] mb-4">Imagem principal</h3>
            <div>
              <label className={label}>URL da imagem</label>
              <input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} className={input} placeholder="https://..." />
            </div>
            <div className="mt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4] rounded-xl py-3 text-sm text-[#718096] transition-colors disabled:opacity-60"
              >
                {uploadingImage ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                {uploadingImage ? "Enviando..." : "Subir foto (JPG, PNG, WebP · máx 5MB)"}
              </button>
            </div>
            {form.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.image_url} alt="Preview" className="mt-3 w-full aspect-square object-contain rounded-xl bg-[#f4f6f8] p-2" />
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          type="submit"
          disabled={loading || loadingNew}
          className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar produto"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleSaveAsNew}
            disabled={loading || loadingNew}
            className="flex items-center gap-2 bg-white border border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4] disabled:opacity-60 text-[#1a202c] font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {loadingNew ? <Loader2 size={17} className="animate-spin" /> : <Copy size={17} />}
            {loadingNew ? "Criando..." : "Salvar como novo produto"}
          </button>
        )}
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-[#e2e8f0] rounded-xl text-sm text-[#718096] hover:border-[#2B7DD4] transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
