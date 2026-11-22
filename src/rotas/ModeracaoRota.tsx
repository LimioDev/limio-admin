import { useParams } from "react-router";

import { FilaDenunciasView } from "../modulos/moderacao/view/FilaDenunciasView";
import { SemSelecaoView } from "../modulos/moderacao/view/SemSelecaoView";
import { useFilaDenunciasViewModel } from "../modulos/moderacao/viewmodel/useFilaDenunciasViewModel";
import { useSemSelecaoViewModel } from "../modulos/moderacao/viewmodel/useSemSelecaoViewModel";
import { ID_FILA } from "./PainelRota";

/** `/` e `/denuncias/:id`: a fila à esquerda e, à direita, a denúncia aberta (ou nenhuma). */
export function ModeracaoRota() {
  const { id } = useParams();
  const { hrefFila: _hrefFila, ...fila } = useFilaDenunciasViewModel(id);
  const semSelecao = useSemSelecaoViewModel();
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <FilaDenunciasView id={ID_FILA} {...fila} />
      <SemSelecaoView ultimaDecidida={semSelecao.ultimaDecidida} filaVazia={fila.vazia} />
    </div>
  );
}
