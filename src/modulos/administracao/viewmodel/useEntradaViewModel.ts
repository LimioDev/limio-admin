import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import {
  conferirTokenAdmin,
  consumirMotivoFimSessao,
  iniciarSessaoAdmin,
  MotivoFimSessao,
  useSessaoAdmin,
  type MotivoTokenRecusado,
} from "../../../comum/sessao/sessaoAdmin";
import { EntradaFormSchema, type EntradaForm } from "../tipos/entrada.types";

const mensagemTokenRecusado: Record<MotivoTokenRecusado, string> = {
  FORMATO: "Isso não parece um token de acesso. Cole o token completo.",
  NAO_ADMINISTRADOR: "Este token não é de administrador.",
  EXPIRADO: "Este token já expirou. Gere outro.",
};

/**
 * Entrada do admin. TODO(US60): o back ainda não tem login de administrador; por enquanto
 * a tela recebe o token pronto. Quando o login existir, este viewmodel passa a chamar o
 * serviço de login e a view troca o campo pelo e-mail e a senha.
 */
export function useEntradaViewModel() {
  const navegar = useNavigate();
  const queryClient = useQueryClient();
  const local = useLocation();
  const jaLogado = useSessaoAdmin();
  const [motivoFim] = useState(consumirMotivoFimSessao);

  const form = useForm<EntradaForm>({
    resolver: zodResolver(EntradaFormSchema),
    defaultValues: { token: "" },
  });

  const voltarPara = (local.state as { voltarPara?: string } | null)?.voltarPara ?? "/";

  const entrar = form.handleSubmit(({ token }) => {
    const recusa = conferirTokenAdmin(token);
    if (recusa) {
      form.setError("token", { message: mensagemTokenRecusado[recusa] });
      return;
    }
    // Nada da sessão anterior pode aparecer para a nova.
    queryClient.clear();
    iniciarSessaoAdmin(token);
    navegar(voltarPara, { replace: true });
  });

  return {
    jaLogado,
    destino: voltarPara,
    registrarToken: form.register("token"),
    erroToken: form.formState.errors.token?.message,
    avisoSessao:
      motivoFim === MotivoFimSessao.RECUSADA_PELA_API
        ? "Sua sessão terminou ou o token não tem acesso de administrador. Entre de novo."
        : null,
    entrar,
  };
}

export type EntradaViewModel = ReturnType<typeof useEntradaViewModel>;
