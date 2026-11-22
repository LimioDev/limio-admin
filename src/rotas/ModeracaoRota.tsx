import { useParams } from "react-router";

import { AnaliseDenunciaView } from "../modulos/moderacao/view/AnaliseDenunciaView";
import { FilaDenunciasView } from "../modulos/moderacao/view/FilaDenunciasView";
import { SemSelecaoView } from "../modulos/moderacao/view/SemSelecaoView";
import { useAnaliseDenunciaViewModel } from "../modulos/moderacao/viewmodel/useAnaliseDenunciaViewModel";
import { useFilaDenunciasViewModel } from "../modulos/moderacao/viewmodel/useFilaDenunciasViewModel";
import { useSemSelecaoViewModel } from "../modulos/moderacao/viewmodel/useSemSelecaoViewModel";
import { ID_FILA } from "./PainelRota";

/** `/` e `/denuncias/:id`: a fila à esquerda e, à direita, a denúncia aberta (ou nenhuma). */
export function ModeracaoRota() {
  const { id } = useParams();
  const fila = useFilaDenunciasViewModel(id);
  const semSelecao = useSemSelecaoViewModel();
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <FilaDenunciasView id={ID_FILA} {...fila} />
      {id ? (
        <AnaliseRota key={id} id={id} />
      ) : (
        <SemSelecaoView ultimaDecidida={semSelecao.ultimaDecidida} filaVazia={fila.vazia} />
      )}
    </div>
  );
}

/** Uma denúncia aberta; `key={id}` recomeça o estado ao trocar de denúncia. */
function AnaliseRota({ id }: { id: string }) {
  const analise = useAnaliseDenunciaViewModel(id);
  return <AnaliseDenunciaView {...analise} formularioDecisao={null} />;
}
