import sql from "@/lib/db";

const DEFAULTS: Record<string, unknown> = {
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

export async function getSetting<T = unknown>(key: string): Promise<T> {
  try {
    const rows = await sql`SELECT value FROM site_settings WHERE key = ${key} LIMIT 1`;
    if (rows[0] !== undefined) return rows[0].value as T;
  } catch { /* table may not exist yet */ }
  return DEFAULTS[key] as T;
}

export async function getAllSettings(): Promise<Record<string, unknown>> {
  try {
    const rows = await sql`SELECT key, value FROM site_settings`;
    const result = { ...DEFAULTS };
    for (const row of rows) result[row.key] = row.value;
    return result;
  } catch {
    return { ...DEFAULTS };
  }
}
