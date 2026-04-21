import { notFound } from "next/navigation";
import sql from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import type { Category, Brand, Product } from "@/types/database";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [productRows, categories, brands] = await Promise.all([
    sql<Product[]>`SELECT * FROM products WHERE id = ${id} LIMIT 1`,
    sql<Category[]>`SELECT * FROM categories WHERE active = true ORDER BY name`,
    sql<Brand[]>`SELECT * FROM brands WHERE active = true ORDER BY name`,
  ]);

  if (!productRows[0]) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Editar produto</h1>
        <p className="text-sm text-[#718096] line-clamp-1">{productRows[0].name}</p>
      </div>
      <ProductForm product={productRows[0]} categories={categories} brands={brands} />
    </div>
  );
}
