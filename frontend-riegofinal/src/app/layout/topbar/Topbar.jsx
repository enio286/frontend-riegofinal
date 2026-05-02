import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, UserCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../core/context/AuthContext"

function Topbar({ sidebarCollapsed, onToggleSidebar, onToggleCollapsed }) {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          >
            <Menu size={18} />
          </button>

          <button
            onClick={onToggleCollapsed}
            className="hidden rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800 lg:inline-flex"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          <div>
            <p className="text-sm text-slate-400">Bienvenido</p>
            <h1 className="text-2xl font-bold text-white">Panel de control</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 md:flex">
            <UserCircle2 className="text-teal-400" size={22} />
            <div>
              <p className="text-sm font-semibold text-white">
                {user?.username || "Usuario"}
              </p>
              <p className="text-xs text-slate-400">
                {isAdmin ? "Administrador" : "Usuario"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
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