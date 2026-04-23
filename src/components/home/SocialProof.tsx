import Image from "next/image";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Rodrigo M.",
    location: "São Paulo, BR",
    product: "Monjaro 15",
    stars: 5,
    text: "Recebi rapidinho, embalagem perfeita e bem lacrada. Produto original, exatamente como esperava. Atendimento excelente!",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://drogariasp.vteximg.com.br/arquivos/ids/1248621-500-500/888087---MOUNJARO-15MG-SOL-INJ-4-CAN-1.jpg?v=638868997203600000",
  },
  {
    name: "Fernanda C.",
    location: "Rio de Janeiro, BR",
    product: "Retratutide Alluvi Verde",
    stars: 5,
    text: "Produto chegou em 4 dias, muito bem embalado com gelo seco. Qualidade impecável, já estou no segundo pedido!",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://alluviretatrutide40mg.uk/wp-content/uploads/2026/03/Retat40mg-Front-DR-Background-Pen-1-scaled-1-1-247x296.jpg",
  },
  {
    name: "Carlos A.",
    location: "Curitiba, BR",
    product: "HUTOX 100UI",
    stars: 5,
    text: "Comprei pela segunda vez. Entrega discreta, embalagem segura e produto autentico. Super recomendo a farmácia!",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://derma-solution.com/wp-content/uploads/2024/06/hutox-100-1.webp",
  },
  {
    name: "Juliana R.",
    location: "Belo Horizonte, BR",
    product: "GLOW BLEND BPC 157",
    stars: 5,
    text: "Fiz o pedido e chegou em menos de uma semana. Excelente atendimento pelo WhatsApp. Produto 100% original!",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://peptideosdobrasil.com.br/cdn/shop/files/glow-blend-70mg-bpc157-tb500-ghk-cu-caneta-alluvi-healthcare-peptideo-701_800x.webp?v=1775171023",
  },
  {
    name: "Marcos T.",
    location: "Porto Alegre, BR",
    product: "Nabota 100UI",
    stars: 4,
    text: "Produto original com nota fiscal, chegou bem lacrado. Atendimento rápido e esclarecedor. Recomendo!",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://derma-solution.com/wp-content/uploads/2022/05/nabota-100units.jpg",
  },
  {
    name: "Ana Paula S.",
    location: "Brasília, BR",
    product: "Botulax 100UI",
    stars: 5,
    text: "Já é minha terceira compra aqui. Sempre chega dentro do prazo, embalado corretamente e produto original. Nota 10!",
    avatar: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://derma-solution.com/wp-content/uploads/2022/04/botulax-100units-1.jpg",
  },
  {
    name: "Diego F.",
    location: "Florianópolis, BR",
    product: "NAD+ Synedica LABAS",
    stars: 5,
    text: "Entrega discreta e rápida. Produto chegou gelado com embalagem térmica. Qualidade excelente, voltarei a comprar!",
    avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://precosnoparaguai.s3.amazonaws.com/product_images/a51eccec-5f9c-4e88-a5c3-fc28c6f305e5.webp",
  },
  {
    name: "Patrícia L.",
    location: "Salvador, BR",
    product: "ISRADERM 100UI",
    stars: 5,
    text: "Atendimento diferenciado, me explicaram tudo sobre o produto antes da compra. Chegou em perfeito estado. Recomendo!",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://isradermbr.com/wp-content/uploads/2025/02/7-600x750.png",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= count ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="mt-14">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a202c]">O que nossos clientes dizem</h2>
        <p className="text-[#718096] text-sm mt-1">Pedidos reais de clientes satisfeitos</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
          </div>
          <span className="text-sm font-semibold text-[#1a202c]">4.9</span>
          <span className="text-sm text-[#718096]">· 200+ avaliações</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#f4f6f8]">
                <Image src={r.avatar} alt={r.name} width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1a202c] truncate">{r.name}</p>
                <p className="text-xs text-[#718096] truncate">{r.location}</p>
              </div>
            </div>

            <Stars count={r.stars} />

            <p className="text-sm text-[#4a5568] leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>

            <div className="flex items-center gap-2.5 pt-2 border-t border-[#f4f6f8]">
              <div className="w-10 h-10 rounded-xl bg-[#f4f6f8] overflow-hidden flex-shrink-0">
                <Image
                  src={r.productImg}
                  alt={r.product}
                  width={40}
                  height={40}
                  className="object-contain w-full h-full p-0.5"
                />
              </div>
              <p className="text-xs text-[#718096] truncate">{r.product}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
