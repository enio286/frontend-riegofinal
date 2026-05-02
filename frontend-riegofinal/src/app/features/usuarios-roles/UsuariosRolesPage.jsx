import { useEffect, useState } from "react"
import {
  getUsuariosRolesRequest,
  createUsuarioRolRequest,
  updateUsuarioRolRequest,
  deleteUsuarioRolRequest,
} from "../../core/services/usuarioRol.service"
import { getUsuariosRequest } from "../../core/services/usuario.service"
import { getRolesRequest } from "../../core/services/rol.service"
import { useAuth } from "../../core/context/AuthContext"

function UsuariosRolesPage() {
  const { isAdmin } = useAuth()

  const [usuariosRoles, setUsuariosRoles] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    id_usuario: "",
    id_rol: "",
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

  const loadData = async () => {
    try {
      setError("")
      const [usuariosRolesData, usuariosData, rolesData] = await Promise.all([
        getUsuariosRolesRequest(),
        getUsuariosRequest(),
        getRolesRequest(),
      ])

      setUsuariosRoles(usuariosRolesData)
      setUsuarios(usuariosData)
      setRoles(rolesData)
    } catch (err) {
      console.error("ERROR USUARIOS-ROLES:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar las asignaciones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      id_usuario: "",
      id_rol: "",
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
      const payload = {
        id_usuario: Number(formData.id_usuario),
        id_rol: Number(formData.id_rol),
      }

      if (editingId) {
        await updateUsuarioRolRequest(editingId, payload)
      } else {
        await createUsuarioRolRequest(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR USUARIO-ROL:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo guardar la asignación")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id_usuario_rol)
    setFormData({
      id_usuario: item.usuario?.id_usuario ? String(item.usuario.id_usuario) : "",
      id_rol: item.rol?.id_rol ? String(item.rol.id_rol) : "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar esta asignación?")
    if (!ok) return

    try {
      await deleteUsuarioRolRequest(id)
      await loadData()
    } catch (err) {
      console.error("ERROR ELIMINAR USUARIO-ROL:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo eliminar la asignación")
    }
  }

  if (!isAdmin) {
    return <p style={{ color: "#f87171" }}>No tienes permisos para ver esta sección.</p>
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Usuarios - Roles</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Asignación de roles a usuarios del sistema.
      </p>

      {error && (
        <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
      )}

      {usuarios.length === 0 || roles.length === 0 ? (
        <p style={{ color: "#f59e0b", marginBottom: "16px" }}>
          Debes tener al menos un usuario y un rol creados para hacer asignaciones.
        </p>
      ) : null}

      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px" }}>
          {editingId ? "Editar asignación" : "Nueva asignación"}
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
              <label>Usuario</label>
              <select
                name="id_usuario"
                value={formData.id_usuario}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Rol</label>
              <select
                name="id_rol"
                value={formData.id_rol}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button
              type="submit"
              disabled={saving || usuarios.length === 0 || roles.length === 0}
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#14b8a6",
                color: "#020617",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: saving || usuarios.length === 0 || roles.length === 0 ? 0.6 : 1,
              }}
            >
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Asignar"}
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

      {loading && <p>Cargando asignaciones...</p>}

      {!loading && usuariosRoles.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay asignaciones registradas.</p>
      )}

      {!loading && usuariosRoles.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {usuariosRoles.map((item) => (
            <div key={item.id_usuario_rol} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>
                {item.usuario?.username || "Sin usuario"}
              </h3>
              <p><strong>Rol:</strong> {item.rol?.nombre || "Sin rol"}</p>
              <p><strong>Fecha asignación:</strong> {item.fecha_asignacion || "Sin fecha"}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button
                  onClick={() => handleEdit(item)}
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
                  onClick={() => handleDelete(item.id_usuario_rol)}
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

export default UsuariosRolesPage