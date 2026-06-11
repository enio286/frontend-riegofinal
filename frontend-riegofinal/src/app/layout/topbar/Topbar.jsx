import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle2,
  Activity,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../core/context/AuthContext"

function Topbar({ sidebarCollapsed, onToggleSidebar, onToggleCollapsed }) {
  const { user, logout, isAdmin, hasRole } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const roleLabel = isAdmin
    ? "Administrador"
    : hasRole("OPERADOR")
    ? "Operador"
    : hasRole("VISOR")
    ? "Visor"
    : "Usuario"

  return (
    <header className="sticky top-0 z-20 border-b border-[#1c2a22] bg-[#0b120f]/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-2xl border border-[#223328] bg-[#101914] p-2 text-[#d7eadb] transition hover:border-[#7CFF6B] hover:text-[#7CFF6B] lg:hidden"
          >
            <Menu size={18} />
          </button>

          <button
            onClick={onToggleCollapsed}
            className="hidden rounded-2xl border border-[#223328] bg-[#101914] p-2 text-[#d7eadb] transition hover:border-[#7CFF6B] hover:text-[#7CFF6B] lg:inline-flex"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223328] bg-[#101914] px-3 py-1 text-xs font-medium text-[#7CFF6B] shadow-[0_0_16px_rgba(124,255,107,0.08)]">
              <Activity size={13} />
              Sistema activo
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#ecfff1]">
              Panel de control
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-2xl border border-[#1c2a22] bg-[#0f1713] px-4 py-2 md:flex">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101914] text-[#7CFF6B] shadow-[0_0_16px_rgba(124,255,107,0.08)]">
              <UserCircle2 size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#ecfff1]">
                {user?.username || "Usuario"}
              </p>
              <p className="text-xs text-[#9fb7a7]">{roleLabel}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#2f1d1d] bg-[#1a1010] px-4 py-2.5 text-sm font-semibold text-[#ffd6d6] transition hover:border-red-500/40 hover:bg-[#221414] hover:text-white"
          >
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar