import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getAccessRolesRequest() {
  const response = await api.get("/access-roles/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createAccessRoleRequest(payload) {
  const response = await api.post("/access-roles/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateAccessRoleRequest(id, payload) {
  const response = await api.put(`/access-roles/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteAccessRoleRequest(id) {
  const response = await api.delete(`/access-roles/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}