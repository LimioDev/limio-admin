import { Aviso } from "../../../comum/componentes/ui/Aviso";
import { Botao } from "../../../comum/componentes/ui/Botao";
import { Campo, classesControle } from "../../../comum/componentes/ui/Campo";
import { Cartao } from "../../../comum/componentes/ui/Cartao";
import { MensagemErro } from "../../../comum/componentes/ui/MensagemErro";
import type { EntradaViewModel } from "../viewmodel/useEntradaViewModel";

type EntradaViewProps = Omit<EntradaViewModel, "jaLogado" | "destino">;

export function EntradaView({ registrarToken, erroToken, avisoSessao, entrar }: EntradaViewProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Cartao className="w-full max-w-md p-8">
        <p className="flex items-baseline gap-4">
          <span className="text-3xl font-bold tracking-tight">Limio</span>
          <span className="text-xl font-semibold">· Administração</span>
        </p>
        <h1 className="mt-6 text-lg font-semibold">Entrar no painel</h1>
        <p className="mt-1 text-sm text-texto-suave">Use o token de acesso de administrador.</p>

        <form className="mt-6 flex flex-col gap-5" onSubmit={entrar} noValidate>
          {avisoSessao && <MensagemErro mensagem={avisoSessao} />}
          <Campo id="token" rotulo="Token de acesso" obrigatorio erro={erroToken}>
            <textarea
              id="token"
              rows={4}
              autoComplete="off"
              spellCheck={false}
              placeholder="eyJhbGciOi..."
              aria-invalid={erroToken ? true : undefined}
              aria-describedby={erroToken ? "token-erro" : undefined}
              className={`${classesControle} resize-none font-mono text-xs`}
              {...registrarToken}
            />
          </Campo>
          <Aviso>Provisório: o login de administrador com e-mail e senha ainda não existe na API (US60).</Aviso>
          <Botao type="submit">Entrar</Botao>
        </form>
      </Cartao>
    </div>
  );
}
