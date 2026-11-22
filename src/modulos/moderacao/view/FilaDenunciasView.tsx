import { Link } from "react-router";

import { Carregando } from "../../../comum/componentes/ui/Carregando";
import { Cartao } from "../../../comum/componentes/ui/Cartao";
import { EstadoVazio } from "../../../comum/componentes/ui/EstadoVazio";
import { MensagemErro } from "../../../comum/componentes/ui/MensagemErro";
import type { FilaDenunciasViewModel, ItemFilaView } from "../viewmodel/useFilaDenunciasViewModel";
import { SeloSeveridade } from "./componentes/SeloSeveridade";

type FilaDenunciasViewProps = Omit<FilaDenunciasViewModel, "hrefFila"> & {
  /** Id da seção, alvo do atalho do dashboard. */
  id: string;
};

export function FilaDenunciasView({
  id,
  carregando,
  erro,
  tentarDeNovo,
  total,
  itens,
  vazia,
  paginacao,
}: FilaDenunciasViewProps) {
  return (
    <Cartao id={id} aria-labelledby={`${id}-titulo`} className="flex scroll-mt-6 flex-col p-5">
      <header className="mb-5 flex items-center justify-between">
        <h2 id={`${id}-titulo`} className="text-lg font-semibold">
          Denúncias abertas
        </h2>
        {total !== null && <span className="text-base font-semibold text-texto-suave">{total}</span>}
      </header>

      {erro ? (
        <MensagemErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />
      ) : carregando ? (
        <Carregando texto="Carregando a fila..." />
      ) : vazia ? (
        <EstadoVazio titulo="Nenhuma denúncia aberta" texto="Todas as denúncias foram analisadas." />
      ) : (
        <ol className="flex flex-col gap-3">
          {itens.map((item) => (
            <li key={item.id}>
              <ItemFila item={item} />
            </li>
          ))}
        </ol>
      )}

      {paginacao && !erro && (
        <nav aria-label="Páginas da fila" className="mt-5 flex items-center justify-between text-sm">
          <LinkPagina href={paginacao.hrefAnterior} rotulo="Anterior" />
          <span className="text-texto-suave">
            Página {paginacao.atual} de {paginacao.total}
          </span>
          <LinkPagina href={paginacao.hrefProxima} rotulo="Próxima" />
        </nav>
      )}
    </Cartao>
  );
}

function ItemFila({ item }: { item: ItemFilaView }) {
  return (
    <Link
      to={item.href}
      aria-current={item.selecionado ? "true" : undefined}
      className={`block rounded-xl border px-4 py-4 transition-colors ${
        item.selecionado ? "border-primaria bg-primaria-suave" : "border-borda hover:border-primaria/40"
      }`}
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-2">
          <span className={`font-semibold ${item.selecionado ? "text-primaria" : "text-texto"}`}>{item.numero}</span>
          <SeloSeveridade severidade={item.severidade} rotulo={item.severidadeRotulo} />
        </span>
        <span className="text-texto-suave">{item.criadaEm}</span>
      </div>
      <p className="mt-3 text-sm font-semibold">{item.motivo}</p>
      <p className="mt-3 flex justify-between gap-2 text-sm text-texto-suave">
        <span>Denunciado: {item.denunciado}</span>
        <span className="text-xs">Prazo {item.prazo}</span>
      </p>
    </Link>
  );
}

function LinkPagina({ href, rotulo }: { href: string | null; rotulo: string }) {
  if (!href) {
    return <span className="text-texto-suave/50">{rotulo}</span>;
  }
  return (
    <Link to={href} className="font-semibold text-primaria">
      {rotulo}
    </Link>
  );
}
