import sql from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import type { Category, Brand } from "@/types/database";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    sql<Category[]>`SELECT * FROM categories WHERE active = true ORDER BY name`,
    sql<Brand[]>`SELECT * FROM brands WHERE active = true ORDER BY name`,
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Novo produto</h1>
        <p className="text-sm text-[#718096]">Preencha os dados do produto</p>
      </div>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
