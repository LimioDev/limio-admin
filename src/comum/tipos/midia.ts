import { z } from "zod";

/** `LinkTemporario` do back (`comum/midia`): link assinado de leitura, válido até `expiraEm`. */
export const LinkTemporarioSchema = z.object({
  url: z.string(),
  expiraEm: z.string(),
});

export type LinkTemporario = z.infer<typeof LinkTemporarioSchema>;
