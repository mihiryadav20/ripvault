"use client"

import { BalanceProvider } from "@/context/balance-context"
import { ReactNode } from "react"

export function BalanceProviderWrapper({ children }: { children: ReactNode }) {
  return <BalanceProvider>{children}</BalanceProvider>
}
