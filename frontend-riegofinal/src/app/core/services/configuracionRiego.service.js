import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getConfiguracionesRequest() {
  const response = await api.get("/configuraciones-riego/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createConfiguracionRequest(payload) {
  const response = await api.post("/configuraciones-riego/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateConfiguracionRequest(id, payload) {
  const response = await api.put(`/configuraciones-riego/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteConfiguracionRequest(id) {
  const response = await api.delete(`/configuraciones-riego/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}