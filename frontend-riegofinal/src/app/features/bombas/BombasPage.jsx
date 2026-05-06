import { useEffect, useState } from "react"
import {
  getBombasRequest,
  createBombaRequest,
  updateBombaRequest,
  deleteBombaRequest,
} from "../../core/services/bomba.service"
import { getDevicesRequest } from "../../core/services/device.service"
import { getZonasRequest } from "../../core/services/zona.service"
import { useAuth } from "../../core/context/AuthContext"

function BombasPage() {
  const { isAdmin, hasRole } = useAuth()
  const canEdit = isAdmin || hasRole("OPERADOR")

  const [bombas, setBombas] = useState([])
  const [dispositivos, setDispositivos] = useState([])
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    id_zona: "",
    id_dispositivo: "",
    nombre: "",
    caudal_litros_min: "",
    estado_actual: "APAGADA",
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
      const [bombasData, dispositivosData, zonasData] = await Promise.all([
        getBombasRequest(),
        getDevicesRequest(),
        getZonasRequest(),
      ])
      setBombas(bombasData)
      setDispositivos(dispositivosData)
      setZonas(zonasData)
    } catch (err) {
      console.error("ERROR BOMBAS:", err)
      setError("No se pudieron cargar las bombas")
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
      nombre: "",
      caudal_litros_min: "",
      estado_actual: "APAGADA",
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
        id_zona: Number(formData.id_zona),
        id_dispositivo: formData.id_dispositivo === "" ? null : Number(formData.id_dispositivo),
        caudal_litros_min: formData.caudal_litros_min === "" ? null : Number(formData.caudal_litros_min),
      }

      if (editingId) {
        await updateBombaRequest(editingId, payload)
      } else {
        await createBombaRequest(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR BOMBA:", err)
      setError(err?.response?.data?.error || "No se pudo guardar la bomba")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (bomba) => {
    setEditingId(bomba.id_bomba)
    setFormData({
      id_zona: bomba.zona?.id_zona ? String(bomba.zona.id_zona) : "",
      id_dispositivo: bomba.dispositivo?.id_dispositivo ? String(bomba.dispositivo.id_dispositivo) : "",
      nombre: bomba.nombre || "",
      caudal_litros_min: bomba.caudal_litros_min ?? "",
      estado_actual: bomba.estado_actual || "APAGADA",
      activa: !!bomba.activa,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar esta bomba?")
    if (!ok) return

    try {
      await deleteBombaRequest(id)
      await loadData()
    } catch (err) {
      console.error("ERROR ELIMINAR BOMBA:", err)
      setError(err?.response?.data?.error || "No se pudo eliminar la bomba")
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Bombas</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de bombas de agua.
      </p>

      {error && <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>}

      {canEdit && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Editar bomba" : "Nueva bomba"}
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
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label>Caudal litros/min</label>
                <input type="number" name="caudal_litros_min" value={formData.caudal_litros_min} onChange={handleChange} style={inputStyle} />
              </div>

              <div>
                <label>Estado actual</label>
                <select name="estado_actual" value={formData.estado_actual} onChange={handleChange} style={inputStyle}>
                  <option value="APAGADA">APAGADA</option>
                  <option value="ENCENDIDA">ENCENDIDA</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "end" }}>
                <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="checkbox" name="activa" checked={formData.activa} onChange={handleChange} />
                  Activa
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

      {loading && <p>Cargando bombas...</p>}

      {!loading && bombas.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay bombas registradas.</p>
      )}

      {!loading && bombas.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {bombas.map((bomba) => (
            <div key={bomba.id_bomba} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{bomba.nombre}</h3>
              <p><strong>Zona:</strong> {bomba.zona?.nombre || "Sin zona"}</p>
              <p><strong>Dispositivo:</strong> {bomba.dispositivo?.nombre || "Sin dispositivo"}</p>
              <p><strong>Caudal:</strong> {bomba.caudal_litros_min ?? "No definido"}</p>
              <p><strong>Estado:</strong> {bomba.estado_actual}</p>
              <p><strong>Activa:</strong> {bomba.activa ? "Sí" : "No"}</p>

              {canEdit && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => handleEdit(bomba)}
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
                    onClick={() => handleDelete(bomba.id_bomba)}
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

export default BombasPage