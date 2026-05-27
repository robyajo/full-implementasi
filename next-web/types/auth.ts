export interface User {
  id: string
  username: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  role: string
  provider: string
  isActive: boolean
  emailVerified: boolean
  emailVerifiedAt: string | null
  googleId: string | null
  discordId: string | null
  createdAt: string
  updatedAt: string
  profile?: UserProfile | null
  gems?: number
}

export interface UserProfile {
  bio: string | null
  whatsapp: string | null
  instagram: string | null
  tiktok: string | null
  youtube: string | null
  website: string | null
}

export interface Tokens {
  accessToken: string
  refreshToken: string
  wsToken?: string
}

export interface AuthResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface AuthError {
  status: string
  message: string
  errors?: Record<string, string[]>
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginData {
  user: User
  tokens: Tokens
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  displayName?: string
}

export interface RegisterData {
  user: User
  tokens: Tokens
}

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshData {
  accessToken: string
  refreshToken: string
}

export interface UpdateProfileRequest {
  displayName?: string
  bio?: string
  whatsapp?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  website?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface AuthSession {
  user: User
  tokens: Tokens
}
