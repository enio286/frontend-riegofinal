import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Cpu,
  Waves,
  Droplets,
  Settings2,
  Bell,
  Users,
  Shield,
  Leaf,
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
          { to: "/app/dispositivos", label: "ESP32", icon: Cpu },
          { to: "/app/sensores", label: "Sensores", icon: Waves },
          { to: "/app/bombas", label: "Bomba", icon: Droplets },
          {
            to: "/app/configuraciones",
            label: "Control automático",
            icon: Settings2,
          },
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

  const widthClass = sidebarCollapsed ? "lg:w-24" : "lg:w-80"

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-[#1c2a22] bg-[#0b120f] px-4 py-5 transition-all duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 ${widthClass}`}
      >
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-start justify-between">
            <div className={`${sidebarCollapsed ? "lg:hidden" : "block"}`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#223328] bg-[#101914] px-3 py-1.5 shadow-[0_0_18px_rgba(124,255,107,0.08)]">
                <Leaf size={14} className="text-[#7CFF6B]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7CFF6B]">
                  Smart Irrigation
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#ecfff1]">
                Sistema de riego
              </h2>

              <p className="mt-2 max-w-xs text-sm leading-6 text-[#9fb7a7]">
                Monitoreo IoT, control inteligente y supervisión ambiental en tiempo real.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-2xl p-2 text-[#9fb7a7] transition hover:bg-[#132019] hover:text-[#7CFF6B] lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-5 rounded-3xl border border-[#1c2a22] bg-[#0f1713] p-3 shadow-[0_0_30px_rgba(0,0,0,0.18)]">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[#7CFF6B] text-[#08110b] shadow-[0_0_20px_rgba(124,255,107,0.22)]"
                          : "text-[#d7eadb] hover:bg-[#132019] hover:text-[#7CFF6B]"
                      } ${sidebarCollapsed ? "lg:justify-center" : ""}`
                    }
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${
                        sidebarCollapsed ? "" : "bg-white/5"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <span className={`${sidebarCollapsed ? "lg:hidden" : "block"}`}>
                      {item.label}
                    </span>
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {adminItems.length > 0 && (
            <div className="rounded-3xl border border-[#1c2a22] bg-[#0f1713] p-3 shadow-[0_0_30px_rgba(0,0,0,0.18)]">
              <p
                className={`mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7CFF6B] ${
                  sidebarCollapsed ? "lg:hidden" : "block"
                }`}
              >
                Administración
              </p>

              <div className="space-y-1.5">
                {adminItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-[#7CFF6B] text-[#08110b] shadow-[0_0_20px_rgba(124,255,107,0.22)]"
                            : "text-[#d7eadb] hover:bg-[#132019] hover:text-[#7CFF6B]"
                        } ${sidebarCollapsed ? "lg:justify-center" : ""}`
                      }
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${
                          sidebarCollapsed ? "" : "bg-white/5"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span className={`${sidebarCollapsed ? "lg:hidden" : "block"}`}>
                        {item.label}
                      </span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-auto pt-5">
            <div className="rounded-3xl border border-[#223328] bg-gradient-to-br from-[#101914] to-[#0d1511] p-4 shadow-[0_0_24px_rgba(124,255,107,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7CFF6B]">
                Estado del sistema
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[#ecfff1]">
                Interfaz eco-tech
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#9fb7a7]">
                Diseño ambiental con acentos neón y enfoque en monitoreo inteligente.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar