import { z } from "zod";

import { LinkTemporarioSchema } from "../../../comum/tipos/midia";
import {
  MotivoDenuncia,
  PapelUsuario,
  Severidade,
  SituacaoConta,
  StatusResolucao,
  TipoAlvoDenuncia,
  TipoSancao,
  VereditoModeracao,
} from "./denuncia.enums";

/** `ContaModeradaResponse`: só nome, papel e situação. Nunca telefone, e-mail, CPF nem endereço. */
export const ContaModeradaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  papel: z.enum(PapelUsuario),
  situacao: z.enum(SituacaoConta),
});

export type ContaModerada = z.infer<typeof ContaModeradaSchema>;

/** `SancaoResponse`: `inicioEm`/`fimEm` só na suspensão; `avaliacaoId` só ao ocultar. */
export const SancaoSchema = z.object({
  id: z.string(),
  tipo: z.enum(TipoSancao),
  motivo: z.string(),
  inicioEm: z.string().nullable(),
  fimEm: z.string().nullable(),
  avaliacaoId: z.string().nullable(),
  aplicadaEm: z.string(),
});

export type Sancao = z.infer<typeof SancaoSchema>;

/** `DecisaoModeracaoResponse`. */
export const DecisaoModeracaoSchema = z.object({
  id: z.string(),
  veredito: z.enum(VereditoModeracao),
  fundamento: z.string(),
  administradorId: z.string(),
  decididaEm: z.string(),
  sancoes: z.array(SancaoSchema),
});

export type DecisaoModeracao = z.infer<typeof DecisaoModeracaoSchema>;

/** `AnaliseDenunciaResponse` (`GET /admin/denuncias/{id}`, ETI-116). */
export const AnaliseDenunciaSchema = z.object({
  id: z.string(),
  numero: z.number().int(),
  motivo: z.enum(MotivoDenuncia),
  severidade: z.enum(Severidade),
  /** "O que aconteceu", como o usuário escreveu. */
  descricao: z.string(),
  statusResolucao: z.enum(StatusResolucao),
  prazoAnalise: z.string(),
  criadaEm: z.string(),
  analisadaEm: z.string().nullable(),
  denunciante: ContaModeradaSchema,
  denunciado: ContaModeradaSchema,
  alvo: z.object({
    tipo: z.enum(TipoAlvoDenuncia),
    anuncioId: z.string().nullable(),
    tituloAnuncio: z.string().nullable(),
    candidaturaId: z.string().nullable(),
    mensagemId: z.string().nullable(),
  }),
  /** Foto de comprovação; nula sem foto ou com o storage fora do ar. */
  evidencia: LinkTemporarioSchema.nullable(),
  fotosCheckout: z.array(LinkTemporarioSchema),
  /** Texto original das mensagens, da mais antiga para a mais recente. */
  chat: z.array(
    z.object({
      id: z.string(),
      remetenteId: z.string(),
      texto: z.string(),
      enviadaEm: z.string(),
    }),
  ),
  outrasDenuncias: z.array(
    z.object({
      id: z.string(),
      numero: z.number().int(),
      motivo: z.enum(MotivoDenuncia),
      statusResolucao: z.enum(StatusResolucao),
      criadaEm: z.string(),
    }),
  ),
  sancoesAnteriores: z.array(SancaoSchema),
  /** Nula enquanto a denúncia está aberta. */
  decisao: DecisaoModeracaoSchema.nullable(),
});

export type AnaliseDenuncia = z.infer<typeof AnaliseDenunciaSchema>;
