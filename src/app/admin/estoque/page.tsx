"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Package, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Check, X, Pencil } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  price: number;
  cost_price: number | null;
  stock: number;
  min_stock: number;
  active: boolean;
  sku: string | null;
  units_sold: number;
  revenue: number;
  order_count: number;
}

type Filter = "all" | "top" | "low_stock" | "out_of_stock";

function StockCell({ product, onSave }: { product: Product; onSave: (id: string, stock: number, min_stock: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [stockVal, setStockVal] = useState(String(product.stock));
  const [minVal, setMinVal] = useState(String(product.min_stock));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/estoque/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Number(stockVal), min_stock: Number(minVal) }),
    });
    if (res.ok) {
      onSave(product.id, Number(stockVal), Number(minVal));
      setEditing(false);
    }
    setSaving(false);
  }

  function cancel() {
    setStockVal(String(product.stock));
    setMinVal(String(product.min_stock));
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex flex-col gap-1">
          <input
            type="number" min="0" value={stockVal}
            onChange={(e) => setStockVal(e.target.value)}
            className="w-16 border border-[#2B7DD4] rounded-lg px-2 py-1 text-xs text-center focus:outline-none"
            placeholder="Estq"
          />
          <input
            type="number" min="0" value={minVal}
            onChange={(e) => setMinVal(e.target.value)}
            className="w-16 border border-[#e2e8f0] rounded-lg px-2 py-1 text-xs text-center focus:outline-none text-[#718096]"
            placeholder="Mín"
          />
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={save} disabled={saving} className="p-1 text-green-600 hover:text-green-800 transition">
            <Check size={13} />
          </button>
          <button onClick={cancel} className="p-1 text-[#718096] hover:text-red-500 transition">
            <X size={13} />
          </button>
        </div>
      </div>
    );
  }

  const status = product.stock === 0
    ? { label: "Sem estoque", cls: "bg-red-100 text-red-700" }
    : product.stock <= product.min_stock
    ? { label: "Estoque baixo", cls: "bg-amber-100 text-amber-700" }
    : { label: "OK", cls: "bg-green-100 text-green-700" };

  return (
    <div className="flex items-center gap-2">
      <div className="text-center">
        <p className="text-sm font-bold text-[#1a202c]">{product.stock}</p>
        <p className="text-[10px] text-[#718096]">mín {product.min_stock}</p>
      </div>
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
      <button onClick={() => setEditing(true)} className="text-[#718096] hover:text-[#2B7DD4] transition">
        <Pencil size={12} />
      </button>
    </div>
  );
}

export default function EstoquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/estoque");
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleSave(id: string, stock: number, min_stock: number) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock, min_stock } : p));
  }

  const outOfStock  = products.filter((p) => p.stock === 0).length;
  const lowStock    = products.filter((p) => p.stock > 0 && p.stock <= p.min_stock).length;
  const totalSold   = products.reduce((s, p) => s + p.units_sold, 0);
  const totalRevenue = products.reduce((s, p) => s + Number(p.revenue), 0);

  const filtered = useMemo(() => {
    if (filter === "top")         return [...products].slice(0, 10);
    if (filter === "low_stock")   return products.filter((p) => p.stock > 0 && p.stock <= p.min_stock);
    if (filter === "out_of_stock") return products.filter((p) => p.stock === 0);
    return products;
  }, [products, filter]);

  const FILTERS: { value: Filter; label: string }[] = [
    { value: "all",          label: "Todos" },
    { value: "top",          label: "Top 10 mais vendidos" },
    { value: "low_stock",    label: `Estoque baixo${lowStock ? ` (${lowStock})` : ""}` },
    { value: "out_of_stock", label: `Sem estoque${outOfStock ? ` (${outOfStock})` : ""}` },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Estoque & Vendas</h1>
          <p className="text-sm text-[#718096] mt-0.5">Gerencie estoque e acompanhe as estatísticas de vendas por produto.</p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4] bg-white transition disabled:opacity-50">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Atualizar
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Package,      label: "Produtos ativos",  value: products.length,                                        cls: "text-[#2B7DD4]", bg: "bg-blue-50" },
          { icon: TrendingUp,   label: "Unidades vendidas", value: totalSold,                                             cls: "text-green-600", bg: "bg-green-50" },
          { icon: AlertTriangle, label: "Estoque baixo",   value: lowStock,                                               cls: "text-amber-600", bg: "bg-amber-50" },
          { icon: TrendingDown, label: "Sem estoque",       value: outOfStock,                                            cls: "text-red-600",   bg: "bg-red-50" },
        ].map(({ icon: Icon, label, value, cls, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={cls} />
            </div>
            <div>
              <p className="text-xs text-[#718096]">{label}</p>
              <p className="text-lg font-bold text-[#1a202c]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue highlight */}
      <div className="bg-[#1A5C2A] text-white rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-green-200">Receita total gerada</p>
          <p className="text-2xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        </div>
        <TrendingUp size={36} className="text-green-300 opacity-60" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-xl transition border ${
              filter === f.value
                ? "bg-[#2B7DD4] text-white border-[#2B7DD4]"
                : "bg-white text-[#718096] border-[#e2e8f0] hover:border-[#2B7DD4] hover:text-[#2B7DD4]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#718096]">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#718096]">Nenhum produto encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#718096]">Produto</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096]">Estoque</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096]">Vendidos</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#718096]">Pedidos</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#718096]">Receita</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#718096]">Preço</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f6f8]">
                {filtered.map((p, i) => (
                  <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#718096] w-5 text-right shrink-0">{i + 1}</span>
                        <div className="w-10 h-10 bg-[#f4f6f8] rounded-xl overflow-hidden flex-shrink-0">
                          {p.image_url ? (
                            <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-contain w-full h-full p-0.5" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-[#cbd5e0]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#1a202c] line-clamp-2">{p.name}</p>
                          {p.sku && <p className="text-[10px] text-[#718096] font-mono">{p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StockCell product={p} onSave={handleSave} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-[#1a202c]">{p.units_sold}</span>
                      <span className="text-[10px] text-[#718096] ml-1">un</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-[#4a5568]">{p.order_count}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-[#1A5C2A]">
                        R$ {Number(p.revenue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-[#718096]">
                        R$ {Number(p.price).toFixed(2).replace(".", ",")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
