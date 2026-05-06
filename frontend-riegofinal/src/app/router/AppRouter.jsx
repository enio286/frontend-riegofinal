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

          <Route
            path="predios"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "OPERADOR", "VISOR"]}>
                <PrediosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="zonas"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "OPERADOR", "VISOR"]}>
                <ZonasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="dispositivos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "OPERADOR", "VISOR"]}>
                <DispositivosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="sensores"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "OPERADOR", "VISOR"]}>
                <SensoresPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="bombas"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "OPERADOR", "VISOR"]}>
                <BombasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="configuraciones"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "OPERADOR", "VISOR"]}>
                <ConfiguracionesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="alertas"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "OPERADOR", "VISOR"]}>
                <AlertasPage />
              </ProtectedRoute>
            }
          />

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
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter