import { useEffect, useState } from "react"
import {
  getDevicesRequest,
  createDeviceRequest,
  updateDeviceRequest,
  deleteDeviceRequest,
} from "../../core/services/device.service"
import { getZonasRequest } from "../../core/services/zona.service"
import { useAuth } from "../../core/context/AuthContext"

function DispositivosPage() {
  const { isAdmin } = useAuth()

  const [devices, setDevices] = useState([])
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    id_zona: "",
    codigo: "",
    nombre: "",
    modelo: "",
    direccion_ip: "",
    mac_address: "",
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
      const [devicesData, zonasData] = await Promise.all([
        getDevicesRequest(),
        getZonasRequest(),
      ])
      setDevices(devicesData)
      setZonas(zonasData)
    } catch (err) {
      console.error("ERROR DISPOSITIVOS:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar los dispositivos")
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
      codigo: "",
      nombre: "",
      modelo: "",
      direccion_ip: "",
      mac_address: "",
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
        id_zona: Number(formData.id_zona),
      }

      if (editingId) {
        await updateDeviceRequest(editingId, payload)
      } else {
        await createDeviceRequest(payload)
      }

      await loadData()
      resetForm()
    } catch (err) {
      console.error("ERROR GUARDAR DISPOSITIVO:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo guardar el dispositivo")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (device) => {
    setEditingId(device.id_dispositivo)
    setFormData({
      id_zona: device.zona?.id_zona ? String(device.zona.id_zona) : "",
      codigo: device.codigo || "",
      nombre: device.nombre || "",
      modelo: device.modelo || "",
      direccion_ip: device.direccion_ip || "",
      mac_address: device.mac_address || "",
      estado: device.estado || "ACTIVO",
      activo: !!device.activo,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este dispositivo?")
    if (!ok) return

    try {
      await deleteDeviceRequest(id)
      await loadData()
    } catch (err) {
      console.error("ERROR ELIMINAR:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo eliminar el dispositivo")
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: "12px" }}>Dispositivos</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
        Gestión de dispositivos del sistema de riego.
      </p>

      {error && (
        <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
      )}

      {isAdmin && (
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>
            {editingId ? "Editar dispositivo" : "Nuevo dispositivo"}
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
                <label>Zona</label>
                <select
                  name="id_zona"
                  value={formData.id_zona}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">Seleccione una zona</option>
                  {zonas.map((zona) => (
                    <option key={zona.id_zona} value={zona.id_zona}>
                      {zona.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Código</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  style={inputStyle}
                />
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
                <label>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Dirección IP</label>
                <input
                  type="text"
                  name="direccion_ip"
                  value={formData.direccion_ip}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>MAC Address</label>
                <input
                  type="text"
                  name="mac_address"
                  value={formData.mac_address}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
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

      {loading && <p>Cargando dispositivos...</p>}

      {!loading && devices.length === 0 && (
        <p style={{ color: "#94a3b8" }}>No hay dispositivos registrados.</p>
      )}

      {!loading && devices.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {devices.map((device) => (
            <div key={device.id_dispositivo} style={cardStyle}>
              <h3 style={{ marginBottom: "10px" }}>{device.nombre}</h3>
              <p><strong>Código:</strong> {device.codigo}</p>
              <p><strong>Estado:</strong> {device.estado}</p>
              <p><strong>Modelo:</strong> {device.modelo || "No definido"}</p>
              <p><strong>IP:</strong> {device.direccion_ip || "No definida"}</p>
              <p><strong>MAC:</strong> {device.mac_address || "No definida"}</p>
              <p><strong>Zona:</strong> {device.zona?.nombre || "Sin zona"}</p>

              {isAdmin && (
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    onClick={() => handleEdit(device)}
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
                    onClick={() => handleDelete(device.id_dispositivo)}
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

export default DispositivosPage