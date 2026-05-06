import { useEffect, useState } from "react"
import {
  getZonasRequest,
  createZonaRequest,
  updateZonaRequest,
  deleteZonaRequest,
} from "../../core/services/zona.service"
import { getPrediosRequest } from "../../core/services/predio.service"
import { useAuth } from "../../core/context/AuthContext"

function ZonasPage() {
  const { isAdmin } = useAuth()
  const canEdit = isAdmin

  const [zonas, setZonas] = useState([])
  const [predios, setPredios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    id_predio: "",
    nombre: "",
    cultivo: "",
    descripcion: "",
    area_m2: "",
    activa: true,
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
      const [zonasData, prediosData] = await Promise.all([
        getZonasRequest(),
        getPrediosRequest(),
      ])
      setZonas(zonasData)
      setPredios(prediosData)
    } catch (err) {
      console.error("ERROR ZONAS:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar las zonas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      id_predio: "",
      nombre: "",
      cultivo: "",
      descripcion: "",
      area_m2: "",
      activa: true,
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
      const payload = {
        ...formData,
        id_predio: Number(formData.id_predio),
        area_m2: formData.area_m2 === "" ? null : Number(formData.area_m2),
      }

      if (editingId) {
        await updateZonaRequest(editingId, payload)
      } else {
        await createZonaRequest(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR ZONA:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo guardar la zona")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (zona) => {
    setEditingId(zona.id_zona)
    setFormData({
      id_predio: zona.predio?.id_predio ? String(zona.predio.id_predio) : "",
      nombre: zona.nombre || "",
      cultivo: zona.cultivo || "",
      descripcion: zona.descripcion || "",
      area_m2: zona.area_m2 ?? "",
      activa: !!zona.activa,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar esta zona?")
    if (!ok) return

    try {
      await deleteZonaRequest(id)
      await loadData()
    } catch (err) {
      console.error("ERROR ELIMINAR ZONA:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo eliminar la zona")
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Zonas</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de zonas de siembra.
      </p>

      {error && (
        <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
      )}

      {canEdit && predios.length === 0 && (
        <p style={{ color: "#f59e0b", marginBottom: "16px" }}>
          Primero debes crear al menos un predio para registrar zonas.
        </p>
      )}

      {canEdit && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Editar zona" : "Nueva zona"}
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
                <label>Predio</label>
                <select
                  name="id_predio"
                  value={formData.id_predio}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Seleccione un predio</option>
                  {predios.map((predio) => (
                    <option key={predio.id_predio} value={predio.id_predio}>
                      {predio.nombre}
                    </option>
                  ))}
                </select>
              </div>

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
                <label>Cultivo</label>
                <input
                  type="text"
                  name="cultivo"
                  value={formData.cultivo}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Área m²</label>
                <input
                  type="number"
                  name="area_m2"
                  value={formData.area_m2}
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
                    name="activa"
                    checked={formData.activa}
                    onChange={handleChange}
                  />
                  Activa
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button
                type="submit"
                disabled={saving || predios.length === 0}
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#14b8a6",
                  color: "#020617",
                  fontWeight: "bold",
                  cursor: "pointer",
                  opacity: saving || predios.length === 0 ? 0.6 : 1,
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

      {loading && <p>Cargando zonas...</p>}

      {!loading && zonas.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay zonas registradas.</p>
      )}

      {!loading && zonas.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {zonas.map((zona) => (
            <div key={zona.id_zona} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{zona.nombre}</h3>
              <p><strong>Predio:</strong> {zona.predio?.nombre || "Sin predio"}</p>
              <p><strong>Cultivo:</strong> {zona.cultivo || "No definido"}</p>
              <p><strong>Área:</strong> {zona.area_m2 ?? "No definida"}</p>
              <p><strong>Descripción:</strong> {zona.descripcion || "Sin descripción"}</p>
              <p><strong>Activa:</strong> {zona.activa ? "Sí" : "No"}</p>

              {canEdit && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => handleEdit(zona)}
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
                    onClick={() => handleDelete(zona.id_zona)}
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

export default ZonasPage