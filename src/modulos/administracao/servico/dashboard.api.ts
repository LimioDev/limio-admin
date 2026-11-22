import { api } from "../../../comum/lib/api";
import { DashboardSchema, type Dashboard } from "../tipos/dashboard.types";

/** "Consultar dashboard" (ETI-117). Só administrador. */
export async function consultarDashboard(): Promise<Dashboard> {
  const { data } = await api.get("/admin/dashboard");
  return DashboardSchema.parse(data);
}
