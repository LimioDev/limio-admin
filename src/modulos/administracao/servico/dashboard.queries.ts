import { useQuery } from "@tanstack/react-query";

import { chavesQuery } from "../../../comum/lib/query";
import { consultarDashboard } from "./dashboard.api";

export function useDashboardQuery() {
  return useQuery({
    queryKey: chavesQuery.dashboard,
    queryFn: consultarDashboard,
  });
}
