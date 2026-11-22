/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API do LIMIO, sem barra no fim (ver `.env.example`). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
