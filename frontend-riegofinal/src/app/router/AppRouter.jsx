import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "../layout/AppLayout"
import LoginPage from "../pages/login/LoginPage"
import HomePage from "../pages/home/HomePage"
import NotFoundPage from "../pages/not-found/NotFoundPage"
import UnauthorizedPage from "../pages/unauthorized/UnauthorizedPage"
import DashboardPage from "../features/dashboard/DashboardPage"
import PrediosPage from "../features/predios/PrediosPage"
import ZonasPage from "../features/zonas/ZonasPage"
import DispositivosPage from "../features/dispositivos/DispositivosPage"
import SensoresPage from "../features/sensores/SensoresPage"
import BombasPage from "../features/bombas/BombasPage"
import ConfiguracionesPage from "../features/configuraciones/ConfiguracionesPage"
import AlertasPage from "../features/alertas/AlertasPage"
import UsuariosPage from "../features/usuarios/UsuariosPage"
import RolesPage from "../features/roles/RolesPage"
import UsuariosRolesPage from "../features/usuarios-roles/UsuariosRolesPage"
import ProtectedRoute from "../core/guards/ProtectedRoute"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="predios" element={<PrediosPage />} />
          <Route path="zonas" element={<ZonasPage />} />
          <Route path="dispositivos" element={<DispositivosPage />} />
          <Route path="sensores" element={<SensoresPage />} />
          <Route path="bombas" element={<BombasPage />} />
          <Route path="configuraciones" element={<ConfiguracionesPage />} />
          <Route path="alertas" element={<AlertasPage />} />

          <Route
            path="usuarios"
            element={
              <ProtectedRoute adminOnly={true}>
                <UsuariosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="roles"
            element={
              <ProtectedRoute adminOnly={true}>
                <RolesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="usuarios-roles"
            element={
              <ProtectedRoute adminOnly={true}>
                <UsuariosRolesPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter