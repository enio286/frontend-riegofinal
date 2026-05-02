import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getLecturasBateriaRequest() {
  const response = await api.get("/lecturas-bateria/", {
    headers: getAuthHeader(),
  })
  return response.data
}