import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { erroApi } from "../../../comum/lib/erros";
import { chavesQuery } from "../../../comum/lib/query";
import { CodigoErro } from "../../../comum/tipos/erros";
import type { DecidirDenunciaRequest } from "../tipos/decisao.types";
import type { FilaDenuncias, FiltroFila } from "../tipos/fila.types";
import { analisarDenuncia, decidirDenuncia, listarFilaDeDenuncias } from "./denuncia.api";

export const chavesDenuncia = {
  /** Prefixo de tudo da moderação: a decisão invalida fila e análise juntas. */
  todas: chavesQuery.denuncias,
  filas: [...chavesQuery.denuncias, "fila"] as const,
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

/** Tira a denúncia das filas já carregadas, sem esperar o refetch. */
function semADenuncia(id: string) {
  return (fila: FilaDenuncias | undefined): FilaDenuncias | undefined => {
    if (!fila || !fila.content.some((item) => item.id === id)) {
      return fila;
    }
    return {
      ...fila,
      content: fila.content.filter((item) => item.id !== id),
      totalElementos: Math.max(0, fila.totalElementos - 1),
    };
  };
}

/**
 * "Decidir denúncia". Depois da decisão, a denúncia some da fila na hora, e a fila, a
 * análise e o contador de denúncias abertas do dashboard são buscados de novo.
 * `DENUNCIA_JA_RESOLVIDA` (outro admin decidiu antes) também atualiza tudo.
 */
export function useDecidirDenunciaMutation(id: string) {
  const queryClient = useQueryClient();
  const atualizar = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: chavesDenuncia.todas }),
      queryClient.invalidateQueries({ queryKey: chavesQuery.dashboard }),
    ]);
  };
  return useMutation({
    mutationFn: (pedido: DecidirDenunciaRequest) => decidirDenuncia(id, pedido),
    onSuccess: () => {
      queryClient.setQueriesData<FilaDenuncias>({ queryKey: chavesDenuncia.filas }, semADenuncia(id));
      void atualizar();
    },
    onError: (erro) => {
      if (erroApi(erro)?.codigo === CodigoErro.DENUNCIA_JA_RESOLVIDA) {
        void atualizar();
      }
    },
  });
}
