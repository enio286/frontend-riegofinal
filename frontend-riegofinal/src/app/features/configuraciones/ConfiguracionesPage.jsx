import { useEffect, useState } from "react"
import {
  getConfiguracionesRequest,
  createConfiguracionRequest,
  updateConfiguracionRequest,
  deleteConfiguracionRequest,
} from "../../core/services/configuracionRiego.service"
import { getZonasRequest } from "../../core/services/zona.service"
import { useAuth } from "../../core/context/AuthContext"

function ConfiguracionesPage() {
  const { isAdmin } = useAuth()

  const [configuraciones, setConfiguraciones] = useState([])
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    id_zona: "",
    umbral_humedad: "",
    tiempo_riego_segundos: "",
    modo_riego: "AUTOMATICO",
    intervalo_lectura_segundos: 60,
    riego_habilitado: true,
    vigente: true,
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
      const [configData, zonasData] = await Promise.all([
        getConfiguracionesRequest(),
        getZonasRequest(),
      ])
      setConfiguraciones(configData)
      setZonas(zonasData)
    } catch (err) {
      console.error("ERROR CONFIGURACIONES:", err)
      setError("No se pudieron cargar las configuraciones")
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
      umbral_humedad: "",
      tiempo_riego_segundos: "",
      modo_riego: "AUTOMATICO",
      intervalo_lectura_segundos: 60,
      riego_habilitado: true,
      vigente: true,
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
        umbral_humedad: Number(formData.umbral_humedad),
        tiempo_riego_segundos: Number(formData.tiempo_riego_segundos),
        intervalo_lectura_segundos: Number(formData.intervalo_lectura_segundos),
      }

      if (editingId) {
        await updateConfiguracionRequest(editingId, payload)
      } else {
        await createConfiguracionRequest(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR CONFIGURACION:", err)
      setError(err?.response?.data?.error || "No se pudo guardar la configuración")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (config) => {
    setEditingId(config.id_configuracion)
    setFormData({
      id_zona: config.zona?.id_zona ? String(config.zona.id_zona) : "",
      umbral_humedad: config.umbral_humedad ?? "",
      tiempo_riego_segundos: config.tiempo_riego_segundos ?? "",
      modo_riego: config.modo_riego || "AUTOMATICO",
      intervalo_lectura_segundos: config.intervalo_lectura_segundos ?? 60,
      riego_habilitado: !!config.riego_habilitado,
      vigente: !!config.vigente,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar esta configuración?")
    if (!ok) return

    try {
      await deleteConfiguracionRequest(id)
      await loadData()
    } catch (err) {
      console.error("ERROR ELIMINAR CONFIGURACION:", err)
      setError(err?.response?.data?.error || "No se pudo eliminar la configuración")
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Configuraciones de riego</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de configuraciones automáticas de riego.
      </p>

      {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

      {isAdmin && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Editar configuración" : "Nueva configuración"}
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
                <label>Umbral humedad</label>
                <input type="number" name="umbral_humedad" value={formData.umbral_humedad} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label>Tiempo riego (seg)</label>
                <input type="number" name="tiempo_riego_segundos" value={formData.tiempo_riego_segundos} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label>Modo riego</label>
                <select name="modo_riego" value={formData.modo_riego} onChange={handleChange} style={inputStyle}>
                  <option value="AUTOMATICO">AUTOMATICO</option>
                  <option value="MANUAL">MANUAL</option>
                </select>
              </div>

              <div>
                <label>Intervalo lectura (seg)</label>
                <input type="number" name="intervalo_lectura_segundos" value={formData.intervalo_lectura_segundos} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={{ display: "flex", alignItems: "end", gap: "20px" }}>
                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="checkbox" name="riego_habilitado" checked={formData.riego_habilitado} onChange={handleChange} />
                  Riego habilitado
                </label>

                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="checkbox" name="vigente" checked={formData.vigente} onChange={handleChange} />
                  Vigente
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

      {loading && <p>Cargando configuraciones...</p>}

      {!loading && configuraciones.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay configuraciones registradas.</p>
      )}

      {!loading && configuraciones.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {configuraciones.map((config) => (
            <div key={config.id_configuracion} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{config.zona?.nombre || "Sin zona"}</h3>
              <p><strong>Umbral:</strong> {config.umbral_humedad}</p>
              <p><strong>Tiempo riego:</strong> {config.tiempo_riego_segundos}s</p>
              <p><strong>Modo:</strong> {config.modo_riego}</p>
              <p><strong>Intervalo lectura:</strong> {config.intervalo_lectura_segundos}s</p>
              <p><strong>Riego habilitado:</strong> {config.riego_habilitado ? "Sí" : "No"}</p>
              <p><strong>Vigente:</strong> {config.vigente ? "Sí" : "No"}</p>

              {isAdmin && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => handleEdit(config)}
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
                    onClick={() => handleDelete(config.id_configuracion)}
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

export default ConfiguracionesPage