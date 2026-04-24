import { notFound } from "next/navigation";
import sql from "@/lib/db";
import BrandForm from "@/components/admin/BrandForm";
import type { Brand } from "@/types/database";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;
  const [brand] = await sql<Brand[]>`SELECT * FROM brands WHERE id = ${id} LIMIT 1`;
  if (!brand) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Editar marca</h1>
        <p className="text-sm text-[#718096]">{brand.name}</p>
      </div>
      <BrandForm brand={brand} />
    </div>
  );
}
