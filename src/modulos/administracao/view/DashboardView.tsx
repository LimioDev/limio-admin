import { Cartao } from "../../../comum/componentes/ui/Cartao";
import { MensagemErro } from "../../../comum/componentes/ui/MensagemErro";
import type { ContadorDashboard, DashboardViewModel } from "../viewmodel/useDashboardViewModel";

type DashboardViewProps = DashboardViewModel & {
  /** Destino do atalho do cartão "Denúncias abertas" (a fila). */
  hrefFila: string;
};

const QUANTIDADE_CARTOES = 6;

export function DashboardView({
  carregando,
  erro,
  contadores,
  statusDescricao,
  statusNormal,
  tentarDeNovo,
  hrefFila,
}: DashboardViewProps) {
  if (erro) {
    return <MensagemErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />;
  }
  return (
    <section aria-label="Números da operação">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {carregando
          ? Array.from({ length: QUANTIDADE_CARTOES }, (_, indice) => (
              <Cartao key={indice} className="h-24 animate-pulse" aria-hidden />
            ))
          : contadores.map((contador) => (
              <CartaoContador key={contador.chave} contador={contador} hrefFila={hrefFila} />
            ))}
      </div>
      <p className="mt-4 text-sm text-texto-suave">
        Status operacional:{" "}
        {statusDescricao ? (
          <span className={statusNormal ? undefined : "font-semibold text-perigo"}>{statusDescricao}</span>
        ) : (
          "—"
        )}
      </p>
    </section>
  );
}

function CartaoContador({ contador, hrefFila }: { contador: ContadorDashboard; hrefFila: string }) {
  const conteudo = (
    <>
      <p className={`text-xs font-semibold ${contador.atalhoFila ? "text-primaria" : "text-texto"}`}>
        {contador.rotulo}
      </p>
      <p className={`mt-3 text-3xl font-semibold ${contador.atalhoFila ? "text-primaria" : "text-texto"}`}>
        {contador.valor}
      </p>
    </>
  );
  if (contador.atalhoFila) {
    return (
      <a
        href={hrefFila}
        title="Ir para a fila de denúncias"
        className="block rounded-2xl border border-primaria bg-primaria-suave px-4 py-5 transition-colors hover:bg-primaria-suave/70"
      >
        {conteudo}
      </a>
    );
  }
  return <Cartao className="px-4 py-5">{conteudo}</Cartao>;
}
