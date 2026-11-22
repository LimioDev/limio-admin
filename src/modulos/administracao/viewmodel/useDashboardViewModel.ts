import { mensagemErroApi } from "../../../comum/lib/erros";
import { formatarInteiro } from "../../../comum/lib/numeros";
import { useDashboardQuery } from "../servico/dashboard.queries";
import { StatusOperacional } from "../tipos/dashboard.enums";

export interface ContadorDashboard {
  chave: string;
  rotulo: string;
  valor: string;
  /** O cartão de denúncias abertas é o atalho para a fila. */
  atalhoFila: boolean;
}

export function useDashboardViewModel() {
  const consulta = useDashboardQuery();
  const dados = consulta.data;

  const contadores: ContadorDashboard[] = dados
    ? [
        { chave: "usuarios", rotulo: "Usuários", valor: formatarInteiro(dados.usuarios), atalhoFila: false },
        { chave: "anuncios", rotulo: "Anúncios", valor: formatarInteiro(dados.anuncios), atalhoFila: false },
        {
          chave: "candidaturas",
          rotulo: "Candidaturas",
          valor: formatarInteiro(dados.candidaturas),
          atalhoFila: false,
        },
        { chave: "escolhas", rotulo: "Escolhas", valor: formatarInteiro(dados.escolhas), atalhoFila: false },
        {
          chave: "assinaturasGoldAtivas",
          rotulo: "Assinaturas GOLD ativas",
          valor: formatarInteiro(dados.assinaturasGoldAtivas),
          atalhoFila: false,
        },
        {
          chave: "denunciasAbertas",
          rotulo: "Denúncias abertas",
          valor: formatarInteiro(dados.denunciasAbertas),
          atalhoFila: true,
        },
      ]
    : [];

  return {
    carregando: consulta.isPending,
    erro: consulta.isError ? mensagemErroApi(consulta.error, "Não foi possível carregar os números.") : null,
    contadores,
    statusDescricao: dados?.statusOperacionalDescricao ?? null,
    statusNormal: dados?.statusOperacional === StatusOperacional.OPERANDO_NORMALMENTE,
    tentarDeNovo: () => void consulta.refetch(),
  };
}

export type DashboardViewModel = ReturnType<typeof useDashboardViewModel>;
