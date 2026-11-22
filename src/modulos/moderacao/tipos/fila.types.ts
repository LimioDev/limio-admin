import { z } from "zod";

import { respostaPaginadaSchema } from "../../../comum/tipos/api";
import { MotivoDenuncia, Severidade } from "./denuncia.enums";

/** `FilaDenunciaItemResponse` do back (`GET /admin/denuncias`, ETI-116). */
export const FilaDenunciaItemSchema = z.object({
  id: z.string(),
  numero: z.number().int(),
  motivo: z.enum(MotivoDenuncia),
  severidade: z.enum(Severidade),
  denunciadoId: z.string().nullable(),
  /** Nulo se o id nunca existiu; "Conta encerrada" se a conta foi encerrada. */
  denunciadoNome: z.string().nullable(),
  prazoAnalise: z.string(),
  criadaEm: z.string(),
});

export type FilaDenunciaItem = z.infer<typeof FilaDenunciaItemSchema>;

export const FilaDenunciasSchema = respostaPaginadaSchema(FilaDenunciaItemSchema);

export type FilaDenuncias = z.infer<typeof FilaDenunciasSchema>;

/** Parâmetros de `GET /admin/denuncias`; `pagina` começa em 0, `tamanho` vai até 50. */
export interface FiltroFila {
  pagina: number;
  tamanho: number;
}
