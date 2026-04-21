import { notFound } from "next/navigation";
import sql from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";
import type { Category } from "@/types/database";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;

  const [categoryRow, categories] = await Promise.all([
    sql<Category[]>`SELECT * FROM categories WHERE id = ${id} LIMIT 1`,
    sql<Category[]>`SELECT * FROM categories ORDER BY name`,
  ]);

  if (!categoryRow[0]) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Editar categoria</h1>
        <p className="text-sm text-[#718096]">{categoryRow[0].name}</p>
      </div>
      <CategoryForm category={categoryRow[0]} allCategories={categories} />
    </div>
  );
}
