import type { Severidade } from "../../tipos/denuncia.enums";

const classes: Record<Severidade, string> = {
  ALTA: "bg-perigo-suave text-perigo",
  MEDIA: "bg-amber-50 text-amber-800",
  BAIXA: "bg-neutro-suave text-texto-suave",
};

export function SeloSeveridade({ severidade, rotulo }: { severidade: Severidade; rotulo: string }) {
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${classes[severidade]}`}>
      {rotulo}
    </span>
  );
}
