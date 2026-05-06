import { useEffect, useState } from "react"
import {
  getAccessRolesRequest,
  createAccessRoleRequest,
  updateAccessRoleRequest,
  deleteAccessRoleRequest,
} from "../../core/services/accessRole.service"
import { useAuth } from "../../core/context/AuthContext"

function RolesPage() {
  const { isAdmin } = useAuth()

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
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
      const data = await getAccessRolesRequest()
      setRoles(data)
    } catch (err) {
      console.error("ERROR ROLES:", err)
      setError("No se pudieron cargar los roles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  const resetForm = () => {
    setFormData({ name: "" })
    setEditingId(null)
  }

  const handleChange = (e) => {
    setFormData({ name: e.target.value.toUpperCase() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      if (editingId) {
        await updateAccessRoleRequest(editingId, formData)
      } else {
        await createAccessRoleRequest(formData)
      }

      await loadRoles()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR ROL:", err)
      setError(err?.response?.data?.error || "No se pudo guardar el rol")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (rol) => {
    setEditingId(rol.id)
    setFormData({ name: rol.name || "" })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este rol?")
    if (!ok) return

    try {
      await deleteAccessRoleRequest(id)
      await loadRoles()
    } catch (err) {
      console.error("ERROR ELIMINAR ROL:", err)
      setError(err?.response?.data?.error || "No se pudo eliminar el rol")
    }
  }

  if (!isAdmin) {
    return <p style={{ color: "#f87171" }}>No tienes permisos para ver esta sección.</p>
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Roles de acceso</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de roles reales de acceso al sistema.
      </p>

      {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>
          {editingId ? "Editar rol" : "Nuevo rol"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre del rol</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="ADMIN / OPERADOR / VISOR"
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button type="submit" disabled={saving}>{
              saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"
            }</button>
            <button type="button" onClick={resetForm}>Limpiar</button>
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
            <div key={rol.id} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{rol.name}</h3>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button onClick={() => handleEdit(rol)}>Editar</button>
                <button onClick={() => handleDelete(rol.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RolesPage