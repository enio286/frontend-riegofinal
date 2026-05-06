import api from "../utils/api"
import { getAuthHeader } from "./authHeader.service"

export async function getAccessRolesRequest() {
  const response = await api.get("/access-roles/", {
    headers: getAuthHeader(),
  })
  return response.data
}