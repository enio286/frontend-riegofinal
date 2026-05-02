import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getUsuariosRequest() {
  const response = await api.get("/usuarios/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createUsuarioRequest(payload) {
  const response = await api.post("/usuarios/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateUsuarioRequest(id, payload) {
  const response = await api.put(`/usuarios/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteUsuarioRequest(id) {
  const response = await api.delete(`/usuarios/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}