import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getPrediosRequest() {
  const response = await api.get("/predios/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createPredioRequest(payload) {
  const response = await api.post("/predios/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updatePredioRequest(id, payload) {
  const response = await api.put(`/predios/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deletePredioRequest(id) {
  const response = await api.delete(`/predios/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}