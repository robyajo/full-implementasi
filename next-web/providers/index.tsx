"use client"

import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/providers/auth-provider"
import QueryProvider from "@/providers/query-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
