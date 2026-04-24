import Image from "next/image";
import { Clock, Wrench } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="flex flex-col items-center gap-6 max-w-lg">
        {/* Ícone */}
        <div className="w-20 h-20 rounded-2xl bg-[#e8f0fb] flex items-center justify-center">
          <Wrench size={38} className="text-[#2B7DD4]" />
        </div>

        {/* Logo / Nome */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Farmácia Santa Clara" width={44} height={44} className="rounded-xl" onError={() => {}} />
          <span className="text-xl font-bold text-[#1a202c]">Farmácia Santa Clara</span>
        </div>

        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-[#1a202c] leading-tight">
            Estamos em manutenção
          </h1>
          <p className="text-[#718096] mt-3 leading-relaxed">
            Nosso site está passando por melhorias para oferecer uma experiência ainda melhor.
            Voltaremos em breve!
          </p>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-2.5 rounded-full">
          <Clock size={15} />
          Previsão de retorno em breve
        </div>

        {/* Contato WhatsApp */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 w-full text-left">
          <p className="text-sm font-semibold text-[#1a202c] mb-1">Precisa de atendimento?</p>
          <p className="text-xs text-[#718096] mb-3">
            Entre em contato pelo WhatsApp — nossa equipe está disponível.
          </p>
          <a
            href="https://wa.me/595992959689"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.119 1.534 5.851L.057 23.5l5.797-1.521A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.876 9.876 0 0 1-5.031-1.373l-.361-.214-3.741.981.999-3.648-.235-.374A9.867 9.867 0 0 1 2.106 12C2.106 6.523 6.523 2.106 12 2.106S21.894 6.523 21.894 12 17.477 21.894 12 21.894z"/>
            </svg>
            Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
