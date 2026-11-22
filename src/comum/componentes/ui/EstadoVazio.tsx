interface EstadoVazioProps {
  titulo: string;
  texto: string;
}

/** Mensagem centralizada para lista vazia ou nada selecionado. */
export function EstadoVazio({ titulo, texto }: EstadoVazioProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-texto">{titulo}</p>
      <p className="text-sm text-texto-suave">{texto}</p>
    </div>
  );
}
