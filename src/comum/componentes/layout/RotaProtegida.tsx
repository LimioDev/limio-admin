import { Navigate, Outlet, useLocation } from "react-router";

import { useSessaoAdmin } from "../../sessao/sessaoAdmin";

export const ROTA_ENTRADA = "/entrar";

/**
 * Deixa passar só com sessão de administrador. Sem sessão (nunca entrou, saiu, ou a API
 * respondeu 401/`ACESSO_NEGADO` e o interceptor encerrou a sessão) volta para a entrada,
 * lembrando para onde ia.
 */
export function RotaProtegida() {
  const logado = useSessaoAdmin();
  const local = useLocation();
  if (!logado) {
    return <Navigate to={ROTA_ENTRADA} replace state={{ voltarPara: local.pathname }} />;
  }
  return <Outlet />;
}
