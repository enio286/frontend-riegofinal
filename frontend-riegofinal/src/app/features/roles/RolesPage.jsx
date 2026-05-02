import { useEffect, useState } from "react"
import {
  getRolesRequest,
  createRolRequest,
  updateRolRequest,
  deleteRolRequest,
} from "../../core/services/rol.service"
import { useAuth } from "../../core/context/AuthContext"

function RolesPage() {
  const { isAdmin } = useAuth()

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
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

  const loadRoles = async () => {
    try {
      setError("")
      const data = await getRolesRequest()
      setRoles(data)
    } catch (err) {
      console.error("ERROR ROLES:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar los roles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
    })
    setEditingId(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const payload = { ...formData }

      if (editingId) {
        await updateRolRequest(editingId, payload)
      } else {
        await createRolRequest(payload)
      }

      await loadRoles()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR ROL:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo guardar el rol")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (rol) => {
    setEditingId(rol.id_rol)
    setFormData({
      nombre: rol.nombre || "",
      descripcion: rol.descripcion || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este rol?")
    if (!ok) return

    try {
      await deleteRolRequest(id)
      await loadRoles()
    } catch (err) {
      console.error("ERROR ELIMINAR ROL:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo eliminar el rol")
    }
  }

  if (!isAdmin) {
    return <p style={{ color: "#f87171" }}>No tienes permisos para ver esta sección.</p>
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Roles</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de roles del sistema.
      </p>

      {error && (
        <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
      )}

      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>
          {editingId ? "Editar rol" : "Nuevo rol"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
              />
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

      {loading && <p>Cargando roles...</p>}

      {!loading && roles.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay roles registrados.</p>
      )}

      {!loading && roles.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {roles.map((rol) => (
            <div key={rol.id_rol} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{rol.nombre}</h3>
              <p><strong>Descripción:</strong> {rol.descripcion || "Sin descripción"}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button
                  onClick={() => handleEdit(rol)}
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
                  onClick={() => handleDelete(rol.id_rol)}
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

export default RolesPage