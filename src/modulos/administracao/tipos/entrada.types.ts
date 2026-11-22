import { z } from "zod";

/** Formulário da entrada do admin. TODO(US60): vira e-mail e senha quando o login existir. */
export const EntradaFormSchema = z.object({
  token: z.string().trim().min(1, "Cole o token de acesso do administrador."),
});

export type EntradaForm = z.infer<typeof EntradaFormSchema>;
