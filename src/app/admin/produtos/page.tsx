import Link from "next/link";
import sql from "@/lib/db";
import { Plus, Package } from "lucide-react";
import type { Product } from "@/types/database";
import ExportButton from "./ExportButton";
import ProductsTable from "./ProductsTable";

interface ProductRow extends Product {
  brand_name: string | null;
  category_name: string | null;
  parent_name: string | null;
  grandparent_name: string | null;
}

export default async function AdminProductsPage() {
  const products = await sql<ProductRow[]>`
    SELECT p.*,
           b.name AS brand_name,
           c.name AS category_name,
           pc.name AS parent_name,
           gpc.name AS grandparent_name
    FROM products p
    LEFT JOIN brands b ON b.id = p.brand_id
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN categories pc ON pc.id = c.parent_id
    LEFT JOIN categories gpc ON gpc.id = pc.parent_id
    ORDER BY grandparent_name NULLS LAST, parent_name NULLS LAST, category_name NULLS LAST, p.name
  `;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a202c]">Produtos</h1>
          <p className="text-sm text-[#718096]">{products.length} produto{products.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton />
          <Link
            href="/admin/produtos/novo"
            className="flex items-center gap-2 bg-[#2B7DD4] hover:bg-[#1a5fa8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} /> Novo produto
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] py-16 text-center">
          <Package size={48} className="text-[#e2e8f0] mx-auto mb-4" />
          <p className="text-[#718096]">Nenhum produto cadastrado.</p>
          <Link href="/admin/produtos/novo" className="text-[#2B7DD4] text-sm mt-2 inline-block hover:underline">
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  );
}
