import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { chavesQuery } from "../../../comum/lib/query";
import type { FiltroFila } from "../tipos/fila.types";
import { analisarDenuncia, listarFilaDeDenuncias } from "./denuncia.api";

export const chavesDenuncia = {
  /** Prefixo de tudo da moderação: a decisão invalida fila e análise juntas. */
  todas: chavesQuery.denuncias,
  fila: (filtro: FiltroFila) => [...chavesQuery.denuncias, "fila", filtro] as const,
  analise: (id: string) => [...chavesQuery.denuncias, "analise", id] as const,
};

export function useFilaDenunciasQuery(filtro: FiltroFila) {
  return useQuery({
    queryKey: chavesDenuncia.fila(filtro),
    queryFn: () => listarFilaDeDenuncias(filtro),
    placeholderData: keepPreviousData,
  });
}

export function useAnaliseDenunciaQuery(id: string) {
  return useQuery({
    queryKey: chavesDenuncia.analise(id),
    queryFn: () => analisarDenuncia(id),
  });
}
