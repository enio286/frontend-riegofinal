import { useEffect, useMemo, useState } from "react"
import {
  Cpu,
  Droplets,
  BatteryFull,
  Power,
  Gauge,
  Waves,
  MapPinned,
  Map,
  RefreshCw,
  ChevronDown,
  TriangleAlert,
  Play,
  Square,
  Activity,
  Clock3,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { getDevicesRequest } from "../../core/services/device.service"
import { getPrediosRequest } from "../../core/services/predio.service"
import { getZonasRequest } from "../../core/services/zona.service"
import { getSensoresRequest } from "../../core/services/sensor.service"
import { getLecturasHumedadRequest } from "../../core/services/lecturaHumedad.service"
import { getLecturasBateriaRequest } from "../../core/services/lecturaBateria.service"
import { getConfiguracionesRequest } from "../../core/services/configuracionRiego.service"
import { getAlertasRequest } from "../../core/services/alerta.service"
import {
  createComandoRemotoRequest,
  getComandosRemotosRequest,
} from "../../core/services/comandoRemoto.service"
import { useAuth } from "../../core/context/AuthContext"

function DashboardPage() {
  const { user, isAdmin } = useAuth()

  const [stats, setStats] = useState({
    predios: 0,
    zonas: 0,
    dispositivos: 0,
  })

  const [devices, setDevices] = useState([])
  const [sensores, setSensores] = useState([])
  const [lecturas, setLecturas] = useState([])
  const [lecturasBateria, setLecturasBateria] = useState([])
  const [configuraciones, setConfiguraciones] = useState([])
  const [alertas, setAlertas] = useState([])
  const [comandos, setComandos] = useState([])

  const [selectedDeviceId, setSelectedDeviceId] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [commandLoading, setCommandLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadDashboard = async (showRefreshState = false) => {
    try {
      if (showRefreshState) setRefreshing(true)
      setError("")
      setSuccess("")

      const [
        predios,
        zonas,
        dispositivos,
        sensoresData,
        lecturasData,
        lecturasBateriaData,
        configuracionesData,
        alertasData,
        comandosData,
      ] = await Promise.all([
        getPrediosRequest(),
        getZonasRequest(),
        getDevicesRequest(),
        getSensoresRequest(),
        getLecturasHumedadRequest(),
        getLecturasBateriaRequest(),
        getConfiguracionesRequest(),
        getAlertasRequest(),
        getComandosRemotosRequest(),
      ])

      setStats({
        predios: predios.length,
        zonas: zonas.length,
        dispositivos: dispositivos.length,
      })

      setDevices(dispositivos)
      setSensores(sensoresData)
      setLecturas(lecturasData)
      setLecturasBateria(lecturasBateriaData)
      setConfiguraciones(configuracionesData)
      setAlertas(alertasData)
      setComandos(comandosData)

      if (dispositivos.length > 0) {
        setSelectedDeviceId((prev) => {
          const exists = dispositivos.some(
            (device) => String(device.id_dispositivo) === String(prev)
          )
          return exists ? prev : String(dispositivos[0].id_dispositivo)
        })
      } else {
        setSelectedDeviceId("")
      }
    } catch (err) {
      console.error("ERROR DASHBOARD:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudieron cargar los datos del dashboard")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const selectedDevice = useMemo(() => {
    return (
      devices.find(
        (device) => String(device.id_dispositivo) === String(selectedDeviceId)
      ) || null
    )
  }, [devices, selectedDeviceId])

  const selectedZoneId = selectedDevice?.zona?.id_zona || null

  const selectedDeviceSensors = useMemo(() => {
    if (!selectedDevice) return []
    return sensores.filter(
      (sensor) =>
        String(sensor.dispositivo?.id_dispositivo) ===
        String(selectedDevice.id_dispositivo)
    )
  }, [sensores, selectedDevice])

  const selectedSensorIds = useMemo(() => {
    return selectedDeviceSensors.map((sensor) => sensor.id_sensor)
  }, [selectedDeviceSensors])

  const deviceLecturas = useMemo(() => {
    return lecturas
      .filter((lectura) => selectedSensorIds.includes(lectura.sensor?.id_sensor))
      .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
  }, [lecturas, selectedSensorIds])

  const latestLectura = useMemo(() => {
    if (deviceLecturas.length === 0) return null
    return [...deviceLecturas].sort(
      (a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora)
    )[0]
  }, [deviceLecturas])

  const chartData = useMemo(() => {
    return deviceLecturas.slice(-6).map((item, index) => {
      const date = item.fecha_hora ? new Date(item.fecha_hora) : null
      const label = date
        ? `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        : `L${index + 1}`

      return {
        hora: label,
        humedad: Number(item.valor_humedad || 0),
      }
    })
  }, [deviceLecturas])

  const averageHumidity = useMemo(() => {
    if (deviceLecturas.length === 0) return null
    const total = deviceLecturas.reduce(
      (sum, item) => sum + Number(item.valor_humedad || 0),
      0
    )
    return total / deviceLecturas.length
  }, [deviceLecturas])

  const selectedConfig = useMemo(() => {
    if (!selectedZoneId) return null

    const vigente = configuraciones.find(
      (config) =>
        String(config.zona?.id_zona) === String(selectedZoneId) && config.vigente
    )

    if (vigente) return vigente

    return (
      configuraciones.find(
        (config) => String(config.zona?.id_zona) === String(selectedZoneId)
      ) || null
    )
  }, [configuraciones, selectedZoneId])

  const deviceBatteryReading = useMemo(() => {
    if (!selectedDevice) return null

    const items = lecturasBateria
      .filter(
        (item) =>
          String(item.bateria?.dispositivo).trim().toLowerCase() ===
          String(selectedDevice.nombre).trim().toLowerCase()
      )
      .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))

    return items[0] || null
  }, [lecturasBateria, selectedDevice])

  const deviceAlerts = useMemo(() => {
    if (!selectedDevice) return []

    return alertas
      .filter((alerta) => {
        const sameDevice =
          String(alerta.dispositivo?.id_dispositivo) ===
          String(selectedDevice.id_dispositivo)

        const sameZone =
          String(alerta.zona?.id_zona) === String(selectedDevice.zona?.id_zona)

        return sameDevice || sameZone
      })
      .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
  }, [alertas, selectedDevice])

  const recentAlerts = useMemo(() => deviceAlerts.slice(0, 3), [deviceAlerts])

  const lastCommand = useMemo(() => {
    if (!selectedDevice) return null

    const items = comandos
      .filter(
        (comando) =>
          String(comando.dispositivo?.id_dispositivo) ===
          String(selectedDevice.id_dispositivo)
      )
      .sort((a, b) => new Date(b.fecha_hora_envio) - new Date(a.fecha_hora_envio))

    return items[0] || null
  }, [comandos, selectedDevice])

  const currentHumidityValue = latestLectura
    ? `${Math.round(Number(latestLectura.valor_humedad))}%`
    : "Sin dato"

  const currentHumidityBar = latestLectura
    ? `${Math.max(0, Math.min(100, Number(latestLectura.valor_humedad)))}%`
    : "0%"

  const thresholdValue = selectedConfig
    ? `${Math.round(Number(selectedConfig.umbral_humedad))}%`
    : "Sin dato"

  const thresholdBar = selectedConfig
    ? `${Math.max(0, Math.min(100, Number(selectedConfig.umbral_humedad)))}%`
    : "0%"

  const batteryValue = deviceBatteryReading
    ? `${Math.round(Number(deviceBatteryReading.porcentaje))}%`
    : "Sin dato"

  const batteryBar = deviceBatteryReading
    ? `${Math.max(0, Math.min(100, Number(deviceBatteryReading.porcentaje)))}%`
    : "0%"

  const topCards = [
    {
      title: "Humedad actual",
      value: currentHumidityValue,
      badge: latestLectura ? "Lectura real" : "Sin lectura",
      icon: Droplets,
      barWidth: currentHumidityBar,
      barColor: "bg-emerald-400",
      badgeColor: "bg-emerald-500/15 text-emerald-400",
      iconBox: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Umbral de riego",
      value: thresholdValue,
      badge: selectedConfig?.modo_riego || "Sin config",
      icon: Gauge,
      barWidth: thresholdBar,
      barColor: "bg-cyan-400",
      badgeColor: "bg-cyan-500/15 text-cyan-400",
      iconBox: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Batería",
      value: batteryValue,
      badge: deviceBatteryReading ? "Lectura real" : "Sin lectura",
      icon: BatteryFull,
      barWidth: batteryBar,
      barColor: "bg-amber-400",
      badgeColor: "bg-amber-500/15 text-amber-400",
      iconBox: "bg-amber-500/10 text-amber-400",
    },
  ]

  const summaryCards = [
    {
      title: "Predios",
      value: stats.predios,
      icon: MapPinned,
    },
    {
      title: "Zonas",
      value: stats.zonas,
      icon: Map,
    },
    {
      title: "Dispositivos",
      value: stats.dispositivos,
      icon: Cpu,
    },
  ]

  const zoneCards = [
    {
      title: selectedDevice?.zona?.nombre || "Zona",
      value: averageHumidity ? `${Math.round(averageHumidity)}%` : "Sin dato",
    },
    {
      title: "Sensores",
      value: selectedDeviceSensors.length,
    },
    {
      title: "Alertas",
      value: deviceAlerts.length,
    },
  ]

  const sendCommand = async (accion) => {
    if (!selectedDevice) {
      setError("Selecciona un dispositivo antes de enviar comandos")
      return
    }

    try {
      setCommandLoading(true)
      setError("")
      setSuccess("")

      await createComandoRemotoRequest({
        id_dispositivo: selectedDevice.id_dispositivo,
        accion,
        estado: "PENDIENTE",
        parametros_texto: `Enviado desde dashboard para ${selectedDevice.nombre}`,
      })

      setSuccess(`Comando ${accion} enviado correctamente`)
      await loadDashboard(true)
    } catch (err) {
      console.error("ERROR COMANDO:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo enviar el comando")
    } finally {
      setCommandLoading(false)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-xl">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm text-emerald-400">
          Humedad: {payload[0].value}%
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/70 p-6 shadow-xl shadow-slate-950/30 md:p-8">
        <p className="text-sm font-medium text-teal-400">Sembrando innovación</p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Dashboard de riego inteligente
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
          Monitorea humedad, batería, estado del sistema y controla el riego de forma
          manual o automática. Bienvenido,{" "}
          <span className="font-semibold text-white">{user?.username}</span>. Perfil:{" "}
          <span className="font-semibold text-teal-400">
            {isAdmin ? "Administrador" : "Usuario"}
          </span>.
        </p>

        <div className="mt-6 grid gap-4 rounded-[24px] border border-slate-800 bg-slate-950/70 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div className="relative">
              <label className="mb-2 block text-sm text-slate-400">
                Seleccionar dispositivo
              </label>

              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 pr-10 text-white outline-none transition focus:border-teal-400"
              >
                {devices.length === 0 ? (
                  <option value="">No hay dispositivos</option>
                ) : (
                  devices.map((device) => (
                    <option
                      key={device.id_dispositivo}
                      value={device.id_dispositivo}
                    >
                      {device.nombre}
                    </option>
                  ))
                )}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-[46px] text-slate-400"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Estado
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {selectedDevice?.estado || "Sin datos"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Zona
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {selectedDevice?.zona?.nombre || "Sin zona"}
              </p>
            </div>
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Actualizando..." : "Refrescar"}
            </button>
          </div>
        </div>
      </section>

      {success && (
        <div className="rounded-[24px] border border-emerald-900 bg-emerald-950/30 p-4 text-emerald-300">
          {success}
        </div>
      )}

      {loading && (
        <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6 text-slate-300">
          Cargando dashboard...
        </div>
      )}

      {error && (
        <div className="rounded-[24px] border border-red-900 bg-red-950/40 p-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="grid gap-4 xl:grid-cols-3">
            {topCards.map((card) => {
              const Icon = card.icon

              return (
                <div
                  key={card.title}
                  className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg text-slate-400">{card.title}</p>
                      <h3 className="mt-3 text-5xl font-bold text-white">
                        {card.value}
                      </h3>
                    </div>

                    <div className={`rounded-2xl p-3 ${card.iconBox}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <div className="mt-5 h-3 w-full rounded-full bg-slate-800">
                    <div
                      className={`h-3 rounded-full ${card.barColor}`}
                      style={{ width: card.barWidth }}
                    />
                  </div>
                </div>
              )
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-lg text-slate-400">Historial de humedad</p>
                  <h3 className="text-3xl font-bold text-white">
                    Últimas lecturas
                  </h3>
                </div>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                  {selectedDevice?.nombre || "Sin dispositivo"}
                </span>
              </div>

              <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-4 md:p-6">
                {chartData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#1e293b"
                        />
                        <XAxis
                          dataKey="hora"
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <YAxis
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                          axisLine={{ stroke: "#334155" }}
                          tickLine={{ stroke: "#334155" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="humedad"
                          fill="#34d399"
                          radius={[16, 16, 0, 0]}
                          maxBarSize={70}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-80 items-center justify-center text-slate-400">
                    No hay lecturas de humedad para este dispositivo.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
                <p className="text-lg text-slate-400">Control manual</p>
                <h3 className="mt-1 text-3xl font-bold text-white">
                  Bomba de agua
                </h3>

                <div className="mt-6 rounded-[24px] border border-slate-800 bg-slate-950 p-5">
                  <p className="text-slate-400">Último comando</p>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="text-xl font-bold text-white">
                      {lastCommand?.accion || "Sin comandos"}
                    </span>
                    <span className="rounded-full bg-slate-800 px-4 py-1 text-slate-300">
                      {lastCommand?.estado || "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => sendCommand("ENCENDER")}
                    disabled={commandLoading || !selectedDevice}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Play size={18} />
                    Encender
                  </button>

                  <button
                    onClick={() => sendCommand("APAGAR")}
                    disabled={commandLoading || !selectedDevice}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-4 text-lg font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Square size={18} />
                    Apagar
                  </button>
                </div>

                <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-950 p-5">
                  <p className="text-slate-400">Modo del sistema</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {selectedConfig?.modo_riego || "Sin config"}
                    </span>
                    <span className="rounded-full bg-cyan-500/15 px-4 py-1 text-cyan-400">
                      {selectedConfig?.riego_habilitado ? "ACTIVO" : "INACTIVO"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                {summaryCards.map((card) => {
                  const Icon = card.icon

                  return (
                    <div
                      key={card.title}
                      className="rounded-[24px] border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-slate-950/20"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-slate-400">{card.title}</p>
                        <div className="rounded-2xl bg-teal-400/10 p-3 text-teal-400">
                          <Icon size={18} />
                        </div>
                      </div>

                      <h4 className="text-4xl font-bold text-white">
                        {card.value}
                      </h4>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {zoneCards.map((zone) => (
              <div
                key={zone.title}
                className="rounded-[24px] border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20"
              >
                <p className="text-slate-400">{zone.title}</p>
                <h4 className="mt-4 text-5xl font-bold text-white">
                  {zone.value}
                </h4>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                  <Droplets size={18} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Humedad promedio
                </h3>
              </div>
              <p className="text-4xl font-bold text-white">
                {averageHumidity ? `${Math.round(averageHumidity)}%` : "Sin dato"}
              </p>
              <p className="mt-2 text-slate-400">
                Promedio de lecturas del dispositivo seleccionado.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                  <Power size={18} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Estado de riego
                </h3>
              </div>
              <p className="text-4xl font-bold text-white">
                {selectedConfig?.riego_habilitado ? "Activo" : "Inactivo"}
              </p>
              <p className="mt-2 text-slate-400">
                Según la configuración vigente de la zona seleccionada.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                  <Activity size={18} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Última lectura
                </h3>
              </div>
              <p className="text-4xl font-bold text-white">
                {latestLectura?.temperatura
                  ? `${Math.round(Number(latestLectura.temperatura))}°C`
                  : "Sin dato"}
              </p>
              <p className="mt-2 text-slate-400">
                Temperatura reportada junto con la última lectura.
              </p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                  <TriangleAlert size={18} />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Alertas recientes
                </h3>
              </div>

              {recentAlerts.length === 0 ? (
                <p className="text-slate-400">
                  No hay alertas recientes para este dispositivo.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alerta) => (
                    <div
                      key={alerta.id_alerta}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">
                            {alerta.tipo_alerta}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {alerta.mensaje}
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          {alerta.nivel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                  <Clock3 size={18} />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Últimas lecturas
                </h3>
              </div>

              {deviceLecturas.length === 0 ? (
                <p className="text-slate-400">
                  No hay lecturas para este dispositivo.
                </p>
              ) : (
                <div className="space-y-3">
                  {[...deviceLecturas]
                    .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora))
                    .slice(0, 4)
                    .map((lectura) => (
                      <div
                        key={lectura.id_lectura_humedad}
                        className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">
                              Humedad: {Math.round(Number(lectura.valor_humedad))}%
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              Temperatura:{" "}
                              {lectura.temperatura
                                ? `${Math.round(Number(lectura.temperatura))}°C`
                                : "Sin dato"}
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                            {lectura.fecha_hora
                              ? new Date(lectura.fecha_hora).toLocaleString()
                              : "Sin fecha"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default DashboardPage