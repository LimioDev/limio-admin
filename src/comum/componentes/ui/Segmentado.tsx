export interface OpcaoSegmentada<T extends string> {
  valor: T;
  rotulo: string;
  desabilitada?: boolean;
}

interface SegmentadoProps<T extends string> {
  rotulo: string;
  opcoes: readonly OpcaoSegmentada<T>[];
  valor: T;
  aoMudar: (valor: T) => void;
}

/** Grupo de botões exclusivos (veredito e sanção na decisão). */
export function Segmentado<T extends string>({ rotulo, opcoes, valor, aoMudar }: SegmentadoProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold text-texto">{rotulo}</legend>
      <div className="flex rounded-xl border border-borda bg-superficie">
        {opcoes.map((opcao) => {
          const selecionada = opcao.valor === valor;
          return (
            <button
              key={opcao.valor}
              type="button"
              aria-pressed={selecionada}
              disabled={opcao.desabilitada}
              onClick={() => aoMudar(opcao.valor)}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                selecionada
                  ? "border border-primaria bg-primaria-suave font-semibold text-primaria"
                  : "border border-transparent text-texto-suave hover:text-texto"
              }`}
            >
              {opcao.rotulo}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
