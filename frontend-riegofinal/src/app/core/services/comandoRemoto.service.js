import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getComandosRemotosRequest() {
  const response = await api.get("/comandos-remotos/", {
    headers: getAuthHeader(),
  })
  return response.data
}

export async function createComandoRemotoRequest(payload) {
  const response = await api.post("/comandos-remotos/", payload, {
    headers: getAuthHeader(),
  })
  return response.data
}