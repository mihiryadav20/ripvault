"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface BalanceContextType {
  balance: number | null
  isLoading: boolean
  refreshBalance: () => Promise<void>
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshBalance = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/balance")
      const data = await response.json()
      if (response.ok) {
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshBalance()
  }, [refreshBalance])

  return (
    <BalanceContext.Provider value={{ balance, isLoading, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance() {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider")
  }
  return context
}
