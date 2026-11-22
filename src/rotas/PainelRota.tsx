import { Outlet } from "react-router";

import { CascaAdmin } from "../comum/componentes/layout/CascaAdmin";
import { DashboardView } from "../modulos/administracao/view/DashboardView";
import { useDashboardViewModel } from "../modulos/administracao/viewmodel/useDashboardViewModel";
import { useSairViewModel } from "../modulos/administracao/viewmodel/useSairViewModel";

/** Id da seção da fila, alvo do atalho do cartão "Denúncias abertas". */
export const ID_FILA = "fila-denuncias";

/** Casca do painel: cabeçalho, contadores do dashboard e, embaixo, a moderação. */
export function PainelRota() {
  const { sair } = useSairViewModel();
  const dashboard = useDashboardViewModel();
  return (
    <CascaAdmin aoSair={sair}>
      <DashboardView {...dashboard} hrefFila={`#${ID_FILA}`} />
      <div className="mt-7">
        <Outlet />
      </div>
    </CascaAdmin>
  );
}
