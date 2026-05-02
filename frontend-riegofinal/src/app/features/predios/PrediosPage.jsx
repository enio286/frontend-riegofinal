import { useEffect, useState } from "react"
import {
  getPrediosRequest,
  createPredioRequest,
  updatePredioRequest,
  deletePredioRequest,
} from "../../core/services/predio.service"
import { useAuth } from "../../core/context/AuthContext"

function PrediosPage() {
  const { isAdmin } = useAuth()

  const [predios, setPredios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    descripcion: "",
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

  const loadPredios = async () => {
    try {
      setError("")
      const data = await getPrediosRequest()
      setPredios(data)
    } catch (err) {
      console.error("ERROR PREDIOS:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar los predios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPredios()
  }, [])

  const resetForm = () => {
    setFormData({
      nombre: "",
      ubicacion: "",
      descripcion: "",
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
        await updatePredioRequest(editingId, payload)
      } else {
        await createPredioRequest(payload)
      }

      await loadPredios()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR PREDIO:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo guardar el predio")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (predio) => {
    setEditingId(predio.id_predio)
    setFormData({
      nombre: predio.nombre || "",
      ubicacion: predio.ubicacion || "",
      descripcion: predio.descripcion || "",
      activo: !!predio.activo,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este predio?")
    if (!ok) return

    try {
      await deletePredioRequest(id)
      await loadPredios()
    } catch (err) {
      console.error("ERROR ELIMINAR PREDIO:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo eliminar el predio")
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Predios</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de predios del sistema de riego.
      </p>

      {error && (
        <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
      )}

      {isAdmin && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Editar predio" : "Nuevo predio"}
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

              <div>
                <label>Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
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
      )}

      {loading && <p>Cargando predios...</p>}

      {!loading && predios.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay predios registrados.</p>
      )}

      {!loading && predios.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {predios.map((predio) => (
            <div key={predio.id_predio} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{predio.nombre}</h3>
              <p><strong>Ubicación:</strong> {predio.ubicacion || "No definida"}</p>
              <p><strong>Descripción:</strong> {predio.descripcion || "Sin descripción"}</p>
              <p><strong>Activo:</strong> {predio.activo ? "Sí" : "No"}</p>

              {isAdmin && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => handleEdit(predio)}
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
                    onClick={() => handleDelete(predio.id_predio)}
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PrediosPage