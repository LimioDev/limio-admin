import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";

import { deCampoDataHora, paraCampoDataHora } from "../../../comum/lib/datas";
import { mensagemErroApi } from "../../../comum/lib/erros";
import type { OpcaoSegmentada } from "../../../comum/componentes/ui/Segmentado";
import { useDecidirDenunciaMutation } from "../servico/denuncia.queries";
import { VereditoModeracao } from "../tipos/denuncia.enums";
import {
  DecisaoFormSchema,
  FUNDAMENTO_MAX,
  SancaoPainel,
  type DecidirDenunciaRequest,
  type DecisaoForm,
} from "../tipos/decisao.types";
import type { EstadoVoltaDaDecisao } from "./useSemSelecaoViewModel";

/** Do formulário validado para o corpo da API: sanção e período só quando se aplicam. */
function paraPedido(form: DecisaoForm): DecidirDenunciaRequest {
  const pedido: DecidirDenunciaRequest = { veredito: form.veredito, fundamento: form.fundamento.trim() };
  if (form.sancao === SancaoPainel.NENHUMA) {
    return pedido;
  }
  pedido.sancao = form.sancao;
  if (form.sancao === SancaoPainel.SUSPENSAO) {
    pedido.inicioEm = deCampoDataHora(form.inicioEm) ?? undefined;
    pedido.fimEm = deCampoDataHora(form.fimEm) ?? undefined;
  }
  return pedido;
}

interface DecisaoDenunciaParams {
  id: string;
  numero: number;
  /** Para onde voltar depois de decidir (a fila, na mesma página). */
  hrefFila: string;
}

/** Formulário de decisão (ETI-116): veredito, fundamento obrigatório e sanção. */
export function useDecisaoDenunciaViewModel({ id, numero, hrefFila }: DecisaoDenunciaParams) {
  const navegar = useNavigate();
  const mutacao = useDecidirDenunciaMutation(id);

  const form = useForm<DecisaoForm>({
    resolver: zodResolver(DecisaoFormSchema),
    mode: "onTouched",
    defaultValues: {
      veredito: VereditoModeracao.PROCEDENTE,
      sancao: SancaoPainel.NENHUMA,
      fundamento: "",
      inicioEm: "",
      fimEm: "",
    },
  });

  const valores = useWatch({ control: form.control }) as DecisaoForm;
  const improcedente = valores.veredito === VereditoModeracao.IMPROCEDENTE;
  const suspensao = valores.sancao === SancaoPainel.SUSPENSAO;

  // O que falta para decidir, mostrado ao lado do botão desabilitado (tela da ETI-137).
  const conferencia = DecisaoFormSchema.safeParse(valores);
  const pendencia = conferencia.success ? null : (conferencia.error.issues[0]?.message ?? null);

  const opcoesVeredito: OpcaoSegmentada<VereditoModeracao>[] = [
    { valor: VereditoModeracao.PROCEDENTE, rotulo: "Procedente" },
    { valor: VereditoModeracao.IMPROCEDENTE, rotulo: "Improcedente" },
  ];
  const opcoesSancao: OpcaoSegmentada<SancaoPainel>[] = [
    { valor: SancaoPainel.NENHUMA, rotulo: "Nenhuma" },
    { valor: SancaoPainel.ADVERTENCIA, rotulo: "Advertência", desabilitada: improcedente },
    { valor: SancaoPainel.SUSPENSAO, rotulo: "Suspensão", desabilitada: improcedente },
  ];

  const mudarVeredito = (veredito: VereditoModeracao) => {
    form.setValue("veredito", veredito);
    if (veredito === VereditoModeracao.IMPROCEDENTE) {
      form.setValue("sancao", SancaoPainel.NENHUMA);
    }
  };

  const mudarSancao = (sancao: SancaoPainel) => {
    form.setValue("sancao", sancao);
    // A suspensão começa na decisão (o back bloqueia a conta na hora): sugere "agora".
    if (sancao === SancaoPainel.SUSPENSAO && !form.getValues("inicioEm")) {
      form.setValue("inicioEm", paraCampoDataHora(new Date()));
    }
  };

  const decidir = form.handleSubmit((dados) => {
    mutacao.mutate(paraPedido(dados), {
      onSuccess: (decidida) => {
        const estado: EstadoVoltaDaDecisao = { ultimaDecidida: decidida.numero };
        navegar(hrefFila, { state: estado });
      },
    });
  });

  const erros = form.formState.errors;

  return {
    numero,
    veredito: valores.veredito,
    opcoesVeredito,
    mudarVeredito,
    sancao: valores.sancao,
    opcoesSancao,
    mudarSancao,
    registrarFundamento: form.register("fundamento"),
    erroFundamento: erros.fundamento?.message,
    tamanhoFundamento: valores.fundamento.length,
    fundamentoMax: FUNDAMENTO_MAX,
    suspensao,
    registrarInicio: form.register("inicioEm", { deps: ["fimEm"] }),
    erroInicio: erros.inicioEm?.message,
    registrarFim: form.register("fimEm"),
    erroFim: erros.fimEm?.message,
    pendencia,
    enviando: mutacao.isPending,
    erroEnvio: mutacao.isError ? mensagemErroApi(mutacao.error, "Não foi possível registrar a decisão.") : null,
    decidir,
  };
}

export type DecisaoDenunciaViewModel = ReturnType<typeof useDecisaoDenunciaViewModel>;
