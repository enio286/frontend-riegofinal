import { useEffect, useState } from "react"
import { getAccessRolesRequest } from "../../core/services/accessRole.service"
import { useAuth } from "../../core/context/AuthContext"

function RolesPage() {
  const { isAdmin } = useAuth()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const cardStyle = {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "16px",
    padding: "18px",
  }

  useEffect(() => {
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

    loadRoles()
  }, [])

  if (!isAdmin) {
    return <p style={{ color: "#f87171" }}>No tienes permisos para ver esta sección.</p>
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Roles de acceso</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Estos son los 3 roles fijos del sistema. No se editan ni se eliminan.
      </p>

      {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}
      {loading && <p>Cargando roles...</p>}

      {!loading && roles.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {roles.map((rol) => (
            <div key={rol.id} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{rol.name}</h3>
              <p>{rol.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RolesPage