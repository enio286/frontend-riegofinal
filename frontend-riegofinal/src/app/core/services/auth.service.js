import api from "../utils/api"
import {
  saveTokens,
  saveUser,
  clearSession,
  getRefreshToken,
} from "./storage.service"
import { getAuthHeader } from "./authHeader.service"

export async function loginRequest(username, password) {
  const tokenResponse = await api.post("/token/", {
    username,
    password,
  })

  const { access, refresh } = tokenResponse.data
  saveTokens(access, refresh)

  const meResponse = await api.get("/auth/me/", {
    headers: getAuthHeader(),
  })

  saveUser(meResponse.data)

  return meResponse.data
}

export async function meRequest() {
  const response = await api.get("/auth/me/", {
    headers: getAuthHeader(),
  })

  saveUser(response.data)
  return response.data
}

export async function refreshTokenRequest() {
  const refresh = getRefreshToken()

  const response = await api.post("/token/refresh/", {
    refresh,
  })

  const { access } = response.data
  saveTokens(access, refresh)

  return access
}

export function logoutRequest() {
  clearSession()
}