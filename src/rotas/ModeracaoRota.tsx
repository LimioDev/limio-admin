import { useParams } from "react-router";

import { AnaliseDenunciaView } from "../modulos/moderacao/view/AnaliseDenunciaView";
import { DecisaoDenunciaView } from "../modulos/moderacao/view/DecisaoDenunciaView";
import { FilaDenunciasView } from "../modulos/moderacao/view/FilaDenunciasView";
import { SemSelecaoView } from "../modulos/moderacao/view/SemSelecaoView";
import { useAnaliseDenunciaViewModel } from "../modulos/moderacao/viewmodel/useAnaliseDenunciaViewModel";
import { useDecisaoDenunciaViewModel } from "../modulos/moderacao/viewmodel/useDecisaoDenunciaViewModel";
import { useFilaDenunciasViewModel } from "../modulos/moderacao/viewmodel/useFilaDenunciasViewModel";
import { useSemSelecaoViewModel } from "../modulos/moderacao/viewmodel/useSemSelecaoViewModel";
import { ID_FILA } from "./PainelRota";

/** `/` e `/denuncias/:id`: a fila à esquerda e, à direita, a denúncia aberta (ou nenhuma). */
export function ModeracaoRota() {
  const { id } = useParams();
  const { hrefFila, ...fila } = useFilaDenunciasViewModel(id);
  const semSelecao = useSemSelecaoViewModel();
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <FilaDenunciasView id={ID_FILA} {...fila} />
      {id ? (
        <AnaliseRota key={id} id={id} hrefFila={hrefFila} />
      ) : (
        <SemSelecaoView ultimaDecidida={semSelecao.ultimaDecidida} filaVazia={fila.vazia} />
      )}
    </div>
  );
}

interface AnaliseRotaProps {
  id: string;
  hrefFila: string;
}

/** Uma denúncia aberta; `key={id}` recomeça o formulário ao trocar de denúncia. */
function AnaliseRota({ id, hrefFila }: AnaliseRotaProps) {
  const vm = useAnaliseDenunciaViewModel(id);
  const formulario = vm.analise?.aberta ? (
    <DecisaoRota id={id} numero={vm.analise.numero} hrefFila={hrefFila} />
  ) : null;
  return <AnaliseDenunciaView {...vm} formularioDecisao={formulario} />;
}

function DecisaoRota(props: AnaliseRotaProps & { numero: number }) {
  return <DecisaoDenunciaView {...useDecisaoDenunciaViewModel(props)} />;
}
