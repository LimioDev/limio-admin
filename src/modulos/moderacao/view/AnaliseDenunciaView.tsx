import type { ReactNode } from "react";

import { Carregando } from "../../../comum/componentes/ui/Carregando";
import { Cartao } from "../../../comum/componentes/ui/Cartao";
import { MensagemErro } from "../../../comum/componentes/ui/MensagemErro";
import type { AnaliseDenunciaViewModel, AnaliseView } from "../viewmodel/useAnaliseDenunciaViewModel";

type AnaliseDenunciaViewProps = AnaliseDenunciaViewModel & {
  /** Formulário de decisão, mostrado só com a denúncia aberta. */
  formularioDecisao: ReactNode;
};

export function AnaliseDenunciaView({
  carregando,
  erro,
  tentarDeNovo,
  analise,
  formularioDecisao,
}: AnaliseDenunciaViewProps) {
  return (
    <Cartao className="p-5" aria-live="polite">
      {erro ? (
        <>
          <h2 className="mb-4 text-lg font-semibold">Análise da denúncia</h2>
          <MensagemErro mensagem={erro} aoTentarDeNovo={tentarDeNovo} />
        </>
      ) : carregando || !analise ? (
        <Carregando texto="Carregando a denúncia..." />
      ) : (
        <ConteudoAnalise analise={analise} formularioDecisao={formularioDecisao} />
      )}
    </Cartao>
  );
}

function ConteudoAnalise({ analise, formularioDecisao }: { analise: AnaliseView; formularioDecisao: ReactNode }) {
  return (
    <article aria-labelledby="titulo-analise">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 id="titulo-analise" className="text-lg font-semibold">
            Denúncia nº {analise.numero}
          </h2>
          <p className="mt-1 text-xs text-texto-suave">
            Registrada em {analise.criadaEm} · prazo de análise {analise.prazoAnalise}
          </p>
        </div>
        <span className={`text-sm font-semibold ${analise.aberta ? "text-primaria" : "text-texto-suave"}`}>
          {analise.status}
        </span>
      </header>

      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Dado rotulo="Denunciante" valor={analise.denunciante} />
        <Dado rotulo="Denunciado" valor={analise.denunciado} />
        <Dado rotulo="Alvo" valor={analise.alvo} />
      </dl>

      <p className="mt-4 flex gap-10 text-sm">
        <span className="text-xs text-texto-suave">Motivo</span>
        <span className="font-semibold">{analise.motivo}</span>
      </p>

      <section className="mt-5" aria-labelledby="titulo-ocorrido">
        <h3 id="titulo-ocorrido" className="text-xs font-semibold">
          O que aconteceu
        </h3>
        <p className="mt-2 text-sm whitespace-pre-line">{analise.descricao}</p>
        {analise.evidenciaUrl ? (
          <a href={analise.evidenciaUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block">
            <img
              src={analise.evidenciaUrl}
              alt="Foto de comprovação enviada pelo denunciante"
              className="h-32 rounded-lg border border-borda object-cover"
            />
          </a>
        ) : (
          <p className="mt-3 text-xs text-texto-suave">Nenhuma foto de comprovação anexada.</p>
        )}
      </section>

      <dl className="mt-5 divide-y divide-transparent border-t border-borda pt-5 text-sm">
        <Linha rotulo="Histórico do denunciado">
          <p>{analise.historicoResumo}</p>
          {analise.historico.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1 text-xs">
              {analise.historico.map((item) => (
                <li key={item.id}>{item.texto}</li>
              ))}
            </ul>
          )}
        </Linha>
        <Linha rotulo="Chat">
          {analise.chat.length === 0 ? (
            <p>Nenhuma mensagem trocada neste alvo.</p>
          ) : (
            <ol className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-2">
              {analise.chat.map((mensagem) => (
                <li key={mensagem.id}>
                  <span className="font-semibold text-texto">{mensagem.autor}:</span> “{mensagem.texto}”{" "}
                  <span className="text-xs">({mensagem.enviadaEm})</span>
                </li>
              ))}
            </ol>
          )}
        </Linha>
        <Linha rotulo="Fotos">
          {analise.fotosUrls.length === 0 ? (
            <p>Nenhuma foto disponível para este alvo.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {analise.fotosUrls.map((url, indice) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noreferrer">
                    <img
                      src={url}
                      alt={`Foto ${indice + 1} do check-out do serviço`}
                      className="h-20 w-20 rounded-lg border border-borda object-cover"
                    />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Linha>
        <Linha rotulo="Dados do alvo">
          <p>{analise.dadosAlvo}</p>
        </Linha>
      </dl>

      <section className="mt-6 border-t border-borda pt-6" aria-labelledby="titulo-decisao">
        <h3 id="titulo-decisao" className="text-lg font-semibold">
          Decisão
        </h3>
        {analise.decisao ? (
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <p>
              <span className="font-semibold">{analise.decisao.veredito}</span> em {analise.decisao.decididaEm}
            </p>
            {analise.decisao.sancoes.length > 0 && <p>Sanção: {analise.decisao.sancoes.join(", ")}</p>}
            <p className="whitespace-pre-line text-texto-suave">{analise.decisao.fundamento}</p>
          </div>
        ) : (
          <div className="mt-4">{formularioDecisao}</div>
        )}
      </section>
    </article>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-xs text-texto-suave">{rotulo}</dt>
      <dd className="mt-1 text-sm font-semibold">{valor}</dd>
    </div>
  );
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-semibold">{rotulo}</dt>
      <dd className="text-texto-suave">{children}</dd>
    </div>
  );
}
