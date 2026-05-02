import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
    } catch  {
      setError("Credenciales inválidas o error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
        color: "white",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "30px",
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>Iniciar sesión</h2>
        <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Ingresa con tus credenciales del backend
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
              }}
            />
          </div>

          {error && (
            <p style={{ color: "#f87171", marginBottom: "12px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#14b8a6",
              color: "#020617",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage