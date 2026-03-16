import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Category, Brand, Product } from "@/types/database";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (await createClient()) as any;

  const [{ data: product }, { data: categories }, { data: brands }] = await Promise.all([
    db.from("products").select("*").eq("id", id).single() as { data: Product | null },
    db.from("categories").select("*").eq("active", true).order("name") as { data: Category[] },
    db.from("brands").select("*").eq("active", true).order("name") as { data: Brand[] },
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Editar produto</h1>
        <p className="text-sm text-[#718096] line-clamp-1">{product.name}</p>
      </div>
      <ProductForm product={product} categories={categories ?? []} brands={brands ?? []} />
    </div>
  );
}
