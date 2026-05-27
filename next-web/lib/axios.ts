import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import https from "https"

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  timeout: 30000,
})

// Client-side 401 interceptor: retry with refreshed token
if (typeof window !== "undefined") {
  let isRefreshing = false
  let pendingRequests: Array<{
    resolve: (token: string) => void
    reject: (err: unknown) => void
  }> = []

  axios.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingRequests.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { getSession } = await import("next-auth/react")
        const session = await getSession()
        const token = (session as Record<string, unknown> | null)
          ?.accessToken as string | undefined

        if (!token) {
          throw new Error("Session expired")
        }

        // Update all pending requests with new token
        pendingRequests.forEach((p) => p.resolve(token))
        pendingRequests = []

        originalRequest.headers.Authorization = `Bearer ${token}`
        return axios(originalRequest)
      } catch (refreshError) {
        pendingRequests.forEach((p) => p.reject(refreshError))
        pendingRequests = []
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}

export default axios
