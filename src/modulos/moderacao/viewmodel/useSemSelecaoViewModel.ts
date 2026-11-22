import { useLocation } from "react-router";

/** Estado de navegação que a decisão deixa ao voltar para a fila. */
export interface EstadoVoltaDaDecisao {
  ultimaDecidida: number;
}

function ehEstadoVoltaDaDecisao(estado: unknown): estado is EstadoVoltaDaDecisao {
  return (
    typeof estado === "object" &&
    estado !== null &&
    typeof (estado as Partial<EstadoVoltaDaDecisao>).ultimaDecidida === "number"
  );
}

/** Painel da direita sem denúncia aberta: avisa qual acabou de ser decidida, se veio da decisão. */
export function useSemSelecaoViewModel() {
  const { state } = useLocation();
  return {
    ultimaDecidida: ehEstadoVoltaDaDecisao(state) ? state.ultimaDecidida : null,
  };
}
