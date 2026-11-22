import axios, { isAxiosError } from "axios";

import { encerrarSessaoAdmin, lerTokenAdmin } from "../sessao/sessaoAdmin";
import { CodigoErro, ErroResponseSchema } from "../tipos/erros";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const api = axios.create({ baseURL, timeout: 20_000 });

api.interceptors.request.use((config) => {
  const token = lerTokenAdmin();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Todas as rotas do painel são `/admin/**`: 401 (sem token, inválido ou expirado) e 403
 * `ACESSO_NEGADO` (token que não é de administrador) encerram a sessão, e a casca do painel
 * leva de volta para a entrada. O erro segue para a tela, que mostra a `mensagem`.
 */
api.interceptors.response.use(undefined, (erro: unknown) => {
  if (isAxiosError(erro) && erro.response && ehFimDeSessao(erro.response.status, erro.response.data)) {
    encerrarSessaoAdmin();
  }
  return Promise.reject(erro);
});

function ehFimDeSessao(status: number, corpo: unknown): boolean {
  if (status === 401) {
    return true;
  }
  if (status !== 403) {
    return false;
  }
  const erro = ErroResponseSchema.safeParse(corpo);
  // 403 sem corpo no formato da API também é acesso negado: nada no painel responde 403 por regra de negócio.
  return !erro.success || erro.data.codigo === CodigoErro.ACESSO_NEGADO;
}
