export function Carregando({ texto = "Carregando..." }: { texto?: string }) {
  return (
    <p role="status" className="px-6 py-10 text-center text-sm text-texto-suave">
      {texto}
    </p>
  );
}
