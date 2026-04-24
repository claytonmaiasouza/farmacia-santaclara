import BrandForm from "@/components/admin/BrandForm";

export default function NovaMarcaPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Nova marca</h1>
        <p className="text-sm text-[#718096]">Preencha os dados da nova marca.</p>
      </div>
      <BrandForm />
    </div>
  );
}
