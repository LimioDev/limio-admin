import { api } from "../../../comum/lib/api";
import { FilaDenunciasSchema, type FilaDenuncias, type FiltroFila } from "../tipos/fila.types";

/** "Listar fila de denúncias" (ETI-116): só as `ABERTA`, do prazo mais curto para o mais longo. */
export async function listarFilaDeDenuncias(filtro: FiltroFila): Promise<FilaDenuncias> {
  const { data } = await api.get("/admin/denuncias", {
    params: { pagina: filtro.pagina, tamanho: filtro.tamanho },
  });
  return FilaDenunciasSchema.parse(data);
}
