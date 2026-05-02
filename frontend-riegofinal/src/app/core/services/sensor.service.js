import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getSensoresRequest() {
  const response = await api.get("/sensores/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createSensorRequest(payload) {
  const response = await api.post("/sensores/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateSensorRequest(id, payload) {
  const response = await api.put(`/sensores/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteSensorRequest(id) {
  const response = await api.delete(`/sensores/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}