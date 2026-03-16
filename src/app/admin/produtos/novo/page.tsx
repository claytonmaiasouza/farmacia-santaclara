import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Category, Brand } from "@/types/database";

export default async function NewProductPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = (await createClient()) as any;

  const [{ data: categories }, { data: brands }] = await Promise.all([
    db.from("categories").select("*").eq("active", true).order("name") as { data: Category[] },
    db.from("brands").select("*").eq("active", true).order("name") as { data: Brand[] },
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Novo produto</h1>
        <p className="text-sm text-[#718096]">Preencha os dados do produto</p>
      </div>
      <ProductForm categories={categories ?? []} brands={brands ?? []} />
    </div>
  );
}
