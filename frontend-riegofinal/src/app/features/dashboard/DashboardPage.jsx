import { useEffect, useMemo, useState } from "react"
import {
  Droplets,
  Thermometer,
  Waves,
  Gauge,
  Power,
  RefreshCw,
  Play,
  Square,
  Cpu,
  AlertTriangle,
  Radar,
  Leaf,
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
      }, 1200)
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
      return "No regar: tanque demasiado bajo"
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
      iconClass: "text-[#7CFF6B]",
      iconBg: "bg-[#101914]",
      bar:
        humidityValue !== null && humidityValue !== undefined
          ? `${Math.max(0, Math.min(100, humidityValue))}%`
          : "0%",
      barClass: "bg-[#7CFF6B]",
      glow: "shadow-[0_0_22px_rgba(124,255,107,0.14)]",
    },
    {
      title: "Temperatura ambiente",
      value:
        temperatureValue !== null && temperatureValue !== undefined
          ? `${Math.round(temperatureValue)}°C`
          : "Sin dato",
      subtitle: "DHT11",
      icon: Thermometer,
      iconClass: "text-[#8bffb5]",
      iconBg: "bg-[#101914]",
      bar:
        temperatureValue !== null && temperatureValue !== undefined
          ? `${Math.max(0, Math.min(100, temperatureValue * 2))}%`
          : "0%",
      barClass: "bg-[#39d353]",
      glow: "shadow-[0_0_22px_rgba(57,211,83,0.12)]",
    },
    {
      title: "Humedad ambiente",
      value:
        ambientHumidityValue !== null && ambientHumidityValue !== undefined
          ? `${Math.round(ambientHumidityValue)}%`
          : "Sin dato",
      subtitle: "DHT11",
      icon: Waves,
      iconClass: "text-[#7CFF6B]",
      iconBg: "bg-[#101914]",
      bar:
        ambientHumidityValue !== null && ambientHumidityValue !== undefined
          ? `${Math.max(0, Math.min(100, ambientHumidityValue))}%`
          : "0%",
      barClass: "bg-[#7CFF6B]",
      glow: "shadow-[0_0_22px_rgba(124,255,107,0.14)]",
    },
    {
      title: "Nivel del tanque",
      value:
        tankLevelValue !== null && tankLevelValue !== undefined
          ? `${Math.round(tankLevelValue)}%`
          : "Sin dato",
      subtitle: tankStatus,
      icon: Gauge,
      iconClass: "text-[#b7ff5e]",
      iconBg: "bg-[#101914]",
      bar:
        tankLevelValue !== null && tankLevelValue !== undefined
          ? `${Math.max(0, Math.min(100, tankLevelValue))}%`
          : "0%",
      barClass: "bg-[#b7ff5e]",
      glow: "shadow-[0_0_22px_rgba(183,255,94,0.12)]",
    },
  ]

  return (
    <div className="space-y-6 bg-[#0a0f0d] text-[#ecfff1]">
      <section className="overflow-hidden rounded-[30px] border border-[#1c2a22] bg-gradient-to-br from-[#0f1713] via-[#101914] to-[#0c130f] p-6 shadow-[0_0_40px_rgba(124,255,107,0.05)] md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223328] bg-[#101914] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#7CFF6B] shadow-[0_0_18px_rgba(124,255,107,0.08)]">
              <Leaf size={14} />
              Telemetría IoT
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#ecfff1] md:text-5xl">
              Dashboard de riego inteligente
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-8 text-[#9fb7a7] md:text-lg">
              Visualiza telemetría real del ESP32, nivel del tanque, estado de la
              bomba y recomendación automática de riego. Bienvenido,{" "}
              <span className="font-semibold text-[#ecfff1]">
                {user?.username || "Usuario"}
              </span>
              .
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 xl:min-w-[420px]">
            <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.15em] text-[#9fb7a7]">
                Dispositivo
              </p>
              <p className="mt-1 text-sm font-semibold text-[#ecfff1]">
                {telemetry?.dispositivo_codigo || "esp32-01"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.15em] text-[#9fb7a7]">
                Estado bomba
              </p>
              <p className="mt-1 text-sm font-semibold text-[#ecfff1]">
                {pumpActive ? "Encendida" : "Apagada"}
              </p>
            </div>

            <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.15em] text-[#9fb7a7]">
                Modo
              </p>
              <p className="mt-1 text-sm font-semibold text-[#ecfff1]">
                {modeValue}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex">
          <button
            onClick={() => loadTelemetry(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#223328] bg-[#101914] px-5 py-3 text-sm font-semibold text-[#d7eadb] transition hover:border-[#7CFF6B] hover:text-[#7CFF6B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Actualizando..." : "Refrescar"}
          </button>
        </div>
      </section>

      {success && (
        <div className="rounded-[24px] border border-[#23402a] bg-[#101914] p-4 text-[#8bffb5] shadow-[0_0_20px_rgba(124,255,107,0.08)]">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-[24px] border border-[#442323] bg-[#1a1010] p-4 text-[#ffb3b3]">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-[24px] border border-[#1c2a22] bg-[#0f1713] p-6 text-[#d7eadb]">
          Cargando telemetría del ESP32...
        </div>
      )}

      {!loading && !telemetry && !error && (
        <div className="rounded-[24px] border border-[#1c2a22] bg-[#0f1713] p-6 text-[#d7eadb]">
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
                  className={`rounded-[28px] border border-[#1c2a22] bg-[#0f1713] p-6 ${card.glow}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg text-[#9fb7a7]">{card.title}</p>
                      <h3 className="mt-3 text-5xl font-bold text-[#ecfff1]">
                        {card.value}
                      </h3>
                      <p className="mt-2 text-sm text-[#7f9788]">{card.subtitle}</p>
                    </div>

                    <div className={`rounded-2xl p-3 ${card.iconBg}`}>
                      <Icon size={22} className={card.iconClass} />
                    </div>
                  </div>

                  <div className="mt-5 h-3 w-full rounded-full bg-[#0a0f0d]">
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
            <div className="rounded-[28px] border border-[#1c2a22] bg-[#0f1713] p-6 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-[#101914] p-3 text-[#7CFF6B]">
                  <Radar size={18} />
                </div>
                <h3 className="text-2xl font-semibold text-[#ecfff1]">
                  Resumen del sistema
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-4">
                  <p className="text-[#9fb7a7]">Distancia ultrasónica</p>
                  <h4 className="mt-2 text-3xl font-bold text-[#ecfff1]">
                    {distanceValue !== null && distanceValue !== undefined
                      ? `${distanceValue.toFixed(2)} cm`
                      : "Sin dato"}
                  </h4>
                </div>

                <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-4">
                  <p className="text-[#9fb7a7]">Última lectura</p>
                  <h4 className="mt-2 text-lg font-bold text-[#ecfff1]">
                    {telemetry?.fecha_hora
                      ? new Date(telemetry.fecha_hora).toLocaleString()
                      : "Sin fecha"}
                  </h4>
                </div>

                <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-4">
                  <p className="text-[#9fb7a7]">Estado del tanque</p>
                  <h4 className="mt-2 text-3xl font-bold text-[#ecfff1]">
                    {tankStatus}
                  </h4>
                </div>

                <div className="rounded-2xl border border-[#1c2a22] bg-[#0b120f] p-4">
                  <p className="text-[#9fb7a7]">Recomendación</p>
                  <h4 className="mt-2 text-lg font-bold text-[#ecfff1]">
                    {irrigationRecommendation}
                  </h4>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#1c2a22] bg-[#0f1713] p-6 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-2xl bg-[#101914] p-3 text-[#7CFF6B]">
                    <Power size={18} />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#ecfff1]">
                    Control de bomba
                  </h3>
                </div>

                <div className="rounded-[24px] border border-[#1c2a22] bg-[#0b120f] p-5">
                  <p className="text-[#9fb7a7]">Estado actual</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#ecfff1]">
                      {pumpActive ? "Encendida" : "Apagada"}
                    </span>
                    <span
                      className={`rounded-full px-4 py-1 text-sm font-medium ${
                        pumpActive
                          ? "bg-[#7CFF6B] text-[#08110b] shadow-[0_0_18px_rgba(124,255,107,0.18)]"
                          : "bg-[#101914] text-[#d7eadb]"
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
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#7CFF6B] px-4 py-4 text-lg font-semibold text-[#08110b] shadow-[0_0_18px_rgba(124,255,107,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Play size={18} />
                      Encender
                    </button>

                    <button
                      onClick={() => sendCommand("APAGAR_BOMBA")}
                      disabled={commandLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#2f1d1d] bg-[#1a1010] px-4 py-4 text-lg font-semibold text-[#ffd6d6] transition hover:border-red-500/40 hover:bg-[#221414] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Square size={18} />
                      Apagar
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-[#1c2a22] bg-[#0b120f] px-4 py-4 text-sm text-[#d7eadb]">
                    Tu rol puede visualizar el estado, pero no controlar la bomba.
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-[#1c2a22] bg-[#0f1713] p-6 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-2xl bg-[#101914] p-3 text-[#7CFF6B]">
                    <AlertTriangle size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#ecfff1]">
                    Observaciones
                  </h3>
                </div>

                <ul className="space-y-3 text-sm text-[#9fb7a7]">
                  <li>
                    • Si temperatura u humedad ambiente salen en “Sin dato”, revisa el
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