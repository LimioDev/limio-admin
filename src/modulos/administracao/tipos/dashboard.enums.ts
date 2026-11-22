/** `StatusOperacional` do back (`administracao/enums`). Só esse valor por enquanto (pendência do tech lead). */
export const StatusOperacional = {
  OPERANDO_NORMALMENTE: "OPERANDO_NORMALMENTE",
} as const;

export type StatusOperacional = (typeof StatusOperacional)[keyof typeof StatusOperacional];
