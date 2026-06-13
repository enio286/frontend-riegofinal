import api from "../utils/api"

export async function forgotPasswordRequest(payload) {
  const response = await api.post("/auth/forgot-password/", payload)
  return response.data
}

export async function resetPasswordRequest(payload) {
  const response = await api.post("/auth/reset-password/", payload)
  return response.data
}