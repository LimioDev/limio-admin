import { useSyncExternalStore } from "react";

/**
 * Sessão do administrador no painel. Único arquivo que lê e grava o token: o resto do
 * painel usa `lerTokenAdmin`, `iniciarSessaoAdmin`, `encerrarSessaoAdmin` e `useSessaoAdmin`.
 *
 * TODO(US60): o limio-api ainda não tem login de administrador. Por enquanto o token é
 * colado na entrada e fica no `sessionStorage` (some ao fechar a aba). Quando a US60 sair,
 * trocar `iniciarSessaoAdmin` pela chamada de login (e, se houver, a renovação do token)
 * sem mexer nas telas.
 */

const CHAVE_TOKEN = "limio.admin.token";

/** Valor da claim `tipo` no token do administrador (`JwtAuthFilter.TIPO_ADMINISTRADOR` no back). */
const TIPO_ADMINISTRADOR = "ADMINISTRADOR";

type Ouvinte = () => void;
const ouvintes = new Set<Ouvinte>();

function avisarOuvintes(): void {
  for (const ouvinte of ouvintes) {
    ouvinte();
  }
}

export function lerTokenAdmin(): string | null {
  return sessionStorage.getItem(CHAVE_TOKEN);
}

/** Por que o token colado não serve; `null` quando serve. */
export type MotivoTokenRecusado = "FORMATO" | "NAO_ADMINISTRADOR" | "EXPIRADO";

/**
 * Confere o que dá para conferir sem a chave do back: formato JWT, claim `tipo` e `exp`.
 * A assinatura só a API confere (token forjado leva 401 na primeira chamada).
 */
export function conferirTokenAdmin(token: string): MotivoTokenRecusado | null {
  const partes = token.split(".");
  if (partes.length !== 3) {
    return "FORMATO";
  }
  let claims: { tipo?: unknown; exp?: unknown };
  try {
    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    claims = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
  } catch {
    return "FORMATO";
  }
  if (claims.tipo !== TIPO_ADMINISTRADOR) {
    return "NAO_ADMINISTRADOR";
  }
  if (typeof claims.exp === "number" && claims.exp * 1000 <= Date.now()) {
    return "EXPIRADO";
  }
  return null;
}

/** Grava o token já conferido por `conferirTokenAdmin`. */
export function iniciarSessaoAdmin(token: string): void {
  sessionStorage.setItem(CHAVE_TOKEN, token);
  avisarOuvintes();
}

/** Sair, 401 ou `ACESSO_NEGADO`: apaga o token e a casca do painel volta para a entrada. */
export function encerrarSessaoAdmin(): void {
  if (sessionStorage.getItem(CHAVE_TOKEN) === null) {
    return;
  }
  sessionStorage.removeItem(CHAVE_TOKEN);
  avisarOuvintes();
}

function assinar(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

/** `true` enquanto há token guardado; re-renderiza ao entrar ou sair. */
export function useSessaoAdmin(): boolean {
  return useSyncExternalStore(assinar, () => lerTokenAdmin() !== null);
}
