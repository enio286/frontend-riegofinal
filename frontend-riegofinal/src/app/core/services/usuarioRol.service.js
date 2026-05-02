import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getUsuariosRolesRequest() {
  const response = await api.get("/usuarios-roles/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createUsuarioRolRequest(payload) {
  const response = await api.post("/usuarios-roles/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateUsuarioRolRequest(id, payload) {
  const response = await api.put(`/usuarios-roles/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteUsuarioRolRequest(id) {
  const response = await api.delete(`/usuarios-roles/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}