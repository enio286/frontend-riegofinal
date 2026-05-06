import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  MapPinned,
  Map,
  Cpu,
  Waves,
  Droplets,
  Settings2,
  Bell,
  Users,
  Shield,
  X,
} from "lucide-react"
import { useAuth } from "../../core/context/AuthContext"

function Sidebar({ sidebarOpen, sidebarCollapsed, onClose }) {
  const { isAdmin, hasRole } = useAuth()

  const canSeeOperational = isAdmin || hasRole("OPERADOR") || hasRole("VISOR")

  const navItems = [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard },
    ...(canSeeOperational
      ? [
          { to: "/app/predios", label: "Predios", icon: MapPinned },
          { to: "/app/zonas", label: "Zonas", icon: Map },
          { to: "/app/dispositivos", label: "Dispositivos", icon: Cpu },
          { to: "/app/sensores", label: "Sensores", icon: Waves },
          { to: "/app/bombas", label: "Bombas", icon: Droplets },
          { to: "/app/configuraciones", label: "Configuraciones", icon: Settings2 },
          { to: "/app/alertas", label: "Alertas", icon: Bell },
        ]
      : []),
  ]

  const adminItems = isAdmin
    ? [
        { to: "/app/usuarios", label: "Usuarios", icon: Users },
        { to: "/app/roles", label: "Roles", icon: Shield },
      ]
    : []

  const widthClass = sidebarCollapsed ? "lg:w-24" : "lg:w-72"

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-slate-900/95 px-4 py-6 backdrop-blur transition-all duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 ${widthClass}`}
      >
        <div className="mb-8 flex items-start justify-between">
          <div className={`${sidebarCollapsed ? "lg:hidden" : "block"}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Plataforma
            </p>
            <h2 className="mt-2 text-2xl font-bold text-teal-400">
              Sistema de riego
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Panel de administración y monitoreo.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  } ${sidebarCollapsed ? "lg:justify-center" : ""}`
                }
              >
                <Icon size={18} />
                <span className={`${sidebarCollapsed ? "lg:hidden" : "block"}`}>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </nav>

        {adminItems.length > 0 && (
          <div className="mt-8">
            <p
              className={`mb-3 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 ${
                sidebarCollapsed ? "lg:hidden" : "block"
              }`}
            >
              Administración
            </p>

            <div className="space-y-2">
              {adminItems.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      } ${sidebarCollapsed ? "lg:justify-center" : ""}`
                    }
                  >
                    <Icon size={18} />
                    <span className={`${sidebarCollapsed ? "lg:hidden" : "block"}`}>
                      {item.label}
                    </span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar