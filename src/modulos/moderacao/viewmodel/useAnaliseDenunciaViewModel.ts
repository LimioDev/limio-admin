import { formatarData, formatarDataHora } from "../../../comum/lib/datas";
import { erroApi, mensagemErroApi } from "../../../comum/lib/erros";
import { CodigoErro } from "../../../comum/tipos/erros";
import { useAnaliseDenunciaQuery } from "../servico/denuncia.queries";
import type { AnaliseDenuncia, ContaModerada, Sancao } from "../tipos/analise.types";
import { StatusResolucao, TipoSancao } from "../tipos/denuncia.enums";
import {
  rotuloMotivo,
  rotuloPapel,
  rotuloSancao,
  rotuloSituacaoConta,
  rotuloStatusResolucao,
  rotuloTipoAlvo,
} from "../tipos/denuncia.rotulos";

export interface MensagemChatView {
  id: string;
  autor: string;
  texto: string;
  enviadaEm: string;
}

export interface ItemHistoricoView {
  id: string;
  texto: string;
}

export interface AnaliseView {
  id: string;
  numero: number;
  aberta: boolean;
  status: string;
  criadaEm: string;
  prazoAnalise: string;
  denunciante: string;
  denunciado: string;
  alvo: string;
  motivo: string;
  descricao: string;
  evidenciaUrl: string | null;
  historicoResumo: string;
  historico: ItemHistoricoView[];
  chat: MensagemChatView[];
  fotosUrls: string[];
  dadosAlvo: string;
  decisao: {
    veredito: string;
    fundamento: string;
    decididaEm: string;
    sancoes: string[];
  } | null;
}

function descreverSancao(sancao: Sancao): string {
  const rotulo = rotuloSancao[sancao.tipo];
  if (sancao.tipo === TipoSancao.SUSPENSAO && sancao.inicioEm && sancao.fimEm) {
    return `${rotulo} de ${formatarData(sancao.inicioEm)} a ${formatarData(sancao.fimEm)}`;
  }
  return `${rotulo} em ${formatarData(sancao.aplicadaEm)}`;
}

function quantasDenuncias(quantidade: number): string {
  if (quantidade === 0) {
    return "Nenhuma denúncia anterior";
  }
  return quantidade === 1 ? "1 denúncia anterior" : `${quantidade} denúncias anteriores`;
}

function descreverConta(conta: ContaModerada): string {
  return `${conta.nome} · ${rotuloPapel[conta.papel]} · ${rotuloSituacaoConta[conta.situacao]}`;
}

/** Converte a resposta da API no que o painel mostra: textos prontos, datas formatadas. */
function paraView(dados: AnaliseDenuncia): AnaliseView {
  const nomes = new Map([
    [dados.denunciante.id, dados.denunciante.nome],
    [dados.denunciado.id, dados.denunciado.nome],
  ]);
  const sancoes = dados.sancoesAnteriores.map(descreverSancao);
  const alvo = rotuloTipoAlvo[dados.alvo.tipo];

  return {
    id: dados.id,
    numero: dados.numero,
    aberta: dados.statusResolucao === StatusResolucao.ABERTA,
    status: rotuloStatusResolucao[dados.statusResolucao],
    criadaEm: formatarDataHora(dados.criadaEm),
    prazoAnalise: formatarData(dados.prazoAnalise),
    denunciante: dados.denunciante.nome,
    denunciado: dados.denunciado.nome,
    alvo: dados.alvo.tituloAnuncio ? `${alvo} · ${dados.alvo.tituloAnuncio}` : alvo,
    motivo: rotuloMotivo[dados.motivo],
    descricao: dados.descricao,
    evidenciaUrl: dados.evidencia?.url ?? null,
    historicoResumo: [
      quantasDenuncias(dados.outrasDenuncias.length),
      sancoes.length > 0 ? sancoes.join(", ") : "Nenhuma sanção",
    ].join(" · "),
    historico: dados.outrasDenuncias.map((outra) => ({
      id: outra.id,
      texto:
        `Nº ${outra.numero} · ${rotuloMotivo[outra.motivo]} · ` +
        `${rotuloStatusResolucao[outra.statusResolucao]} · ${formatarData(outra.criadaEm)}`,
    })),
    chat: dados.chat.map((mensagem) => ({
      id: mensagem.id,
      autor: nomes.get(mensagem.remetenteId) ?? "Outro participante",
      texto: mensagem.texto,
      enviadaEm: formatarDataHora(mensagem.enviadaEm),
    })),
    fotosUrls: dados.fotosCheckout.map((foto) => foto.url),
    dadosAlvo: descreverConta(dados.denunciado),
    decisao: dados.decisao
      ? {
          veredito: rotuloStatusResolucao[dados.decisao.veredito],
          fundamento: dados.decisao.fundamento,
          decididaEm: formatarDataHora(dados.decisao.decididaEm),
          sancoes: dados.decisao.sancoes.map(descreverSancao),
        }
      : null,
  };
}

/** "Analisar denúncia" (ETI-116): histórico, chat, fotos e dados do alvo. */
export function useAnaliseDenunciaViewModel(id: string) {
  const consulta = useAnaliseDenunciaQuery(id);
  const naoEncontrada = erroApi(consulta.error)?.codigo === CodigoErro.DENUNCIA_NAO_ENCONTRADA;
  return {
    carregando: consulta.isPending,
    erro: consulta.isError ? mensagemErroApi(consulta.error, "Não foi possível carregar a denúncia.") : null,
    // Denúncia inexistente: tentar de novo não adianta.
    tentarDeNovo: naoEncontrada ? undefined : () => void consulta.refetch(),
    analise: consulta.data ? paraView(consulta.data) : null,
  };
}

export type AnaliseDenunciaViewModel = ReturnType<typeof useAnaliseDenunciaViewModel>;
