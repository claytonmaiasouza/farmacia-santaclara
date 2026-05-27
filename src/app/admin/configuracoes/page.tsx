"use client";

import { useEffect, useState } from "react";
import { Save, Phone, Clock, MessageSquare, CheckCircle } from "lucide-react";

interface BusinessDay {
  aberto: boolean;
  abre: string;
  fecha: string;
}

interface Horario {
  segunda: BusinessDay;
  terca:   BusinessDay;
  quarta:  BusinessDay;
  quinta:  BusinessDay;
  sexta:   BusinessDay;
  sabado:  BusinessDay;
  domingo: BusinessDay;
}

interface Settings {
  whatsapp_atacado_numero: string;
  followup_mensagem: string;
  followup_ativo: boolean;
  followup_minutos: number;
  horario: Horario;
}

const DEFAULTS: Settings = {
  whatsapp_atacado_numero: "+595985254396",
  followup_mensagem: "Olá! Ainda está por aí? 😊 Posso continuar te ajudando com seu pedido na Farmácia Santa Clara!",
  followup_ativo: true,
  followup_minutos: 5,
  horario: {
    segunda: { aberto: true,  abre: "08:00", fecha: "18:00" },
    terca:   { aberto: true,  abre: "08:00", fecha: "18:00" },
    quarta:  { aberto: true,  abre: "08:00", fecha: "18:00" },
    quinta:  { aberto: true,  abre: "08:00", fecha: "18:00" },
    sexta:   { aberto: true,  abre: "08:00", fecha: "18:00" },
    sabado:  { aberto: true,  abre: "08:00", fecha: "13:00" },
    domingo: { aberto: false, abre: "08:00", fecha: "12:00" },
  },
};

const DIAS: { key: keyof Horario; label: string }[] = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca",   label: "Terça-feira" },
  { key: "quarta",  label: "Quarta-feira" },
  { key: "quinta",  label: "Quinta-feira" },
  { key: "sexta",   label: "Sexta-feira" },
  { key: "sabado",  label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Partial<Settings>) => {
        setSettings({
          ...DEFAULTS,
          ...data,
          horario: { ...DEFAULTS.horario, ...(data.horario ?? {}) },
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const setDia = (key: keyof Horario, patch: Partial<BusinessDay>) =>
    setSettings((p) => ({ ...p, horario: { ...p.horario, [key]: { ...p.horario[key], ...patch } } }));

  const inputCls =
    "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7DD4]/30 bg-white";

  if (loading) return <div className="text-sm text-gray-400">Carregando...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold text-[#1a202c]">Configurações</h1>

      {/* Wholesale contact */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-[#1a202c] flex items-center gap-2">
          <Phone size={16} className="text-[#2B7DD4]" /> Contato para Atacado
        </h2>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Número WhatsApp</label>
          <input
            type="text"
            className={inputCls}
            value={settings.whatsapp_atacado_numero}
            onChange={(e) => setSettings((p) => ({ ...p, whatsapp_atacado_numero: e.target.value }))}
            placeholder="+5511999999999"
          />
          <p className="text-xs text-gray-400 mt-1">
            Enviado como card de contato quando o cliente perguntar sobre preço no atacado.
          </p>
        </div>
      </section>

      {/* Follow-up */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-[#1a202c] flex items-center gap-2">
          <MessageSquare size={16} className="text-[#2B7DD4]" /> Follow-up por Inatividade
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.followup_ativo}
            onChange={(e) => setSettings((p) => ({ ...p, followup_ativo: e.target.checked }))}
            className="accent-[#2B7DD4] w-4 h-4"
          />
          <span className="text-sm text-gray-700">Ativar follow-up automático</span>
        </label>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Tempo de inatividade (minutos)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            disabled={!settings.followup_ativo}
            className={inputCls + " disabled:opacity-50"}
            value={settings.followup_minutos}
            onChange={(e) => setSettings((p) => ({ ...p, followup_minutos: Number(e.target.value) }))}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Mensagem de follow-up</label>
          <textarea
            rows={3}
            disabled={!settings.followup_ativo}
            className={inputCls + " disabled:opacity-50 resize-none"}
            value={settings.followup_mensagem}
            onChange={(e) => setSettings((p) => ({ ...p, followup_mensagem: e.target.value }))}
          />
        </div>
        <p className="text-xs text-gray-400">
          Requer cron job no servidor. Ver instruções de configuração.
        </p>
      </section>

      {/* Business hours */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-[#1a202c] flex items-center gap-2">
          <Clock size={16} className="text-[#2B7DD4]" /> Horário de Funcionamento
        </h2>
        <div className="space-y-2">
          {DIAS.map(({ key, label }) => {
            const dia = settings.horario[key];
            return (
              <div key={key} className="flex items-center gap-3 flex-wrap">
                <input
                  type="checkbox"
                  checked={dia.aberto}
                  onChange={(e) => setDia(key, { aberto: e.target.checked })}
                  className="accent-[#2B7DD4] w-4 h-4 flex-shrink-0"
                />
                <span className="text-sm w-32 text-gray-700">{label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    disabled={!dia.aberto}
                    value={dia.abre}
                    onChange={(e) => setDia(key, { abre: e.target.value })}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2B7DD4]/30 disabled:opacity-40"
                  />
                  <span className="text-xs text-gray-400">–</span>
                  <input
                    type="time"
                    disabled={!dia.aberto}
                    value={dia.fecha}
                    onChange={(e) => setDia(key, { fecha: e.target.value })}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#2B7DD4]/30 disabled:opacity-40"
                  />
                </div>
                {!dia.aberto && (
                  <span className="text-xs text-gray-400 italic">Fechado</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 bg-[#2B7DD4] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2368b0] transition-colors disabled:opacity-60"
      >
        {saved ? <CheckCircle size={16} /> : <Save size={16} />}
        {saved ? "Salvo!" : saving ? "Salvando..." : "Salvar configurações"}
      </button>
    </div>
  );
}
