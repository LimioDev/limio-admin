import { Aviso } from "../../../comum/componentes/ui/Aviso";
import { Botao } from "../../../comum/componentes/ui/Botao";
import { Campo, classesControle } from "../../../comum/componentes/ui/Campo";
import { MensagemErro } from "../../../comum/componentes/ui/MensagemErro";
import { Segmentado } from "../../../comum/componentes/ui/Segmentado";
import type { DecisaoDenunciaViewModel } from "../viewmodel/useDecisaoDenunciaViewModel";

/** Veredito, sanção e fundamento. Nenhuma opção mexe em valores ou marca pagamento. */
export function DecisaoDenunciaView(vm: DecisaoDenunciaViewModel) {
  return (
    <form className="flex flex-col gap-5" onSubmit={vm.decidir} noValidate aria-label={`Decidir a denúncia nº ${vm.numero}`}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Segmentado rotulo="Veredito" opcoes={vm.opcoesVeredito} valor={vm.veredito} aoMudar={vm.mudarVeredito} />
        <Segmentado rotulo="Sanção" opcoes={vm.opcoesSancao} valor={vm.sancao} aoMudar={vm.mudarSancao} />
      </div>

      {vm.suspensao && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo id="inicioEm" rotulo="Início da suspensão" obrigatorio erro={vm.erroInicio}>
            <input
              id="inicioEm"
              type="datetime-local"
              aria-invalid={vm.erroInicio ? true : undefined}
              className={classesControle}
              {...vm.registrarInicio}
            />
          </Campo>
          <Campo id="fimEm" rotulo="Fim da suspensão" obrigatorio erro={vm.erroFim}>
            <input
              id="fimEm"
              type="datetime-local"
              aria-invalid={vm.erroFim ? true : undefined}
              className={classesControle}
              {...vm.registrarFim}
            />
          </Campo>
          <p className="text-xs text-texto-suave sm:col-span-2">
            A conta fica bloqueada assim que você decide, até o fim informado.
          </p>
        </div>
      )}

      <Campo id="fundamento" rotulo="Fundamento" obrigatorio erro={vm.erroFundamento}>
        <textarea
          id="fundamento"
          rows={3}
          maxLength={vm.fundamentoMax}
          placeholder="Descreva o fundamento da decisão."
          aria-invalid={vm.erroFundamento ? true : undefined}
          aria-describedby={vm.erroFundamento ? "fundamento-erro" : undefined}
          className={`${classesControle} resize-y`}
          {...vm.registrarFundamento}
        />
        <p className="mt-1 text-right text-xs text-texto-suave">
          {vm.tamanhoFundamento}/{vm.fundamentoMax}
        </p>
      </Campo>

      <Aviso>O LIMIO não estorna nem transfere valores. A decisão serve para moderar a conta.</Aviso>

      {vm.erroEnvio && <MensagemErro mensagem={vm.erroEnvio} />}

      <div className="flex items-center gap-4">
        <Botao type="submit" disabled={vm.pendencia !== null || vm.enviando}>
          {vm.enviando ? "Decidindo..." : "Decidir denúncia"}
        </Botao>
        {vm.pendencia && <p className="text-xs text-texto-suave">{vm.pendencia}</p>}
      </div>
    </form>
  );
}
