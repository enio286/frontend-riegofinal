import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getZonasRequest() {
  const response = await api.get("/zonas/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createZonaRequest(payload) {
  const response = await api.post("/zonas/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateZonaRequest(id, payload) {
  const response = await api.put(`/zonas/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteZonaRequest(id) {
  const response = await api.delete(`/zonas/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}