import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getAccessUsersRequest() {
  const response = await api.get("/access-users/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createAccessUserRequest(payload) {
  const response = await api.post("/access-users/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateAccessUserRequest(id, payload) {
  const response = await api.put(`/access-users/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteAccessUserRequest(id) {
  const response = await api.delete(`/access-users/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}