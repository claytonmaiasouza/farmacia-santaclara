import sql from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";
import type { Category } from "@/types/database";

interface Props {
  searchParams: Promise<{ parent?: string }>;
}

export default async function NewCategoryPage({ searchParams }: Props) {
  const { parent } = await searchParams;
  const categories = await sql<Category[]>`SELECT * FROM categories ORDER BY name`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Nova categoria</h1>
        <p className="text-sm text-[#718096]">Crie uma categoria ou subcategoria</p>
      </div>
      <CategoryForm allCategories={categories} defaultParentId={parent} />
    </div>
  );
}
