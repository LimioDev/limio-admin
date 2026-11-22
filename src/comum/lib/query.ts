import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

/** Erro 4xx é resposta da API (sessão, validação, não encontrado): repetir não muda nada. */
function deveRepetir(tentativas: number, erro: unknown): boolean {
  const status = isAxiosError(erro) ? erro.response?.status : undefined;
  if (status !== undefined && status >= 400 && status < 500) {
    return false;
  }
  return tentativas < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: deveRepetir, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});
