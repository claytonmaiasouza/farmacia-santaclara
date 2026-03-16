"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface Rates {
  usd_gs:  number;
  brl_gs:  number;
  usd_brl: string;
  updatedAt: string | null;
}

export default function ExchangeRates() {
  const [rates, setRates] = useState<Rates | null>(null);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/cambio");
        const data = await res.json();
        setRates(data);
      } catch {
        // silently fail
      }
    }
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000); // atualiza a cada 5 min
    return () => clearInterval(interval);
  }, []);

  if (!rates) return null;

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 0 });

  return (
    <div className="flex items-center gap-1 text-xs text-white/90">
      <TrendingUp size={11} className="text-[#6DC040] flex-shrink-0" />
      <span className="text-white/60 hidden sm:inline">Câmbio Chaco:</span>
      <span className="flex items-center gap-2.5">
        <span>
          <span className="text-white/60">USD/BRL</span>{" "}
          <span className="font-semibold text-[#6DC040]">R$ {rates.usd_brl}</span>
        </span>
        <span className="text-white/30">|</span>
        <span>
          <span className="text-white/60">USD/GS</span>{" "}
          <span className="font-semibold text-[#6DC040]">{fmt(rates.usd_gs)}</span>
        </span>
        <span className="text-white/30">|</span>
        <span>
          <span className="text-white/60">BRL/GS</span>{" "}
          <span className="font-semibold text-[#6DC040]">{fmt(rates.brl_gs)}</span>
        </span>
      </span>
    </div>
  );
}
