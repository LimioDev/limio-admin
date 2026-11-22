import type { ReactNode } from "react";

import { Botao } from "../ui/Botao";

interface CascaAdminProps {
  aoSair: () => void;
  children: ReactNode;
}

/** Cabeçalho "Limio · Administração" com o botão Sair, e o conteúdo da página embaixo. */
export function CascaAdmin({ aoSair, children }: CascaAdminProps) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-borda bg-superficie px-11 py-4">
        <p className="flex items-baseline gap-6">
          <span className="text-3xl font-bold tracking-tight text-texto">Limio</span>
          <span className="text-xl font-semibold text-texto">· Administração</span>
        </p>
        <Botao variante="secundaria" onClick={aoSair}>
          Sair
        </Botao>
      </header>
      <main className="px-8 py-7">{children}</main>
    </div>
  );
}
