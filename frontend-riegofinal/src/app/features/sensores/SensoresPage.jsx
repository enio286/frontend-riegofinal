import { useEffect, useState } from "react"
import {
  getSensoresRequest,
  createSensorRequest,
  updateSensorRequest,
  deleteSensorRequest,
} from "../../core/services/sensor.service"
import { getDevicesRequest } from "../../core/services/device.service"
import { getZonasRequest } from "../../core/services/zona.service"
import { useAuth } from "../../core/context/AuthContext"

function SensoresPage() {
  const { isAdmin } = useAuth()

  const [sensores, setSensores] = useState([])
  const [dispositivos, setDispositivos] = useState([])
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    id_dispositivo: "",
    id_zona: "",
    nombre: "",
    tipo_sensor: "HUMEDAD",
    unidad_medida: "%",
    estado: "ACTIVO",
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

  const loadData = async () => {
    try {
      setError("")
      const [sensoresData, dispositivosData, zonasData] = await Promise.all([
        getSensoresRequest(),
        getDevicesRequest(),
        getZonasRequest(),
      ])
      setSensores(sensoresData)
      setDispositivos(dispositivosData)
      setZonas(zonasData)
    } catch (err) {
      console.error("ERROR SENSORES:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar los sensores")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      id_dispositivo: "",
      id_zona: "",
      nombre: "",
      tipo_sensor: "HUMEDAD",
      unidad_medida: "%",
      estado: "ACTIVO",
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
      const payload = {
        ...formData,
        id_dispositivo: Number(formData.id_dispositivo),
        id_zona: Number(formData.id_zona),
      }

      if (editingId) {
        await updateSensorRequest(editingId, payload)
      } else {
        await createSensorRequest(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR SENSOR:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo guardar el sensor")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (sensor) => {
    setEditingId(sensor.id_sensor)
    setFormData({
      id_dispositivo: sensor.dispositivo?.id_dispositivo ? String(sensor.dispositivo.id_dispositivo) : "",
      id_zona: sensor.zona?.id_zona ? String(sensor.zona.id_zona) : "",
      nombre: sensor.nombre || "",
      tipo_sensor: sensor.tipo_sensor || "HUMEDAD",
      unidad_medida: sensor.unidad_medida || "%",
      estado: sensor.estado || "ACTIVO",
      activo: !!sensor.activo,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este sensor?")
    if (!ok) return

    try {
      await deleteSensorRequest(id)
      await loadData()
    } catch (err) {
      console.error("ERROR ELIMINAR SENSOR:", err)
      setError(err?.response?.data?.error || "No se pudo eliminar el sensor")
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Sensores</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de sensores del sistema.
      </p>

      {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

      {isAdmin && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Editar sensor" : "Nuevo sensor"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div>
                <label>Dispositivo</label>
                <select name="id_dispositivo" value={formData.id_dispositivo} onChange={handleChange} style={inputStyle}>
                  <option value="">Seleccione un dispositivo</option>
                  {dispositivos.map((d) => (
                    <option key={d.id_dispositivo} value={d.id_dispositivo}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Zona</label>
                <select name="id_zona" value={formData.id_zona} onChange={handleChange} style={inputStyle}>
                  <option value="">Seleccione una zona</option>
                  {zonas.map((z) => (
                    <option key={z.id_zona} value={z.id_zona}>
                      {z.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label>Tipo sensor</label>
                <select name="tipo_sensor" value={formData.tipo_sensor} onChange={handleChange} style={inputStyle}>
                  <option value="HUMEDAD">HUMEDAD</option>
                  <option value="TEMPERATURA">TEMPERATURA</option>
                  <option value="PH">PH</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

              <div>
                <label>Unidad medida</label>
                <input type="text" name="unidad_medida" value={formData.unidad_medida} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label>Estado</label>
                <select name="estado" value={formData.estado} onChange={handleChange} style={inputStyle}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "end" }}>
                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
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

      {loading && <p>Cargando sensores...</p>}

      {!loading && sensores.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay sensores registrados.</p>
      )}

      {!loading && sensores.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {sensores.map((sensor) => (
            <div key={sensor.id_sensor} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{sensor.nombre}</h3>
              <p><strong>Tipo:</strong> {sensor.tipo_sensor}</p>
              <p><strong>Unidad:</strong> {sensor.unidad_medida}</p>
              <p><strong>Estado:</strong> {sensor.estado}</p>
              <p><strong>Dispositivo:</strong> {sensor.dispositivo?.nombre || "Sin dispositivo"}</p>
              <p><strong>Zona:</strong> {sensor.zona?.nombre || "Sin zona"}</p>

              {isAdmin && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => handleEdit(sensor)}
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
                    onClick={() => handleDelete(sensor.id_sensor)}
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

export default SensoresPage