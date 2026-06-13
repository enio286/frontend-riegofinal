import { Link } from "react-router-dom"
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react"

function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f0d] text-[#ecfff1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,107,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(57,211,83,0.08),transparent_24%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl rounded-[32px] border border-[#1c2a22] bg-[#0f1713] p-8 shadow-[0_0_40px_rgba(124,255,107,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#101914] text-[#7CFF6B] shadow-[0_0_18px_rgba(124,255,107,0.08)]">
              <ShieldAlert size={26} />
            </div>

            <div>
              <p className="text-sm text-[#9fb7a7]">Control de acceso</p>
              <h1 className="text-3xl font-bold tracking-tight text-[#ecfff1]">
                Acceso no autorizado
              </h1>
            </div>
          </div>

          <p className="text-base leading-8 text-[#9fb7a7]">
            Tu usuario inició sesión correctamente, pero no tiene permisos para entrar a esta sección del sistema.
          </p>

          <div className="mt-6 rounded-3xl border border-[#1c2a22] bg-[#0b120f] p-5">
            <div className="mb-3 flex items-center gap-2 text-[#7CFF6B]">
              <Lock size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.15em]">
                Qué puedes hacer
              </span>
            </div>

            <ul className="space-y-3 text-sm leading-7 text-[#d7eadb]">
              <li>• Regresa al dashboard principal.</li>
              <li>• Verifica si tu rol es Administrador, Operador o Visor.</li>
              <li>• Si necesitas acceso, solicita al administrador que actualice tus permisos.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="rounded-2xl bg-[#7CFF6B] px-5 py-3 font-semibold text-[#08110b] shadow-[0_0_20px_rgba(124,255,107,0.18)] transition hover:brightness-110"
            >
              Ir al dashboard
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#223328] bg-[#101914] px-5 py-3 font-semibold text-[#d7eadb] transition hover:border-[#7CFF6B] hover:text-[#7CFF6B]"
            >
              <ArrowLeft size={18} />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage