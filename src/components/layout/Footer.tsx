import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Instagram, Facebook, ShieldCheck, Lock, BadgeCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a202c] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Coluna 1 — Marca */}
          <div className="space-y-4">
            <Image
              src="/images/logo.png"
              alt="Farmácia Santa Clara"
              width={160}
              height={50}
              className="opacity-90"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              Cuidando da sua saúde com qualidade e confiança há anos. Produtos
              originais e atendimento especializado.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2B7DD4] transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2B7DD4] transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Coluna 2 — Categorias */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Peptídeos", href: "/categoria/peptideos" },
                { label: "Hormônios", href: "/categoria/hormonios" },
                { label: "Botox & Toxinas", href: "/categoria/botox" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#6DC040] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3 — Institucional */}
          <div>
            <h3 className="text-white font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Sobre nós", href: "/sobre" },
                { label: "Política de Privacidade", href: "/privacidade" },
                { label: "Termos de Uso", href: "/termos" },
                { label: "Trocas e Devoluções", href: "/trocas" },
                { label: "Como Comprar", href: "/como-comprar" },
                { label: "Fale Conosco", href: "/contato" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#6DC040] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4 — Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#6DC040] mt-0.5 flex-shrink-0" />
                <span>Calle Boquerón, Sala 31<br />Cidade del Este — Alto Paraná<br />Paraguay</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#6DC040] flex-shrink-0" />
                <a href="mailto:contacto@santaclarafarma.com.py" className="hover:text-[#6DC040] transition-colors">
                  contacto@santaclarafarma.com.py
                </a>
              </li>
            </ul>

            {/* Site Seguro */}
            <div className="mt-6">
              <h4 className="text-white text-xs font-semibold mb-3 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#6DC040]" /> Site Seguro
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <Lock size={13} className="text-[#6DC040] shrink-0" />
                  <span className="text-xs text-gray-300">Conexão SSL 256-bit criptografada</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <BadgeCheck size={13} className="text-[#6DC040] shrink-0" />
                  <span className="text-xs text-gray-300">Dados protegidos e privados</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <ShieldCheck size={13} className="text-[#6DC040] shrink-0" />
                  <span className="text-xs text-gray-300">Compra 100% segura e garantida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security bar */}
      <div className="border-t border-white/10 py-4 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">© 2026 Farmácia Santa Clara. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
              <Lock size={11} className="text-[#6DC040]" />
              SSL Seguro
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
              <ShieldCheck size={11} className="text-[#6DC040]" />
              Privacidade Garantida
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
              <BadgeCheck size={11} className="text-[#6DC040]" />
              Compra Segura
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
