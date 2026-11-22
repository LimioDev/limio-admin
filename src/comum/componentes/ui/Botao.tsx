import type { ButtonHTMLAttributes } from "react";

const Variante = {
  PRIMARIA: "primaria",
  SECUNDARIA: "secundaria",
} as const;

type Variante = (typeof Variante)[keyof typeof Variante];

const classesVariante: Record<Variante, string> = {
  primaria:
    "bg-primaria text-white hover:bg-primaria/90 disabled:bg-neutro-suave disabled:text-texto-suave",
  secundaria:
    "border border-borda bg-superficie text-primaria hover:bg-primaria-suave disabled:text-texto-suave",
};

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

export function Botao({ variante = Variante.PRIMARIA, className = "", type = "button", ...props }: BotaoProps) {
  return (
    <button
      type={type}
      className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${classesVariante[variante]} ${className}`}
      {...props}
    />
  );
}
