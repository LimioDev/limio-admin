import type { ReactNode } from "react";

/** Faixa informativa discreta (ex.: "O LIMIO não estorna nem transfere valores."). */
export function Aviso({ children }: { children: ReactNode }) {
  return <p className="rounded-lg bg-neutro-suave px-3 py-2.5 text-xs text-texto-suave">{children}</p>;
}
