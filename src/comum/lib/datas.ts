/** Datas da API chegam como `Instant` (ISO-8601 em UTC); aqui viram texto no fuso do navegador. */

const formatoData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatoDataHora = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** "16/11/2026" */
export function formatarData(iso: string): string {
  return formatoData.format(new Date(iso));
}

/** "16/11/2026, 14:30" */
export function formatarDataHora(iso: string): string {
  return formatoDataHora.format(new Date(iso));
}

function doisDigitos(valor: number): string {
  return String(valor).padStart(2, "0");
}

/** Valor para `<input type="datetime-local">` (hora local, sem segundos). */
export function paraCampoDataHora(data: Date): string {
  return (
    `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}` +
    `T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`
  );
}

/** De `<input type="datetime-local">` (hora local) para `Instant` ISO em UTC; `null` se inválido. */
export function deCampoDataHora(valor: string): string | null {
  if (!valor) {
    return null;
  }
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data.toISOString();
}
