import type { HTMLAttributes } from "react";

/** Superfície branca com borda, usada nos painéis e nos contadores. */
export function Cartao({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`rounded-2xl border border-borda bg-superficie ${className}`} {...props} />;
}
