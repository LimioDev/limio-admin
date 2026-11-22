import { api } from "../../../comum/lib/api";
import { AnaliseDenunciaSchema, type AnaliseDenuncia } from "../tipos/analise.types";
import { FilaDenunciasSchema, type FilaDenuncias, type FiltroFila } from "../tipos/fila.types";

/** "Listar fila de denúncias" (ETI-116): só as `ABERTA`, do prazo mais curto para o mais longo. */
export async function listarFilaDeDenuncias(filtro: FiltroFila): Promise<FilaDenuncias> {
  const { data } = await api.get("/admin/denuncias", {
    params: { pagina: filtro.pagina, tamanho: filtro.tamanho },
  });
  return FilaDenunciasSchema.parse(data);
}

/** "Analisar denúncia" (ETI-116). Também serve para a já decidida: aí `decisao` vem preenchida. */
export async function analisarDenuncia(id: string): Promise<AnaliseDenuncia> {
  const { data } = await api.get(`/admin/denuncias/${encodeURIComponent(id)}`);
  return AnaliseDenunciaSchema.parse(data);
}
