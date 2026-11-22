import { z } from "zod";

import { deCampoDataHora } from "../../../comum/lib/datas";
import { StatusResolucao, TipoSancao, VereditoModeracao } from "./denuncia.enums";
import { DecisaoModeracaoSchema } from "./analise.types";

/** `DecisaoModeracao.FUNDAMENTO_MAX` no back. */
export const FUNDAMENTO_MAX = 2000;

/**
 * Sanções que o painel v1 oferece. "Nenhuma" é a ausência de sanção (só no improcedente);
 * ocultar avaliação e encerramento de conta existem na API, mas ficam fora do painel por ora.
 */
export const SancaoPainel = {
  NENHUMA: "NENHUMA",
  ADVERTENCIA: TipoSancao.ADVERTENCIA,
  SUSPENSAO: TipoSancao.SUSPENSAO,
} as const;

export type SancaoPainel = (typeof SancaoPainel)[keyof typeof SancaoPainel];

/**
 * Formulário de decisão. Repete as regras do `DecidirDenunciaUseCase` que dá para conferir
 * aqui, para o admin não esperar o 400: fundamento obrigatório; procedente sempre com
 * sanção, improcedente sem; suspensão com início e fim, o fim depois do início e no futuro.
 * `inicioEm`/`fimEm` são valores de `<input type="datetime-local">` (hora local).
 */
export const DecisaoFormSchema = z
  .object({
    veredito: z.enum(VereditoModeracao),
    sancao: z.enum(SancaoPainel),
    fundamento: z
      .string()
      .trim()
      .min(1, "Preencha o fundamento para decidir.")
      .max(FUNDAMENTO_MAX, `O fundamento deve ter no máximo ${FUNDAMENTO_MAX} caracteres.`),
    inicioEm: z.string(),
    fimEm: z.string(),
  })
  .superRefine((form, ctx) => {
    if (form.veredito === VereditoModeracao.PROCEDENTE && form.sancao === SancaoPainel.NENHUMA) {
      ctx.addIssue({ code: "custom", path: ["sancao"], message: "Escolha a sanção da denúncia procedente." });
    }
    if (form.veredito === VereditoModeracao.IMPROCEDENTE && form.sancao !== SancaoPainel.NENHUMA) {
      ctx.addIssue({ code: "custom", path: ["sancao"], message: "Denúncia improcedente não leva sanção." });
    }
    if (form.sancao !== SancaoPainel.SUSPENSAO) {
      return;
    }
    const inicio = deCampoDataHora(form.inicioEm);
    const fim = deCampoDataHora(form.fimEm);
    if (!inicio) {
      ctx.addIssue({ code: "custom", path: ["inicioEm"], message: "Informe o início da suspensão." });
    }
    if (!fim) {
      ctx.addIssue({ code: "custom", path: ["fimEm"], message: "Informe o fim da suspensão." });
      return;
    }
    if (inicio && fim <= inicio) {
      ctx.addIssue({ code: "custom", path: ["fimEm"], message: "O fim precisa ser depois do início." });
    } else if (new Date(fim).getTime() <= Date.now()) {
      ctx.addIssue({ code: "custom", path: ["fimEm"], message: "O fim da suspensão precisa estar no futuro." });
    }
  });

export type DecisaoForm = z.input<typeof DecisaoFormSchema>;

/** Corpo de `POST /admin/denuncias/{id}/decisao` (`DecidirDenunciaRequest`, ETI-116). */
export const DecidirDenunciaRequestSchema = z.object({
  veredito: z.enum(VereditoModeracao),
  fundamento: z.string().trim().min(1).max(FUNDAMENTO_MAX),
  sancao: z.enum(TipoSancao).optional(),
  inicioEm: z.iso.datetime().optional(),
  fimEm: z.iso.datetime().optional(),
});

export type DecidirDenunciaRequest = z.infer<typeof DecidirDenunciaRequestSchema>;

/** `DenunciaDecididaResponse`: a denúncia resolvida, fora da fila. */
export const DenunciaDecididaSchema = z.object({
  id: z.string(),
  numero: z.number().int(),
  statusResolucao: z.enum(StatusResolucao),
  analisadaEm: z.string(),
  decisao: DecisaoModeracaoSchema,
});

export type DenunciaDecidida = z.infer<typeof DenunciaDecididaSchema>;
