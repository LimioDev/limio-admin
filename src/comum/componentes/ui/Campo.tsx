import type { ReactNode } from "react";

interface CampoProps {
  id: string;
  rotulo: string;
  obrigatorio?: boolean;
  erro?: string;
  children: ReactNode;
}

/** Rótulo + controle + mensagem de erro do campo. */
export function Campo({ id, rotulo, obrigatorio, erro, children }: CampoProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-semibold text-texto">
        {rotulo}
        {obrigatorio && " *"}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-xs text-perigo">
          {erro}
        </p>
      )}
    </div>
  );
}

export const classesControle =
  "w-full rounded-xl border border-borda bg-superficie px-4 py-3 text-sm text-texto placeholder:text-texto-suave focus:border-primaria focus:outline-none aria-invalid:border-perigo";
