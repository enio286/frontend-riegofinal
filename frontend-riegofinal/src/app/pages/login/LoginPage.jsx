import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Leaf, LogIn, ShieldCheck } from "lucide-react"
import { useAuth } from "../../core/context/AuthContext"

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(formData.username, formData.password)
      navigate("/app")
    } catch {
      setError("Credenciales inválidas o error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f0d] text-[#ecfff1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,107,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(57,211,83,0.08),transparent_24%)]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr,0.9fr]">
        <section className="hidden border-r border-[#1c2a22] lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223328] bg-[#101914] px-3 py-1.5 shadow-[0_0_18px_rgba(124,255,107,0.08)]">
              <Leaf size={14} className="text-[#7CFF6B]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7CFF6B]">
                Smart Irrigation
              </span>
            </div>

            <h1 className="mt-6 max-w-xl text-5xl font-bold leading-tight tracking-tight text-[#ecfff1]">
              Control inteligente para un sistema de riego moderno
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#9fb7a7]">
              Monitorea sensores, controla la bomba, revisa el nivel del tanque y
              administra la operación del sistema desde una sola plataforma.
            </p>
          </div>

          <div className="grid gap-4 xl:max-w-2xl xl:grid-cols-3">
            <div className="rounded-3xl border border-[#1c2a22] bg-[#0f1713] p-5 shadow-[0_0_28px_rgba(124,255,107,0.05)]">
              <p className="text-sm font-medium text-[#7CFF6B]">Humedad del suelo</p>
              <h3 className="mt-3 text-3xl font-bold text-[#ecfff1]">Tiempo real</h3>
              <p className="mt-2 text-sm leading-6 text-[#9fb7a7]">
                Visualiza datos reales del sensor capacitivo conectado al ESP32.
              </p>
            </div>

            <div className="rounded-3xl border border-[#1c2a22] bg-[#0f1713] p-5 shadow-[0_0_28px_rgba(124,255,107,0.05)]">
              <p className="text-sm font-medium text-[#7CFF6B]">Nivel del tanque</p>
              <h3 className="mt-3 text-3xl font-bold text-[#ecfff1]">Ultrasónico</h3>
              <p className="mt-2 text-sm leading-6 text-[#9fb7a7]">
                Supervisa el agua disponible y protege la bomba ante condiciones críticas.
              </p>
            </div>

            <div className="rounded-3xl border border-[#1c2a22] bg-[#0f1713] p-5 shadow-[0_0_28px_rgba(124,255,107,0.05)]">
              <p className="text-sm font-medium text-[#7CFF6B]">Acceso seguro</p>
              <h3 className="mt-3 text-3xl font-bold text-[#ecfff1]">Por roles</h3>
              <p className="mt-2 text-sm leading-6 text-[#9fb7a7]">
                Administra permisos y operación según el perfil de cada usuario.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 md:px-10">
          <div className="w-full max-w-md rounded-[32px] border border-[#1c2a22] bg-[#0f1713] p-8 shadow-[0_0_40px_rgba(124,255,107,0.06)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101914] text-[#7CFF6B] shadow-[0_0_18px_rgba(124,255,107,0.08)]">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm text-[#9fb7a7]">Acceso al sistema</p>
                <h2 className="text-3xl font-bold tracking-tight text-[#ecfff1]">
                  Iniciar sesión
                </h2>
              </div>
            </div>

            <p className="mb-6 text-sm leading-7 text-[#9fb7a7]">
              Ingresa con tu usuario y contraseña para acceder al panel de control.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#d7eadb]">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#223328] bg-[#0b120f] px-4 py-3 text-[#ecfff1] outline-none transition placeholder:text-[#6f8678] focus:border-[#7CFF6B] focus:shadow-[0_0_0_4px_rgba(124,255,107,0.08)]"
                  placeholder="Ingresa tu usuario"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#d7eadb]">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#223328] bg-[#0b120f] px-4 py-3 text-[#ecfff1] outline-none transition placeholder:text-[#6f8678] focus:border-[#7CFF6B] focus:shadow-[0_0_0_4px_rgba(124,255,107,0.08)]"
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/"
                  className="text-sm font-medium text-[#9fb7a7] transition hover:text-[#7CFF6B]"
                >
                  Volver al inicio
                </Link>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#9fb7a7] transition hover:text-[#7CFF6B]"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {error && (
                <div className="rounded-2xl border border-[#442323] bg-[#1a1010] px-4 py-3 text-sm text-[#ffb3b3]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7CFF6B] px-5 py-3.5 text-base font-semibold text-[#08110b] shadow-[0_0_20px_rgba(124,255,107,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn size={18} />
                {loading ? "Entrando..." : "Entrar al sistema"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage