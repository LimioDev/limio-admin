import { Navigate } from "react-router";

import { EntradaView } from "../modulos/administracao/view/EntradaView";
import { useEntradaViewModel } from "../modulos/administracao/viewmodel/useEntradaViewModel";

export function EntradaRota() {
  const { jaLogado, destino, ...vm } = useEntradaViewModel();
  if (jaLogado) {
    return <Navigate to={destino} replace />;
  }
  return <EntradaView {...vm} />;
}
