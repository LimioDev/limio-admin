import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { RotaProtegida, ROTA_ENTRADA } from "./comum/componentes/layout/RotaProtegida";
import { queryClient } from "./comum/lib/query";
import { EntradaRota } from "./rotas/EntradaRota";
import { ModeracaoRota } from "./rotas/ModeracaoRota";
import { PainelRota } from "./rotas/PainelRota";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={ROTA_ENTRADA} element={<EntradaRota />} />
          <Route element={<RotaProtegida />}>
            <Route element={<PainelRota />}>
              <Route index element={<ModeracaoRota />} />
              <Route path="denuncias/:id" element={<ModeracaoRota />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
