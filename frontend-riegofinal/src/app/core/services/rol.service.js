import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getRolesRequest() {
  const response = await api.get("/roles/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createRolRequest(payload) {
  const response = await api.post("/roles/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateRolRequest(id, payload) {
  const response = await api.put(`/roles/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteRolRequest(id) {
  const response = await api.delete(`/roles/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}