import { getAccessToken } from "./storage.service"

export function getAuthHeader() {
  const token = getAccessToken()

  if (!token) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}