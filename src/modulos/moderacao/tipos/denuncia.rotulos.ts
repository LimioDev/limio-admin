import type {
  MotivoDenuncia,
  PapelUsuario,
  Severidade,
  SituacaoConta,
  StatusResolucao,
  TipoAlvoDenuncia,
  TipoSancao,
} from "./denuncia.enums";

/** Texto exibido de cada valor. O back manda só o código ("o texto exibido fica no app"). */

export const rotuloMotivo: Record<MotivoDenuncia, string> = {
  NAO_PAGOU_VALOR_COMBINADO: "Não pagou o valor combinado",
  SERVICO_NAO_REALIZADO: "Serviço não foi realizado",
  COMPORTAMENTO_INADEQUADO: "Comportamento inadequado",
  SUSPEITA_DE_FRAUDE: "Suspeita de fraude",
  OUTRO_MOTIVO: "Outro motivo",
};

export const rotuloSeveridade: Record<Severidade, string> = {
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

export const rotuloStatusResolucao: Record<StatusResolucao, string> = {
  ABERTA: "Aberta",
  PROCEDENTE: "Procedente",
  IMPROCEDENTE: "Improcedente",
};

export const rotuloTipoAlvo: Record<TipoAlvoDenuncia, string> = {
  PERFIL: "Perfil",
  ANUNCIO: "Anúncio",
  SERVICO: "Serviço",
  CANDIDATURA: "Candidatura",
  MENSAGEM: "Mensagem",
};

export const rotuloSancao: Record<TipoSancao, string> = {
  ADVERTENCIA: "Advertência",
  OCULTAR_AVALIACAO: "Avaliação ocultada",
  SUSPENSAO: "Suspensão",
  ENCERRAMENTO_DE_CONTA: "Encerramento de conta",
};

export const rotuloSituacaoConta: Record<SituacaoConta, string> = {
  ATIVA: "Conta ativa",
  PENDENTE_VERIFICACAO: "Verificação pendente",
  SUSPENSA: "Conta suspensa",
  ENCERRADA: "Conta encerrada",
};

export const rotuloPapel: Record<PapelUsuario, string> = {
  EMPREGADOR: "Empregador",
  PRESTADOR: "Prestador",
};
