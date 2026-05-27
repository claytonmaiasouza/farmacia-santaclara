import Image from "next/image";
import { Star, Check, CheckCheck } from "lucide-react";

type ReviewItem = {
  kind: "review";
  name: string;
  location: string;
  product: string;
  stars: number;
  text: string;
  avatar: string;
  productImg: string;
};

type WaItem = {
  kind: "wa";
  contact: string;
  location: string;
  avatar: string;
  messages: { from: "client" | "store"; text: string; time: string; read?: boolean }[];
};

type Item = ReviewItem | WaItem;

const items: Item[] = [
  {
    kind: "review",
    name: "Rodrigo M.",
    location: "São Paulo, BR",
    product: "Monjaro 15",
    stars: 5,
    text: "Recebi rapidinho, embalagem perfeita e bem lacrada. Produto original, exatamente como esperava. Atendimento excelente!",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://drogariasp.vteximg.com.br/arquivos/ids/1248621-500-500/888087---MOUNJARO-15MG-SOL-INJ-4-CAN-1.jpg?v=638868997203600000",
  },
  {
    kind: "review",
    name: "Fernanda C.",
    location: "Rio de Janeiro, BR",
    product: "Retatrutide Alluvi Verde",
    stars: 5,
    text: "Produto chegou em 4 dias, muito bem embalado com gelo seco. Qualidade impecável, já estou no segundo pedido!",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://alluviretatrutide40mg.uk/wp-content/uploads/2026/03/Retat40mg-Front-DR-Background-Pen-1-scaled-1-1-247x296.jpg",
  },
  {
    kind: "wa",
    contact: "Rodrigo S.",
    location: "Curitiba, PR",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
    messages: [
      { from: "client", text: "Boa tarde! Chegou meu pedido agora 🎉", time: "14:32", read: true },
      { from: "store", text: "Que ótimo! Chegou tudo certinho?", time: "14:34" },
      { from: "client", text: "Sim! Embalagem perfeita e com gelo seco. Muito obrigado!", time: "14:35", read: true },
      { from: "store", text: "Fico feliz! Qualquer dúvida é só chamar 😊", time: "14:36" },
    ],
  },
  {
    kind: "review",
    name: "Carlos A.",
    location: "Curitiba, BR",
    product: "HUTOX 100UI",
    stars: 5,
    text: "Comprei pela segunda vez. Entrega discreta, embalagem segura e produto autêntico. Super recomendo a farmácia!",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://derma-solution.com/wp-content/uploads/2024/06/hutox-100-1.webp",
  },
  {
    kind: "review",
    name: "Juliana R.",
    location: "Belo Horizonte, BR",
    product: "GLOW BLEND BPC 157",
    stars: 5,
    text: "Fiz o pedido e chegou em menos de uma semana. Excelente atendimento pelo WhatsApp. Produto 100% original!",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://peptideosdobrasil.com.br/cdn/shop/files/glow-blend-70mg-bpc157-tb500-ghk-cu-caneta-alluvi-healthcare-peptideo-701_800x.webp?v=1775171023",
  },
  {
    kind: "wa",
    contact: "Fernanda A.",
    location: "Belo Horizonte, MG",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
    messages: [
      { from: "client", text: "Recebi o Retatrutide hoje! Antes do prazo 😍", time: "10:12", read: true },
      { from: "store", text: "Perfeito! Produto chegou com gelo seco né?", time: "10:14" },
      { from: "client", text: "Sim, gelado e lacrado. Já quero repetir semana que vem", time: "10:16", read: true },
      { from: "store", text: "Pode contar com a gente! 🙌", time: "10:17" },
    ],
  },
  {
    kind: "review",
    name: "Marcos T.",
    location: "Porto Alegre, BR",
    product: "Nabota 100UI",
    stars: 4,
    text: "Produto original com nota fiscal, chegou bem lacrado. Atendimento rápido e esclarecedor. Recomendo!",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://derma-solution.com/wp-content/uploads/2022/05/nabota-100units.jpg",
  },
  {
    kind: "review",
    name: "Ana Paula S.",
    location: "Brasília, BR",
    product: "Botulax 100UI",
    stars: 5,
    text: "Já é minha terceira compra aqui. Sempre chega dentro do prazo, embalado corretamente e produto original. Nota 10!",
    avatar: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://derma-solution.com/wp-content/uploads/2022/04/botulax-100units-1.jpg",
  },
  {
    kind: "wa",
    contact: "Diego M.",
    location: "Porto Alegre, RS",
    avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150",
    messages: [
      { from: "client", text: "Chegou o Nabota, nota fiscal inclusa e tudo conferindo ✅", time: "16:08", read: true },
      { from: "store", text: "Tudo certinho como sempre! 💙", time: "16:10" },
      { from: "client", text: "Melhor farmácia que já comprei. Já recomendei pra 3 amigas!", time: "16:11", read: true },
      { from: "store", text: "Muito obrigado pela confiança! 🙏", time: "16:12" },
    ],
  },
  {
    kind: "review",
    name: "Diego F.",
    location: "Florianópolis, BR",
    product: "NAD+ Synedica LABAS",
    stars: 5,
    text: "Entrega discreta e rápida. Produto chegou gelado com embalagem térmica. Qualidade excelente, voltarei a comprar!",
    avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://precosnoparaguai.s3.amazonaws.com/product_images/a51eccec-5f9c-4e88-a5c3-fc28c6f305e5.webp",
  },
  {
    kind: "review",
    name: "Patrícia L.",
    location: "Salvador, BR",
    product: "ISRADERM 100UI",
    stars: 5,
    text: "Atendimento diferenciado, me explicaram tudo sobre o produto antes da compra. Chegou em perfeito estado. Recomendo!",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
    productImg: "https://isradermbr.com/wp-content/uploads/2025/02/7-600x750.png",
  },
  {
    kind: "wa",
    contact: "Patrícia N.",
    location: "São Paulo, SP",
    avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
    messages: [
      { from: "client", text: "Oi, chegou meu pedido do BPC-157! Embalagem discreta, amei 😍", time: "09:44", read: true },
      { from: "store", text: "Que bom! Embalagem neutra por segurança 😉", time: "09:46" },
      { from: "client", text: "Perfeito! Já deixa separado o próximo pedido", time: "09:48", read: true },
      { from: "store", text: "Claro! Já anotamos aqui 📋✅", time: "09:49" },
    ],
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= count ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

function ReviewCard({ item }: { item: ReviewItem }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-[#f4f6f8]">
          <Image src={item.avatar} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1a202c] truncate">{item.name}</p>
          <p className="text-xs text-[#718096] truncate">{item.location}</p>
        </div>
      </div>
      <Stars count={item.stars} />
      <p className="text-sm text-[#4a5568] leading-relaxed flex-1">&ldquo;{item.text}&rdquo;</p>
      <div className="flex items-center gap-2.5 pt-2 border-t border-[#f4f6f8]">
        <div className="w-10 h-10 rounded-xl bg-[#f4f6f8] overflow-hidden flex-shrink-0">
          <Image src={item.productImg} alt={item.product} width={40} height={40} className="object-contain w-full h-full p-0.5" />
        </div>
        <p className="text-xs text-[#718096] truncate">{item.product}</p>
      </div>
    </div>
  );
}

function WaCard({ item }: { item: WaItem }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md flex flex-col" style={{ background: "#f0f2f5" }}>
      <div className="flex items-center gap-2.5 px-3 py-2.5" style={{ background: "#075E54" }}>
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white/20">
          <Image src={item.avatar} alt={item.contact} width={32} height={32} className="object-cover w-full h-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-semibold leading-tight truncate">{item.contact}</p>
          <p className="text-white/70 text-[10px] leading-tight truncate">{item.location}</p>
        </div>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="white" opacity="0.7">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.12-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
      </div>
      <div
        className="flex flex-col gap-1.5 px-3 py-3 flex-1"
        style={{
          background: "#E5DDD5",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        {item.messages.map((msg, j) => (
          <div key={j} className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-2.5 py-1.5 rounded-lg text-xs leading-relaxed ${msg.from === "client" ? "rounded-tr-none" : "rounded-tl-none"} text-[#1a202c]`}
              style={{ background: msg.from === "client" ? "#DCF8C6" : "#ffffff" }}
            >
              {msg.text}
              <span className="flex items-center gap-0.5 justify-end mt-0.5">
                <span className="text-[9px] text-[#999]">{msg.time}</span>
                {msg.from === "client" && (
                  msg.read
                    ? <CheckCheck size={12} className="text-[#34B7F1]" />
                    : <Check size={12} className="text-[#999]" />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="mt-14">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a202c]">O que nossos clientes dizem</h2>
        <p className="text-[#718096] text-sm mt-1">O que dizem nossos clientes</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
          </div>
          <span className="text-sm font-semibold text-[#1a202c]">4.7</span>
          <span className="text-sm text-[#718096]">· 40+ avaliações</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) =>
          item.kind === "review"
            ? <ReviewCard key={i} item={item} />
            : <WaCard key={i} item={item} />
        )}
      </div>
    </section>
  );
}
