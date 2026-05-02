import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getAlertasRequest() {
  const response = await api.get("/alertas/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createAlertaRequest(payload) {
  const response = await api.post("/alertas/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateAlertaRequest(id, payload) {
  const response = await api.put(`/alertas/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteAlertaRequest(id) {
  const response = await api.delete(`/alertas/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}