interface MensagemErroProps {
  mensagem: string;
  aoTentarDeNovo?: () => void;
}

export function MensagemErro({ mensagem, aoTentarDeNovo }: MensagemErroProps) {
  return (
    <div role="alert" className="rounded-lg bg-perigo-suave px-3 py-2.5 text-sm text-perigo">
      {mensagem}
      {aoTentarDeNovo && (
        <button type="button" onClick={aoTentarDeNovo} className="ml-2 font-semibold underline">
          Tentar de novo
        </button>
      )}
    </div>
  );
}
