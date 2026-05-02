import { useEffect, useState } from "react"
import {
  getAlertasRequest,
  createAlertaRequest,
  updateAlertaRequest,
  deleteAlertaRequest,
} from "../../core/services/alerta.service"
import { getDevicesRequest } from "../../core/services/device.service"
import { getZonasRequest } from "../../core/services/zona.service"
import { useAuth } from "../../core/context/AuthContext"

function AlertasPage() {
  const { isAdmin } = useAuth()

  const [alertas, setAlertas] = useState([])
  const [dispositivos, setDispositivos] = useState([])
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    id_zona: "",
    id_dispositivo: "",
    tipo_alerta: "",
    nivel: "WARNING",
    mensaje: "",
    atendida: false,
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
      const [alertasData, dispositivosData, zonasData] = await Promise.all([
        getAlertasRequest(),
        getDevicesRequest(),
        getZonasRequest(),
      ])
      setAlertas(alertasData)
      setDispositivos(dispositivosData)
      setZonas(zonasData)
    } catch (err) {
      console.error("ERROR ALERTAS:", err)
      setError("No se pudieron cargar las alertas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      id_zona: "",
      id_dispositivo: "",
      tipo_alerta: "",
      nivel: "WARNING",
      mensaje: "",
      atendida: false,
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
        id_zona: Number(formData.id_zona),
        id_dispositivo: formData.id_dispositivo === "" ? null : Number(formData.id_dispositivo),
      }

      if (editingId) {
        await updateAlertaRequest(editingId, payload)
      } else {
        await createAlertaRequest(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR ALERTA:", err)
      setError(err?.response?.data?.error || "No se pudo guardar la alerta")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (alerta) => {
    setEditingId(alerta.id_alerta)
    setFormData({
      id_zona: alerta.zona?.id_zona ? String(alerta.zona.id_zona) : "",
      id_dispositivo: alerta.dispositivo?.id_dispositivo ? String(alerta.dispositivo.id_dispositivo) : "",
      tipo_alerta: alerta.tipo_alerta || "",
      nivel: alerta.nivel || "WARNING",
      mensaje: alerta.mensaje || "",
      atendida: !!alerta.atendida,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar esta alerta?")
    if (!ok) return

    try {
      await deleteAlertaRequest(id)
      await loadData()
    } catch (err) {
      console.error("ERROR ELIMINAR ALERTA:", err)
      setError(err?.response?.data?.error || "No se pudo eliminar la alerta")
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Alertas</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de alertas del sistema.
      </p>

      {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

      {isAdmin && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Editar alerta" : "Nueva alerta"}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
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
                <label>Dispositivo</label>
                <select name="id_dispositivo" value={formData.id_dispositivo} onChange={handleChange} style={inputStyle}>
                  <option value="">Sin dispositivo</option>
                  {dispositivos.map((d) => (
                    <option key={d.id_dispositivo} value={d.id_dispositivo}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Tipo alerta</label>
                <input type="text" name="tipo_alerta" value={formData.tipo_alerta} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label>Nivel</label>
                <select name="nivel" value={formData.nivel} onChange={handleChange} style={inputStyle}>
                  <option value="INFO">INFO</option>
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label>Mensaje</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "end" }}>
                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="checkbox" name="atendida" checked={formData.atendida} onChange={handleChange} />
                  Atendida
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

      {loading && <p>Cargando alertas...</p>}

      {!loading && alertas.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay alertas registradas.</p>
      )}

      {!loading && alertas.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {alertas.map((alerta) => (
            <div key={alerta.id_alerta} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{alerta.tipo_alerta}</h3>
              <p><strong>Nivel:</strong> {alerta.nivel}</p>
              <p><strong>Zona:</strong> {alerta.zona?.nombre || "Sin zona"}</p>
              <p><strong>Dispositivo:</strong> {alerta.dispositivo?.nombre || "Sin dispositivo"}</p>
              <p><strong>Mensaje:</strong> {alerta.mensaje}</p>
              <p><strong>Atendida:</strong> {alerta.atendida ? "Sí" : "No"}</p>

              {isAdmin && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => handleEdit(alerta)}
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
                    onClick={() => handleDelete(alerta.id_alerta)}
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

export default AlertasPage