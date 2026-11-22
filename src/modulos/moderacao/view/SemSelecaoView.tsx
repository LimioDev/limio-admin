import { Cartao } from "../../../comum/componentes/ui/Cartao";
import { EstadoVazio } from "../../../comum/componentes/ui/EstadoVazio";

interface SemSelecaoViewProps {
  /** Número da denúncia que acabou de ser decidida, para o aviso no topo. */
  ultimaDecidida: number | null;
  filaVazia: boolean;
}

/** Painel da direita sem denúncia aberta (tela "Fila vazia" da ETI-137). */
export function SemSelecaoView({ ultimaDecidida, filaVazia }: SemSelecaoViewProps) {
  return (
    <Cartao className="flex min-h-[32rem] flex-col p-5">
      <h2 className="text-lg font-semibold">Análise da denúncia</h2>
      {ultimaDecidida !== null && (
        <div role="status" className="mt-4 border-b border-borda pb-5">
          <p className="text-sm font-semibold">Denúncia nº {ultimaDecidida} decidida.</p>
          <p className="mt-2 text-sm text-texto-suave">
            A fila foi atualizada.{filaVazia && " Não há denúncias pendentes de análise."}
          </p>
        </div>
      )}
      <EstadoVazio
        titulo="Nenhuma denúncia selecionada"
        texto={
          filaVazia
            ? "Quando houver uma nova denúncia, ela aparecerá na fila ao lado."
            : "Escolha uma denúncia na fila ao lado para analisar."
        }
      />
    </Cartao>
  );
}
