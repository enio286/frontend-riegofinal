import { Link } from "react-router-dom"
import { SearchX, ArrowLeft, Home } from "lucide-react"

function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f0d] text-[#ecfff1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,107,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(57,211,83,0.08),transparent_24%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl rounded-[32px] border border-[#1c2a22] bg-[#0f1713] p-8 shadow-[0_0_40px_rgba(124,255,107,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#101914] text-[#7CFF6B] shadow-[0_0_18px_rgba(124,255,107,0.08)]">
              <SearchX size={26} />
            </div>

            <div>
              <p className="text-sm text-[#9fb7a7]">Navegación del sistema</p>
              <h1 className="text-3xl font-bold tracking-tight text-[#ecfff1]">
                Página no encontrada
              </h1>
            </div>
          </div>

          <div className="mb-6 inline-flex rounded-full border border-[#223328] bg-[#101914] px-4 py-2 text-sm font-semibold text-[#7CFF6B]">
            Error 404
          </div>

          <p className="text-base leading-8 text-[#9fb7a7]">
            La ruta que intentaste abrir no existe, fue movida o ya no está disponible dentro de la plataforma.
          </p>

          <div className="mt-6 rounded-3xl border border-[#1c2a22] bg-[#0b120f] p-5">
            <p className="text-sm leading-7 text-[#d7eadb]">
              Revisa la URL, vuelve al inicio o entra otra vez al panel principal para seguir navegando.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#7CFF6B] px-5 py-3 font-semibold text-[#08110b] shadow-[0_0_20px_rgba(124,255,107,0.18)] transition hover:brightness-110"
            >
              <Home size={18} />
              Ir al inicio
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

export default NotFoundPage