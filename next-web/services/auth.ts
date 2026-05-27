import axios from "@/lib/axios"
import type {
  AuthResponse,
  LoginRequest,
  LoginData,
  RegisterRequest,
  RegisterData,
  RefreshData,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "@/types/auth"

export async function login(
  data: LoginRequest
): Promise<AuthResponse<LoginData>> {
  const res = await axios.post<AuthResponse<LoginData>>(
    "/api/v1/auth/login",
    data
  )
  return res.data
}

export async function register(
  data: RegisterRequest
): Promise<AuthResponse<RegisterData>> {
  const res = await axios.post<AuthResponse<RegisterData>>(
    "/api/v1/auth/register",
    data
  )
  return res.data
}

export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse<RefreshData>> {
  const res = await axios.post<AuthResponse<RefreshData>>(
    "/api/v1/auth/refresh",
    { refreshToken }
  )
  return res.data
}

export async function getMe(accessToken: string): Promise<AuthResponse<User>> {
  const res = await axios.get<AuthResponse<User>>("/api/v1/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return res.data
}

export async function updateProfile(
  accessToken: string,
  data: UpdateProfileRequest
): Promise<AuthResponse<User>> {
  const res = await axios.patch<AuthResponse<User>>(
    "/api/v1/auth/profile",
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return res.data
}

export async function changePassword(
  accessToken: string,
  data: ChangePasswordRequest
): Promise<AuthResponse<{ message: string }>> {
  const res = await axios.post<AuthResponse<{ message: string }>>(
    "/api/v1/auth/change-password",
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return res.data
}

export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<AuthResponse<{ message: string }>> {
  const res = await axios.post<AuthResponse<{ message: string }>>(
    "/api/v1/auth/forgot-password",
    data
  )
  return res.data
}

export async function resetPassword(
  data: ResetPasswordRequest
): Promise<AuthResponse<{ message: string }>> {
  const res = await axios.post<AuthResponse<{ message: string }>>(
    "/api/v1/auth/reset-password",
    data
  )
  return res.data
}

export async function sendVerification(
  accessToken: string
): Promise<AuthResponse<{ message: string }>> {
  const res = await axios.post<AuthResponse<{ message: string }>>(
    "/api/v1/auth/send-verification",
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return res.data
}

export async function logout(
  accessToken: string,
  refreshToken: string
): Promise<AuthResponse<{ message: string }>> {
  const res = await axios.post<AuthResponse<{ message: string }>>(
    "/api/v1/auth/logout",
    { refreshToken },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return res.data
}

export async function logoutAll(
  accessToken: string
): Promise<AuthResponse<{ message: string }>> {
  const res = await axios.post<AuthResponse<{ message: string }>>(
    "/api/v1/auth/logout-all",
    {},
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
  return res.data
}
