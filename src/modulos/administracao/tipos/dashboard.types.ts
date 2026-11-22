import { z } from "zod";

const contador = z.number().int().nonnegative();

/** `DashboardResponse` do back (`GET /admin/dashboard`, ETI-117). */
export const DashboardSchema = z.object({
  usuarios: contador,
  anuncios: contador,
  candidaturas: contador,
  escolhas: contador,
  assinaturasGoldAtivas: contador,
  denunciasAbertas: contador,
  // `string`, não enum: um status novo no back não pode derrubar o painel inteiro.
  // A cor sai de `StatusOperacional`; o texto exibido é sempre a descrição que vem junto.
  statusOperacional: z.string(),
  statusOperacionalDescricao: z.string(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;
