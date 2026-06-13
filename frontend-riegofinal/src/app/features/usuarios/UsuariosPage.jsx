import { useEffect, useState } from "react"
import {
  getAccessUsersRequest,
  createAccessUserRequest,
  updateAccessUserRequest,
  deleteAccessUserRequest,
} from "../../core/services/accessUser.service"
import { getAccessRolesRequest } from "../../core/services/accessRole.service"
import { useAuth } from "../../core/context/AuthContext"

function UsuariosPage() {
  const { isAdmin } = useAuth()

  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    is_active: true,
    role_name: "",
  })

  const cardStyle = {
    background: "#0f1713",
    border: "1px solid #1c2a22",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 0 24px rgba(124,255,107,0.04)",
  }

  const inputStyle = {
    width: "100%",
    marginTop: "6px",
    padding: "12px 14px",
    borderRadius: "16px",
    border: "1px solid #223328",
    background: "#0b120f",
    color: "#ecfff1",
    outline: "none",
  }

  const loadData = async () => {
    try {
      setError("")
      const [usersData, rolesData] = await Promise.all([
        getAccessUsersRequest(),
        getAccessRolesRequest(),
      ])
      setUsuarios(usersData)
      setRoles(rolesData)
    } catch (err) {
      console.error("ERROR USUARIOS:", err)
      setError("No se pudieron cargar los usuarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
      is_active: true,
      role_name: "",
    })
    setEditingId(null)
    setSuccess("")
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
    setSuccess("")

    try {
      if (!formData.role_name) {
        setError("Debes seleccionar un rol")
        setSaving(false)
        return
      }

      if (!editingId && !formData.password) {
        setError("La contraseña es obligatoria")
        setSaving(false)
        return
      }

      if (formData.password || formData.confirm_password) {
        if (formData.password !== formData.confirm_password) {
          setError("Las contraseñas no coinciden")
          setSaving(false)
          return
        }
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        is_active: formData.is_active,
        role_name: formData.role_name,
      }

      if (editingId) {
        await updateAccessUserRequest(editingId, payload)
        setSuccess("Usuario actualizado correctamente")
      } else {
        await createAccessUserRequest(payload)
        setSuccess("Usuario creado correctamente")
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR USUARIO:", err)
      setError(err?.response?.data?.error || "No se pudo guardar el usuario")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (usuario) => {
    setEditingId(usuario.id)
    setFormData({
      username: usuario.username || "",
      email: usuario.email || "",
      first_name: usuario.first_name || "",
      last_name: usuario.last_name || "",
      password: "",
      confirm_password: "",
      is_active: !!usuario.is_active,
      role_name: usuario.primary_role || usuario.roles?.[0] || "",
    })
    setSuccess("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleResetPassword = (usuario) => {
    setEditingId(usuario.id)
    setFormData({
      username: usuario.username || "",
      email: usuario.email || "",
      first_name: usuario.first_name || "",
      last_name: usuario.last_name || "",
      password: "",
      confirm_password: "",
      is_active: !!usuario.is_active,
      role_name: usuario.primary_role || usuario.roles?.[0] || "",
    })
    setSuccess(`Restableciendo contraseña para ${usuario.username}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este usuario?")
    if (!ok) return

    try {
      await deleteAccessUserRequest(id)
      await loadData()
      setSuccess("Usuario eliminado correctamente")
    } catch (err) {
      console.error("ERROR ELIMINAR USUARIO:", err)
      setError(err?.response?.data?.error || "No se pudo eliminar el usuario")
    }
  }

  if (!isAdmin) {
    return <p style={{ color: "#ffb3b3" }}>No tienes permisos para ver esta sección.</p>
  }

  return (
    <div style={{ color: "#ecfff1" }}>
      <h2 style={{ marginBottom: "12px", fontSize: "30px", fontWeight: 700 }}>
        Usuarios de acceso
      </h2>
      <p style={{ color: "#9fb7a7", marginBottom: "20px" }}>
        Crea usuarios reales para entrar al sistema, asígnales un rol y restablece su contraseña cuando sea necesario.
      </p>

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "16px",
            border: "1px solid #442323",
            background: "#1a1010",
            color: "#ffb3b3",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "16px",
            border: "1px solid #23402a",
            background: "#101914",
            color: "#8bffb5",
          }}
        >
          {success}
        </div>
      )}

      <div style={{ ...cardStyle, marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "16px", fontSize: "22px" }}>
          {editingId ? "Editar usuario / restablecer contraseña" : "Nuevo usuario"}
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
              <input name="username" value={formData.username} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label>Nombres</label>
              <input name="first_name" value={formData.first_name} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label>Apellidos</label>
              <input name="last_name" value={formData.last_name} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label>{editingId ? "Nueva contraseña" : "Contraseña"}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Confirmar contraseña</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Rol</label>
              <select
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.name}>
                    {rol.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "end" }}>
              <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Activo
              </label>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 18px",
                borderRadius: "16px",
                border: "none",
                background: "#7CFF6B",
                color: "#08110b",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 0 18px rgba(124,255,107,0.18)",
              }}
            >
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: "12px 18px",
                borderRadius: "16px",
                border: "1px solid #223328",
                background: "#101914",
                color: "#d7eadb",
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
        <p style={{ color: "#9fb7a7" }}>No hay usuarios registrados.</p>
      )}

      {!loading && usuarios.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {usuarios.map((usuario) => (
            <div key={usuario.id} style={cardStyle}>
              <h3 style={{ marginBottom: "10px", fontSize: "22px" }}>{usuario.username}</h3>
              <p><strong>Email:</strong> {usuario.email || "No definido"}</p>
              <p><strong>Nombre:</strong> {usuario.first_name || "-"} {usuario.last_name || ""}</p>
              <p><strong>Activo:</strong> {usuario.is_active ? "Sí" : "No"}</p>
              <p><strong>Rol:</strong> {usuario.primary_role || usuario.roles?.[0] || "Sin rol"}</p>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => handleEdit(usuario)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px",
                    border: "none",
                    background: "#1b4d2a",
                    color: "#ecfff1",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleResetPassword(usuario)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px",
                    border: "1px solid #223328",
                    background: "#101914",
                    color: "#8bffb5",
                    cursor: "pointer",
                  }}
                >
                  Restablecer clave
                </button>

                <button
                  onClick={() => handleDelete(usuario.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px",
                    border: "none",
                    background: "#3b1515",
                    color: "#ffd6d6",
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