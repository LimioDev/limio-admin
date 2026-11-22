/** Enums do módulo `moderacao` do limio-api (ETI-114 e ETI-116), como const object + union. */

export const MotivoDenuncia = {
  NAO_PAGOU_VALOR_COMBINADO: "NAO_PAGOU_VALOR_COMBINADO",
  SERVICO_NAO_REALIZADO: "SERVICO_NAO_REALIZADO",
  COMPORTAMENTO_INADEQUADO: "COMPORTAMENTO_INADEQUADO",
  SUSPEITA_DE_FRAUDE: "SUSPEITA_DE_FRAUDE",
  OUTRO_MOTIVO: "OUTRO_MOTIVO",
} as const;
export type MotivoDenuncia = (typeof MotivoDenuncia)[keyof typeof MotivoDenuncia];

/** Sai do motivo no back (tabela provisória, pendência com o PO). */
export const Severidade = {
  ALTA: "ALTA",
  MEDIA: "MEDIA",
  BAIXA: "BAIXA",
} as const;
export type Severidade = (typeof Severidade)[keyof typeof Severidade];

export const StatusResolucao = {
  ABERTA: "ABERTA",
  PROCEDENTE: "PROCEDENTE",
  IMPROCEDENTE: "IMPROCEDENTE",
} as const;
export type StatusResolucao = (typeof StatusResolucao)[keyof typeof StatusResolucao];

export const TipoAlvoDenuncia = {
  PERFIL: "PERFIL",
  ANUNCIO: "ANUNCIO",
  SERVICO: "SERVICO",
  CANDIDATURA: "CANDIDATURA",
  MENSAGEM: "MENSAGEM",
} as const;
export type TipoAlvoDenuncia = (typeof TipoAlvoDenuncia)[keyof typeof TipoAlvoDenuncia];

/** A API aceita os quatro; o painel v1 oferece só advertência e suspensão. */
export const TipoSancao = {
  ADVERTENCIA: "ADVERTENCIA",
  OCULTAR_AVALIACAO: "OCULTAR_AVALIACAO",
  SUSPENSAO: "SUSPENSAO",
  ENCERRAMENTO_DE_CONTA: "ENCERRAMENTO_DE_CONTA",
} as const;
export type TipoSancao = (typeof TipoSancao)[keyof typeof TipoSancao];

export const VereditoModeracao = {
  PROCEDENTE: "PROCEDENTE",
  IMPROCEDENTE: "IMPROCEDENTE",
} as const;
export type VereditoModeracao = (typeof VereditoModeracao)[keyof typeof VereditoModeracao];

/** `SituacaoConta` do back (`comum/portas/enums`). */
export const SituacaoConta = {
  ATIVA: "ATIVA",
  PENDENTE_VERIFICACAO: "PENDENTE_VERIFICACAO",
  SUSPENSA: "SUSPENSA",
  ENCERRADA: "ENCERRADA",
} as const;
export type SituacaoConta = (typeof SituacaoConta)[keyof typeof SituacaoConta];

/** `PapelUsuario` do back (`comum/seguranca/enums`). */
export const PapelUsuario = {
  EMPREGADOR: "EMPREGADOR",
  PRESTADOR: "PRESTADOR",
} as const;
export type PapelUsuario = (typeof PapelUsuario)[keyof typeof PapelUsuario];
