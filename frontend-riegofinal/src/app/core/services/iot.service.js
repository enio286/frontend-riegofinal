import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getLatestTelemetryRequest() {
  const response = await api.get("/iot/telemetria/latest/")
  return response.data
}

export async function sendMqttCommandRequest(payload) {
  const response = await api.post("/iot/comando/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}