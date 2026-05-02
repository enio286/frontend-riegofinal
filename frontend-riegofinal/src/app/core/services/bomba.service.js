import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getBombasRequest() {
  const response = await api.get("/bombas/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createBombaRequest(payload) {
  const response = await api.post("/bombas/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateBombaRequest(id, payload) {
  const response = await api.put(`/bombas/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteBombaRequest(id) {
  const response = await api.delete(`/bombas/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}