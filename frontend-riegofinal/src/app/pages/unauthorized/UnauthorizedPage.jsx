import { Link } from "react-router-dom"

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">
          Acceso denegado
        </p>

        <h1 className="mt-4 text-4xl font-bold text-white">
          No tienes permisos para entrar aquí
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          Tu rol actual no tiene acceso a este módulo.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/app"
            className="rounded-2xl bg-teal-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Ir al dashboard
          </Link>

          <Link
            to="/login"
            className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Cambiar usuario
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage