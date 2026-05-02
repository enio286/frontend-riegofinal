import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getDevicesRequest() {
  const response = await api.get("/dispositivos/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createDeviceRequest(payload) {
  const response = await api.post("/dispositivos/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function updateDeviceRequest(id, payload) {
  const response = await api.put(`/dispositivos/${id}/`, payload, {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function deleteDeviceRequest(id) {
  const response = await api.delete(`/dispositivos/${id}/`, {
    headers: getAuthHeader(),
  })
  return response.data
}