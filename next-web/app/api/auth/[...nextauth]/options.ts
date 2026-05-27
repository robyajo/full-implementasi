import { AuthOptions, User, Account, SessionStrategy, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import { AdapterUser } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "@/lib/axios"
import { checkIsFrozen, recordFailure, resetLimit } from "@/lib/rate-limit"
import type { AuthResponse, LoginData, User as VynixUser } from "@/types/auth"

declare module "next-auth" {
  interface Session {
    data: {
      user: VynixUser
      tokens: {
        accessToken: string
        refreshToken: string
        wsToken?: string
      }
    }
    accessToken: string
    refreshToken: string
  }

  interface User {
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
    accessToken: string
    refreshToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    wsToken?: string
    user: VynixUser
  }
}

function getBackendTokenExp(accessToken: string): number | null {
  try {
    const parts = accessToken.split(".")
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return typeof payload.exp === "number" ? payload.exp : null
  } catch {
    return null
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await axios.post<
      AuthResponse<{ accessToken: string; refreshToken: string }>
    >("/api/v1/auth/refresh", { refreshToken: token.refreshToken })

    if (res.data?.success && res.data?.data) {
      return {
        ...token,
        accessToken: res.data.data.accessToken,
        refreshToken: res.data.data.refreshToken,
      }
    }

    return { ...token, exp: 0 }
  } catch {
    return { ...token, exp: 0 }
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60 * 24 * 7,
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
        accessToken: {},
        refreshToken: {},
      },
      async authorize(credentials) {
        if (credentials?.accessToken && credentials?.refreshToken) {
          try {
            const res = await axios.get<AuthResponse<VynixUser>>(
              "/api/v1/auth/me",
              {
                headers: {
                  Authorization: `Bearer ${credentials.accessToken}`,
                },
              }
            )

            if (res.data?.success && res.data?.data) {
              const user = res.data.data
              return {
                id: user.id,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
                role: user.role,
                provider: user.provider,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                emailVerifiedAt: user.emailVerifiedAt,
                googleId: user.googleId,
                discordId: user.discordId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                accessToken: credentials.accessToken,
                refreshToken: credentials.refreshToken,
              }
            }
            return null
          } catch {
            return null
          }
        }

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required")
        }

        const username = credentials.username.trim()

        const freezeStatus = checkIsFrozen(username)
        if (freezeStatus.frozen) {
          throw new Error(
            `Account is frozen due to too many attempts. Try again in ${freezeStatus.remaining} seconds.`
          )
        }

        try {
          const res = await axios.post<AuthResponse<LoginData>>(
            "/api/v1/auth/login",
            {
              username: username,
              password: credentials.password,
            }
          )

          const contentType = res.headers["content-type"]
          const isJson =
            typeof contentType === "string" &&
            contentType.includes("application/json")

          if (isJson && res.data?.success === true) {
            resetLimit(username)
            const { user, tokens } = res.data.data

            return {
              id: user.id,
              username: user.username,
              email: user.email,
              displayName: user.displayName,
              avatarUrl: user.avatarUrl,
              role: user.role,
              provider: user.provider,
              isActive: user.isActive,
              emailVerified: user.emailVerified,
              emailVerifiedAt: user.emailVerifiedAt,
              googleId: user.googleId,
              discordId: user.discordId,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            }
          }

          recordFailure(username)
          const message = res.data?.message || "Authentication failed"
          throw new Error(message)
        } catch (error: unknown) {
          recordFailure(username)

          const err = error as {
            response?: { data?: { message?: string } }
            message?: string
          }

          if (err.response?.data?.message) {
            throw new Error(err.response.data.message)
          }
          if (err.message) {
            throw error
          }
          throw new Error("Authentication failed")
        }
      },
    }),
  ],

  callbacks: {
    async jwt(params: {
      token: JWT
      account: Account | null
      user?: User | AdapterUser
      trigger?: "update" | string
      session?: Record<string, unknown>
    }) {
      const { token, user, trigger, session } = params

      if (user) {
        const u = user as User
        token.accessToken = u.accessToken
        token.refreshToken = u.refreshToken
        token.user = {
          id: u.id,
          username: u.username,
          email: u.email,
          displayName: u.displayName,
          avatarUrl: u.avatarUrl,
          role: u.role,
          provider: u.provider,
          isActive: u.isActive,
          emailVerified: u.emailVerified,
          emailVerifiedAt: u.emailVerifiedAt,
          googleId: u.googleId ?? null,
          discordId: u.discordId ?? null,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        }
      }

      if (trigger === "update") {
        const s = session as Record<string, unknown> | undefined
        if (s?.user) token.user = s.user as VynixUser
      }

      // Token refresh logic: refresh if backend token expires within 5 minutes
      const backendExp = getBackendTokenExp(token.accessToken)
      const expiry = backendExp ?? (token.exp as number | undefined)
      if (expiry && Date.now() >= expiry * 1000 - 5 * 60 * 1000) {
        return refreshAccessToken(token)
      }

      return token
    },

    async session(params: { session: Session; token: JWT }) {
      const sess = params.session as Session & Record<string, unknown>

      sess.data = {
        user: params.token.user,
        tokens: {
          accessToken: params.token.accessToken,
          refreshToken: params.token.refreshToken,
          wsToken: params.token.wsToken,
        },
      }
      sess.accessToken = params.token.accessToken
      sess.refreshToken = params.token.refreshToken

      delete sess.user

      return sess
    },

    async signIn(params: {
      user: User | AdapterUser
      account: Account | null
    }) {
      if (params.user) return true
      return false
    },

    async redirect(params: { url: string; baseUrl: string }) {
      const { url, baseUrl } = params
      // After sign-in, always go to dashboard
      if (url.includes("/signin") || url === baseUrl) {
        return `${baseUrl}/dashboard`
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`
      try {
        if (new URL(url).origin === baseUrl) return url
      } catch {
        // invalid URL, fall back to baseUrl
      }
      return `${baseUrl}/dashboard`
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
    error: "/error",
  },
}
