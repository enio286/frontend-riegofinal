import { Link } from "react-router-dom"
import {
  Droplets,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Activity,
  Gauge,
  Waves,
  Leaf,
  Sparkles,
} from "lucide-react"

function HomePage() {
  const previewCards = [
    {
      title: "Humedad del suelo",
      value: "42%",
      icon: Droplets,
      color: "text-[#7CFF6B]",
      bg: "bg-[#101914]",
      barClass: "bg-[#7CFF6B]",
    },
    {
      title: "Nivel del tanque",
      value: "68%",
      icon: Gauge,
      color: "text-[#b7ff5e]",
      bg: "bg-[#101914]",
      barClass: "bg-[#b7ff5e]",
    },
    {
      title: "Dispositivo",
      value: "ESP32",
      icon: Cpu,
      color: "text-[#8bffb5]",
      bg: "bg-[#101914]",
      barClass: "bg-[#39d353]",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#ecfff1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,107,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(57,211,83,0.08),transparent_24%)] pointer-events-none" />

      <header className="sticky top-0 z-20 border-b border-[#1c2a22] bg-[#0b120f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223328] bg-[#101914] px-3 py-1.5 shadow-[0_0_18px_rgba(124,255,107,0.08)]">
              <Leaf size={14} className="text-[#7CFF6B]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7CFF6B]">
                Smart Irrigation
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#ecfff1]">
              Sistema de riego
            </h1>
          </div>

          <Link
            to="/login"
            className="rounded-2xl border border-[#223328] bg-[#101914] px-4 py-2 text-sm font-semibold text-[#d7eadb] transition hover:border-[#7CFF6B] hover:text-[#7CFF6B]"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-8 xl:grid-cols-[1.2fr,1fr]">
          <div className="rounded-[32px] border border-[#1c2a22] bg-gradient-to-br from-[#0f1713] via-[#101914] to-[#0c130f] p-8 shadow-[0_0_40px_rgba(124,255,107,0.05)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223328] bg-[#101914] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7CFF6B] shadow-[0_0_18px_rgba(124,255,107,0.08)]">
              <Sparkles size={14} />
              Monitoreo agrícola inteligente
            </div>

            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[#ecfff1] md:text-5xl">
              Controla tu sistema de riego con una interfaz moderna, ambiental y segura
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#9fb7a7]">
              Supervisa humedad del suelo, nivel del tanque, actividad del sistema y
              estado operativo desde una sola plataforma con telemetría en tiempo real.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#7CFF6B] px-5 py-3 font-semibold text-[#08110b] shadow-[0_0_20px_rgba(124,255,107,0.18)] transition hover:brightness-110"
              >
                Entrar al sistema
                <ArrowRight size={18} />
              </Link>

              <a
                href="#preview"
                className="rounded-2xl border border-[#223328] bg-[#101914] px-5 py-3 font-semibold text-[#d7eadb] transition hover:border-[#7CFF6B] hover:text-[#7CFF6B]"
              >
                Ver vista previa
              </a>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-5 shadow-[0_0_20px_rgba(124,255,107,0.04)]">
                <div className="mb-3 w-fit rounded-2xl bg-[#101914] p-3 text-[#7CFF6B]">
                  <Droplets size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#ecfff1]">Riego inteligente</h3>
                <p className="mt-2 text-sm leading-6 text-[#9fb7a7]">
                  Monitorea la humedad del suelo y activa decisiones automáticas con
                  lógica IoT.
                </p>
              </div>

              <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-5 shadow-[0_0_20px_rgba(124,255,107,0.04)]">
                <div className="mb-3 w-fit rounded-2xl bg-[#101914] p-3 text-[#8bffb5]">
                  <Activity size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#ecfff1]">Tiempo real</h3>
                <p className="mt-2 text-sm leading-6 text-[#9fb7a7]">
                  Centraliza lecturas, estado de bomba y actividad del sistema en un solo panel.
                </p>
              </div>

              <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-5 shadow-[0_0_20px_rgba(124,255,107,0.04)]">
                <div className="mb-3 w-fit rounded-2xl bg-[#101914] p-3 text-[#b7ff5e]">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#ecfff1]">Acceso seguro</h3>
                <p className="mt-2 text-sm leading-6 text-[#9fb7a7]">
                  Gestión por roles, autenticación y recuperación de contraseña integrada.
                </p>
              </div>
            </div>
          </div>

          <div
            id="preview"
            className="rounded-[32px] border border-[#1c2a22] bg-[#0f1713] p-6 shadow-[0_0_30px_rgba(124,255,107,0.05)]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#9fb7a7]">Vista previa</p>
                <h3 className="text-2xl font-bold text-[#ecfff1]">
                  Dashboard general
                </h3>
              </div>

              <span className="rounded-full border border-[#223328] bg-[#101914] px-3 py-1 text-sm text-[#7CFF6B]">
                Demo pública
              </span>
            </div>

            <div className="grid gap-4">
              {previewCards.map((card) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#9fb7a7]">{card.title}</p>
                        <h4 className="mt-2 text-4xl font-bold text-[#ecfff1]">
                          {card.value}
                        </h4>
                      </div>

                      <div className={`rounded-2xl p-3 ${card.bg} ${card.color}`}>
                        <Icon size={22} />
                      </div>
                    </div>

                    <div className="mt-5 h-3 w-full rounded-full bg-[#101914]">
                      <div className={`h-3 w-2/3 rounded-full ${card.barClass}`} />
                    </div>
                  </div>
                )
              })}

              <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-5">
                <p className="text-[#9fb7a7]">Estado del sistema</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#ecfff1]">Automático</span>
                  <span className="rounded-full bg-[#7CFF6B] px-4 py-1 text-[#08110b] shadow-[0_0_18px_rgba(124,255,107,0.18)]">
                    ACTIVO
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-[#101914] p-3 text-[#7CFF6B]">
                    <Waves size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#ecfff1]">
                      Plataforma conectada al ESP32
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#9fb7a7]">
                      Integración con telemetría, control remoto de bomba y monitoreo ambiental.
                    </p>
                  </div>
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