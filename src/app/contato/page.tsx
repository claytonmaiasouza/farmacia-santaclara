import { MessageCircle, MapPin, Clock, Mail } from "lucide-react";

export default function ContatoPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a202c] mb-2">Fale Conosco</h1>
      <div className="w-12 h-1 bg-[#1A5C2A] rounded mb-8" />

      <p className="text-[#4a5568] mb-10 leading-relaxed">
        Estamos aqui para ajudar. Entre em contato pelos canais abaixo e nossa equipe responderá o mais breve possível.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <a
          href="https://wa.me/595994000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl p-5 hover:shadow-md transition-shadow group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-[#1a202c] mb-0.5 group-hover:text-[#1A5C2A]">WhatsApp</p>
            <p className="text-sm text-[#4a5568]">Atendimento rápido e personalizado</p>
            <p className="text-xs text-green-700 font-medium mt-1">Clique para abrir conversa</p>
          </div>
        </a>

        <div className="flex items-start gap-4 bg-white border border-[#e2e8f0] rounded-2xl p-5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Mail size={20} className="text-[#2B7DD4]" />
          </div>
          <div>
            <p className="font-bold text-[#1a202c] mb-0.5">E-mail</p>
            <p className="text-sm text-[#4a5568]">contacto@santaclarafarma.com.py</p>
            <p className="text-xs text-[#718096] mt-1">Respondemos em até 24h úteis</p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white border border-[#e2e8f0] rounded-2xl p-5">
          <div className="w-11 h-11 rounded-xl bg-[#f0f9f4] flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-[#1A5C2A]" />
          </div>
          <div>
            <p className="font-bold text-[#1a202c] mb-0.5">Endereço</p>
            <p className="text-sm text-[#4a5568]">Rua Cidade Leste<br />Ciudad del Este — Alto Paraná<br />Paraguay</p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-white border border-[#e2e8f0] rounded-2xl p-5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-[#1a202c] mb-0.5">Horário de atendimento</p>
            <p className="text-sm text-[#4a5568]">Segunda a Sexta: 8h às 18h</p>
            <p className="text-sm text-[#4a5568]">Sábado: 8h às 12h</p>
          </div>
        </div>
      </div>
    </main>
  );
}
