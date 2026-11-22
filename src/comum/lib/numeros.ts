const formatoInteiro = new Intl.NumberFormat("pt-BR");

/** "12.486" */
export function formatarInteiro(valor: number): string {
  return formatoInteiro.format(valor);
}
