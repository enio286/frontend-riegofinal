import { Link } from "react-router-dom"
import {
  Droplets,
  BatteryFull,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Activity,
} from "lucide-react"

function HomePage() {
  const previewCards = [
    {
      title: "Humedad actual",
      value: "42%",
      icon: Droplets,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Batería",
      value: "85%",
      icon: BatteryFull,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Dispositivos",
      value: "12",
      icon: Cpu,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Plataforma
            </p>
            <h1 className="mt-2 text-2xl font-bold text-teal-400">
              Sistema de riego
            </h1>
          </div>

          <Link
            to="/login"
            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-8 xl:grid-cols-[1.2fr,1fr]">
          <div className="rounded-[32px] border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/60 p-8 shadow-xl shadow-slate-950/30">
            <p className="text-sm font-medium text-teal-400">
              Monitoreo agrícola inteligente
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Controla tu sistema de riego con una vista clara, moderna y segura
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Visualiza humedad, batería, actividad del sistema, alertas y estado
              operativo desde una sola plataforma.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-300"
              >
                Entrar al sistema
                <ArrowRight size={18} />
              </Link>

              <a
                href="#preview"
                className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Ver vista previa
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-3 w-fit rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                  <Droplets size={20} />
                </div>
                <h3 className="text-xl font-bold">Riego inteligente</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Monitorea humedad y activa decisiones con lógica automática.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-3 w-fit rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                  <Activity size={20} />
                </div>
                <h3 className="text-xl font-bold">Actividad en tiempo real</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Centraliza la operación en un panel limpio y visual.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="mb-3 w-fit rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold">Acceso seguro</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Usuarios con autenticación y control por permisos.
                </p>
              </div>
            </div>
          </div>

          <div
            id="preview"
            className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Vista previa</p>
                <h3 className="text-2xl font-bold text-white">
                  Dashboard general
                </h3>
              </div>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                Demo pública
              </span>
            </div>

            <div className="grid gap-4">
              {previewCards.map((card) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-400">{card.title}</p>
                        <h4 className="mt-2 text-4xl font-bold text-white">
                          {card.value}
                        </h4>
                      </div>

                      <div className={`rounded-2xl p-3 ${card.bg} ${card.color}`}>
                        <Icon size={22} />
                      </div>
                    </div>

                    <div className="mt-5 h-3 w-full rounded-full bg-slate-800">
                      <div className="h-3 w-2/3 rounded-full bg-teal-400" />
                    </div>
                  </div>
                )
              })}

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-slate-400">Estado del sistema</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">Automático</span>
                  <span className="rounded-full bg-cyan-500/15 px-4 py-1 text-cyan-400">
                    ACTIVO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage