import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    label: "Peptídeos",
    href: "/categoria/peptideos",
    image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "Hormônios",
    href: "/categoria/hormonios",
    image: "https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    label: "Botox",
    href: "/categoria/botox",
    image: "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default function CategoryGrid() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-[#1a202c] mb-5">Categorias</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map(({ label, href, image }) => (
          <Link
            key={label}
            href={href}
            className="relative overflow-hidden rounded-2xl h-40 sm:h-52 group shadow-sm hover:shadow-lg transition-all"
          >
            <Image
              src={image}
              alt={label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 33vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-0 left-0 right-0 text-white text-base font-bold text-center pb-4 px-2 leading-tight drop-shadow">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
