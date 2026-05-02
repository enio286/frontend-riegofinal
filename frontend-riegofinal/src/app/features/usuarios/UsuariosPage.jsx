import { useEffect, useState } from "react"
import {
  getUsuariosRequest,
  createUsuarioRequest,
  updateUsuarioRequest,
  deleteUsuarioRequest,
} from "../../core/services/usuario.service"
import { useAuth } from "../../core/context/AuthContext"

function UsuariosPage() {
  const { isAdmin } = useAuth()

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    username: "",
    correo: "",
    password_hash: "",
    activo: true,
  })

  const cardStyle = {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "18px",
  }

  const inputStyle = {
    width: "100%",
    marginTop: "6px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
  }

  const loadUsuarios = async () => {
    try {
      setError("")
      const data = await getUsuariosRequest()
      setUsuarios(data)
    } catch (err) {
      console.error("ERROR USUARIOS:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar los usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  const resetForm = () => {
    setFormData({
      username: "",
      correo: "",
      password_hash: "",
      activo: true,
    })
    setEditingId(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const payload = { ...formData }

      if (editingId) {
        await updateUsuarioRequest(editingId, payload)
      } else {
        await createUsuarioRequest(payload)
      }

      await loadUsuarios()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR USUARIO:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo guardar el usuario")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (usuario) => {
    setEditingId(usuario.id_usuario)
    setFormData({
      username: usuario.username || "",
      correo: usuario.correo || "",
      password_hash: "",
      activo: !!usuario.activo,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este usuario?")
    if (!ok) return

    try {
      await deleteUsuarioRequest(id)
      await loadUsuarios()
    } catch (err) {
      console.error("ERROR ELIMINAR USUARIO:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo eliminar el usuario")
    }
  }

  if (!isAdmin) {
    return <p style={{ color: "#f87171" }}>No tienes permisos para ver esta sección.</p>
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Usuarios</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de usuarios del sistema.
      </p>

      {error && (
        <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
      )}

      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>
          {editingId ? "Editar usuario" : "Nuevo usuario"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>{editingId ? "Nueva contraseña (opcional)" : "Contraseña"}</label>
              <input
                type="text"
                name="password_hash"
                value={formData.password_hash}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", alignItems: "end" }}>
              <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                />
                Activo
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#14b8a6",
                color: "#020617",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#1e293b",
                color: "white",
                cursor: "pointer",
              }}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      {loading && <p>Cargando usuarios...</p>}

      {!loading && usuarios.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay usuarios registrados.</p>
      )}

      {!loading && usuarios.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {usuarios.map((usuario) => (
            <div key={usuario.id_usuario} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{usuario.username}</h3>
              <p><strong>Correo:</strong> {usuario.correo || "No definido"}</p>
              <p><strong>Activo:</strong> {usuario.activo ? "Sí" : "No"}</p>
              <p><strong>Último acceso:</strong> {usuario.ultimo_acceso || "Sin registro"}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button
                  onClick={() => handleEdit(usuario)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#3b82f6",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(usuario.id_usuario)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UsuariosPage