import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getLecturasHumedadRequest() {
  const response = await api.get("/lecturas-humedad/", {
    headers: getAuthHeader(),
  })
  return response.data
}