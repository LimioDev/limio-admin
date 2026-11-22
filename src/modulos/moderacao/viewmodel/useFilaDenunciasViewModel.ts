import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { formatarData } from "../../../comum/lib/datas";
import { mensagemErroApi } from "../../../comum/lib/erros";
import { useFilaDenunciasQuery } from "../servico/denuncia.queries";
import type { Severidade } from "../tipos/denuncia.enums";
import { rotuloMotivo, rotuloSeveridade } from "../tipos/denuncia.rotulos";

const TAMANHO_PAGINA = 20;
const PARAMETRO_PAGINA = "pagina";

export interface ItemFilaView {
  id: string;
  numero: string;
  criadaEm: string;
  motivo: string;
  severidade: Severidade;
  severidadeRotulo: string;
  denunciado: string;
  prazo: string;
  selecionado: boolean;
  href: string;
}

/** A página fica na URL (`?pagina=2`, começando em 1) e acompanha a denúncia aberta ao lado. */
function hrefComPagina(caminho: string, pagina: number): string {
  return pagina > 1 ? `${caminho}?${PARAMETRO_PAGINA}=${pagina}` : caminho;
}

function lerPagina(valor: string | null): number {
  const pagina = Number(valor);
  return Number.isInteger(pagina) && pagina >= 1 ? pagina : 1;
}

/** Fila de denúncias abertas (ETI-116), paginada, com a denúncia aberta destacada. */
export function useFilaDenunciasViewModel(idSelecionado: string | undefined) {
  const [parametros, setParametros] = useSearchParams();
  const pagina = lerPagina(parametros.get(PARAMETRO_PAGINA));
  const consulta = useFilaDenunciasQuery({ pagina: pagina - 1, tamanho: TAMANHO_PAGINA });
  const dados = consulta.data;

  // Decidir a última denúncia da última página deixa a página vazia: volta para a anterior.
  const ultimaPagina = dados?.totalPaginas ?? 0;
  const paginaSobrando = !consulta.isPlaceholderData && ultimaPagina > 0 && pagina > ultimaPagina;
  useEffect(() => {
    if (paginaSobrando) {
      setParametros(ultimaPagina > 1 ? { [PARAMETRO_PAGINA]: String(ultimaPagina) } : {}, { replace: true });
    }
  }, [paginaSobrando, ultimaPagina, setParametros]);

  const itens: ItemFilaView[] = (dados?.content ?? []).map((item) => ({
    id: item.id,
    numero: `Nº ${item.numero}`,
    criadaEm: formatarData(item.criadaEm),
    motivo: rotuloMotivo[item.motivo],
    severidade: item.severidade,
    severidadeRotulo: rotuloSeveridade[item.severidade],
    denunciado: item.denunciadoNome ?? "Conta não encontrada",
    prazo: formatarData(item.prazoAnalise),
    selecionado: item.id === idSelecionado,
    href: hrefComPagina(`/denuncias/${item.id}`, pagina),
  }));

  const caminhoAtual = idSelecionado ? `/denuncias/${idSelecionado}` : "/";

  return {
    carregando: consulta.isPending,
    erro: consulta.isError ? mensagemErroApi(consulta.error, "Não foi possível carregar a fila de denúncias.") : null,
    tentarDeNovo: () => void consulta.refetch(),
    total: dados?.totalElementos ?? null,
    itens,
    vazia: dados !== undefined && dados.totalElementos === 0,
    /** Volta para a fila mantendo a página (usado depois de decidir). */
    hrefFila: hrefComPagina("/", pagina),
    paginacao:
      ultimaPagina > 1
        ? {
            atual: pagina,
            total: ultimaPagina,
            hrefAnterior: pagina > 1 ? hrefComPagina(caminhoAtual, pagina - 1) : null,
            hrefProxima: pagina < ultimaPagina ? hrefComPagina(caminhoAtual, pagina + 1) : null,
          }
        : null,
  };
}

export type FilaDenunciasViewModel = ReturnType<typeof useFilaDenunciasViewModel>;
