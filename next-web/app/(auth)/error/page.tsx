"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react"
import { motion } from "motion/react"

function AuthErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorType = searchParams.get("error")

  // Map NextAuth error types to user-friendly messages
  let errorMessage =
    "An unexpected authentication error occurred. Please try again."
  let errorTitle = "Authentication Failed"

  if (errorType === "Configuration") {
    errorTitle = "Server Configuration Error"
    errorMessage =
      "There is a problem with the server configuration. Please contact support or check back later."
  } else if (errorType === "AccessDenied") {
    errorTitle = "Access Denied"
    errorMessage =
      "Access was denied. You may not have permission to sign in, or your account might be inactive."
  } else if (errorType === "Verification") {
    errorTitle = "Verification Token Expired"
    errorMessage =
      "The authentication token is invalid or has expired. Please request a new login link."
  } else if (errorType === "CredentialsSignin") {
    errorTitle = "Invalid Credentials"
    errorMessage =
      "Invalid username or password. Please double-check your credentials and try again."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-md"
    >
      <Card className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 p-0 shadow-2xl backdrop-blur-xl">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="relative mb-6 flex items-center justify-center">
            <div className="absolute h-16 w-16 animate-ping rounded-full border border-red-500/20 opacity-25" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
              <AlertCircleIcon className="h-6 w-6" />
            </div>
          </div>

          <h1 className="text-md mb-2 font-mono font-bold tracking-tight text-white uppercase">
            {errorTitle}
          </h1>

          <p className="mb-8 max-w-xs font-sans text-xs leading-relaxed text-white/40">
            {errorMessage}
          </p>

          <Button
            onClick={() => router.push("/signin")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-500 py-2.5 font-mono text-xs font-bold text-white uppercase transition-all hover:bg-cyan-400 active:scale-[0.98]"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] animate-pulse items-center justify-center font-mono text-xs tracking-wider text-white/40 uppercase">
          Loading Error Information...
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
