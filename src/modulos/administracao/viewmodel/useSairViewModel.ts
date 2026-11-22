import { encerrarSessaoAdmin, MotivoFimSessao } from "../../../comum/sessao/sessaoAdmin";

/** Botão "Sair" do cabeçalho. A rota protegida leva para a entrada assim que a sessão acaba. */
export function useSairViewModel() {
  return {
    sair: () => encerrarSessaoAdmin(MotivoFimSessao.SAIU),
  };
}
