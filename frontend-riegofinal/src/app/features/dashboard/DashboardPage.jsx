import { useEffect, useMemo, useState } from "react"
import {
  Droplets,
  Thermometer,
  Waves,
  Gauge,
  Power,
  Activity,
  RefreshCw,
  Play,
  Square,
  Cpu,
  AlertTriangle,
} from "lucide-react"
import {
  getLatestTelemetryRequest,
  sendMqttCommandRequest,
} from "../../core/services/iot.service"
import { useAuth } from "../../core/context/AuthContext"

function DashboardPage() {
  const { user, isAdmin, hasRole } = useAuth()

  const canControlPump = isAdmin || hasRole("OPERADOR")

  const [telemetry, setTelemetry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [commandLoading, setCommandLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadTelemetry = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      setError("")

      const data = await getLatestTelemetryRequest()

      if (data?.message === "No hay telemetría todavía") {
        setTelemetry(null)
      } else {
        setTelemetry(data)
      }
    } catch (err) {
      console.error("ERROR TELEMETRIA:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError("No se pudo cargar la telemetría del ESP32")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadTelemetry()
  }, [])

  const sendCommand = async (accion) => {
    try {
      setCommandLoading(true)
      setError("")
      setSuccess("")

      await sendMqttCommandRequest({ accion })

      setSuccess(`Comando ${accion} enviado correctamente`)
      setTimeout(() => {
        loadTelemetry(true)
      }, 1000)
    } catch (err) {
      console.error("ERROR COMANDO MQTT:", err)
      console.error("RESPONSE:", err?.response)
      console.error("DATA:", err?.response?.data)
      setError(err?.response?.data?.error || "No se pudo enviar el comando MQTT")
    } finally {
      setCommandLoading(false)
    }
  }

  const humidityValue = telemetry?.humedad_suelo ?? null
  const temperatureValue = telemetry?.temperatura_ambiente ?? null
  const ambientHumidityValue = telemetry?.humedad_ambiente ?? null
  const distanceValue = telemetry?.distancia_cm ?? null
  const tankLevelValue = telemetry?.nivel_tanque_pct ?? null
  const pumpActive = telemetry?.bomba_activa ?? false
  const modeValue = telemetry?.modo || "AUTO"

  const tankStatus = useMemo(() => {
    if (tankLevelValue === null || tankLevelValue === undefined) return "Sin dato"
    if (tankLevelValue <= 15) return "Crítico"
    if (tankLevelValue <= 40) return "Bajo"
    if (tankLevelValue <= 70) return "Medio"
    return "Óptimo"
  }, [tankLevelValue])

  const irrigationRecommendation = useMemo(() => {
    if (humidityValue === null || humidityValue === undefined) {
      return "Sin datos suficientes"
    }

    if (tankLevelValue !== null && tankLevelValue <= 10) {
      return "No regar: nivel de tanque demasiado bajo"
    }

    if (humidityValue < 30) {
      return "Riego recomendado"
    }

    if (humidityValue >= 30 && humidityValue <= 55) {
      return "Monitorear humedad"
    }

    return "No es necesario regar"
  }, [humidityValue, tankLevelValue])

  const cards = [
    {
      title: "Humedad del suelo",
      value:
        humidityValue !== null && humidityValue !== undefined
          ? `${Math.round(humidityValue)}%`
          : "Sin dato",
      subtitle: "Sensor capacitivo",
      icon: Droplets,
      accent: "bg-emerald-500/10 text-emerald-400",
      bar:
        humidityValue !== null && humidityValue !== undefined
          ? `${Math.max(0, Math.min(100, humidityValue))}%`
          : "0%",
      barClass: "bg-emerald-400",
    },
    {
      title: "Temperatura ambiente",
      value:
        temperatureValue !== null && temperatureValue !== undefined
          ? `${Math.round(temperatureValue)}°C`
          : "Sin dato",
      subtitle: "DHT11",
      icon: Thermometer,
      accent: "bg-orange-500/10 text-orange-400",
      bar:
        temperatureValue !== null && temperatureValue !== undefined
          ? `${Math.max(0, Math.min(100, temperatureValue * 2))}%`
          : "0%",
      barClass: "bg-orange-400",
    },
    {
      title: "Humedad ambiente",
      value:
        ambientHumidityValue !== null && ambientHumidityValue !== undefined
          ? `${Math.round(ambientHumidityValue)}%`
          : "Sin dato",
      subtitle: "DHT11",
      icon: Waves,
      accent: "bg-cyan-500/10 text-cyan-400",
      bar:
        ambientHumidityValue !== null && ambientHumidityValue !== undefined
          ? `${Math.max(0, Math.min(100, ambientHumidityValue))}%`
          : "0%",
      barClass: "bg-cyan-400",
    },
    {
      title: "Nivel del tanque",
      value:
        tankLevelValue !== null && tankLevelValue !== undefined
          ? `${Math.round(tankLevelValue)}%`
          : "Sin dato",
      subtitle: tankStatus,
      icon: Gauge,
      accent: "bg-lime-500/10 text-lime-400",
      bar:
        tankLevelValue !== null && tankLevelValue !== undefined
          ? `${Math.max(0, Math.min(100, tankLevelValue))}%`
          : "0%",
      barClass: "bg-lime-400",
    },
  ]

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-900/70 p-6 shadow-xl shadow-slate-950/30 md:p-8">
        <p className="text-sm font-medium text-teal-400">Monitoreo IoT en tiempo real</p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Dashboard de riego inteligente
        </h2>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
          Visualiza telemetría real del ESP32, nivel del tanque, estado de la bomba
          y recomendación automática de riego. Bienvenido,{" "}
          <span className="font-semibold text-white">
            {user?.username || "Usuario"}
          </span>
          .
        </p>

        <div className="mt-6 grid gap-4 rounded-[24px] border border-slate-800 bg-slate-950/70 p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Dispositivo
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {telemetry?.dispositivo_codigo || "esp32-01"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Estado bomba
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {pumpActive ? "Encendida" : "Apagada"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Modo
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {modeValue}
              </p>
            </div>
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={() => loadTelemetry(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
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

      {error && (
        <div className="rounded-[24px] border border-red-900 bg-red-950/40 p-4 text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6 text-slate-300">
          Cargando telemetría del ESP32...
        </div>
      )}

      {!loading && !telemetry && !error && (
        <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-6 text-slate-300">
          Aún no hay telemetría registrada. Verifica que el ESP32 esté encendido y
          publicando por MQTT.
        </div>
      )}

      {!loading && telemetry && (
        <>
          <section className="grid gap-4 xl:grid-cols-4">
            {cards.map((card) => {
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
                      <p className="mt-2 text-sm text-slate-400">{card.subtitle}</p>
                    </div>

                    <div className={`rounded-2xl p-3 ${card.accent}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <div className="mt-5 h-3 w-full rounded-full bg-slate-800">
                    <div
                      className={`h-3 rounded-full ${card.barClass}`}
                      style={{ width: card.bar }}
                    />
                  </div>
                </div>
              )
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-teal-500/10 p-3 text-teal-400">
                  <Cpu size={18} />
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  Resumen del sistema
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-slate-400">Distancia ultrasónica</p>
                  <h4 className="mt-2 text-3xl font-bold text-white">
                    {distanceValue !== null && distanceValue !== undefined
                      ? `${distanceValue.toFixed(2)} cm`
                      : "Sin dato"}
                  </h4>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-slate-400">Última lectura</p>
                  <h4 className="mt-2 text-lg font-bold text-white">
                    {telemetry?.fecha_hora
                      ? new Date(telemetry.fecha_hora).toLocaleString()
                      : "Sin fecha"}
                  </h4>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-slate-400">Estado del tanque</p>
                  <h4 className="mt-2 text-3xl font-bold text-white">
                    {tankStatus}
                  </h4>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-slate-400">Recomendación</p>
                  <h4 className="mt-2 text-lg font-bold text-white">
                    {irrigationRecommendation}
                  </h4>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                    <Power size={18} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    Control de bomba
                  </h3>
                </div>

                <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-5">
                  <p className="text-slate-400">Estado actual</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {pumpActive ? "Encendida" : "Apagada"}
                    </span>
                    <span
                      className={`rounded-full px-4 py-1 text-sm ${
                        pumpActive
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {pumpActive ? "ACTIVA" : "INACTIVA"}
                    </span>
                  </div>
                </div>

                {canControlPump ? (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => sendCommand("ENCENDER_BOMBA")}
                      disabled={commandLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-4 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Play size={18} />
                      Encender
                    </button>

                    <button
                      onClick={() => sendCommand("APAGAR_BOMBA")}
                      disabled={commandLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-4 text-lg font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Square size={18} />
                      Apagar
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-300">
                    Tu rol puede visualizar el estado, pero no controlar la bomba.
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                    <AlertTriangle size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Observaciones
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-slate-300">
                  <li>
                    • Si temperatura y humedad ambiente salen en “Sin dato”, revisa el
                    DHT11 o la resistencia pull-up.
                  </li>
                  <li>
                    • Si el nivel del tanque no cambia bien, recalibra las distancias
                    mínima y máxima del HC-SR04.
                  </li>
                  <li>
                    • Si la bomba responde invertida, cambia la lógica HIGH/LOW del relé
                    en el código del ESP32.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default DashboardPage