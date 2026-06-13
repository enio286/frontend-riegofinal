import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { KeyRound, ArrowLeft, ShieldCheck } from "lucide-react"
import { resetPasswordRequest } from "../../core/services/passwordReset.service"

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { uid, token } = useParams()

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const data = await resetPasswordRequest({
        uid,
        token,
        password: formData.password,
        confirm_password: formData.confirm_password,
      })

      setSuccess(data.message || "Contraseña actualizada correctamente")

      setTimeout(() => {
        navigate("/login")
      }, 1800)
    } catch (err) {
      setError(err?.response?.data?.error || "No se pudo restablecer la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f0d] text-[#ecfff1]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,255,107,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(57,211,83,0.08),transparent_24%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl rounded-[32px] border border-[#1c2a22] bg-[#0f1713] p-8 shadow-[0_0_40px_rgba(124,255,107,0.06)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101914] text-[#7CFF6B] shadow-[0_0_18px_rgba(124,255,107,0.08)]">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-sm text-[#9fb7a7]">Seguridad de acceso</p>
              <h1 className="text-3xl font-bold tracking-tight text-[#ecfff1]">
                Nueva contraseña
              </h1>
            </div>
          </div>

          <p className="mb-6 text-sm leading-7 text-[#9fb7a7]">
            Ingresa tu nueva contraseña para recuperar el acceso al sistema.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#d7eadb]">
                Nueva contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#223328] bg-[#0b120f] px-4 py-3 text-[#ecfff1] outline-none transition placeholder:text-[#6f8678] focus:border-[#7CFF6B] focus:shadow-[0_0_0_4px_rgba(124,255,107,0.08)]"
                placeholder="Escribe tu nueva contraseña"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#d7eadb]">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#223328] bg-[#0b120f] px-4 py-3 text-[#ecfff1] outline-none transition placeholder:text-[#6f8678] focus:border-[#7CFF6B] focus:shadow-[0_0_0_4px_rgba(124,255,107,0.08)]"
                placeholder="Repite la contraseña"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-[#442323] bg-[#1a1010] px-4 py-3 text-sm text-[#ffb3b3]">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl border border-[#23402a] bg-[#101914] px-4 py-3 text-sm text-[#8bffb5]">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7CFF6B] px-5 py-3.5 text-base font-semibold text-[#08110b] shadow-[0_0_20px_rgba(124,255,107,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <KeyRound size={18} />
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>

          <div className="mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#9fb7a7] transition hover:text-[#7CFF6B]"
            >
              <ArrowLeft size={16} />
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage