import Link from "next/link";
import {
  Pill,
  Leaf,
  Sparkles,
  Baby,
  Heart,
  Droplets,
} from "lucide-react";

const categories = [
  { label: "Medicamentos", href: "/categoria/medicamentos", icon: Pill, color: "bg-blue-50 text-[#2B7DD4]" },
  { label: "Vitaminas", href: "/categoria/vitaminas", icon: Leaf, color: "bg-green-50 text-[#1A5C2A]" },
  { label: "Dermocosméticos", href: "/categoria/dermocosmeticos", icon: Sparkles, color: "bg-purple-50 text-purple-600" },
  { label: "Bebê e Criança", href: "/categoria/bebe", icon: Baby, color: "bg-pink-50 text-pink-500" },
  { label: "Saúde Sexual", href: "/categoria/saude-sexual", icon: Heart, color: "bg-red-50 text-red-500" },
  { label: "Higiene", href: "/categoria/higiene", icon: Droplets, color: "bg-cyan-50 text-cyan-600" },
];

export default function CategoryGrid() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-[#1a202c] mb-5">Categorias</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {categories.map(({ label, href, icon: Icon, color }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-[#e2e8f0] hover:border-[#2B7DD4] hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
              <Icon size={22} />
            </div>
            <span className="text-xs font-medium text-[#1a202c] text-center leading-tight">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
