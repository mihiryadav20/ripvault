"use client"

import { useEffect, useState } from "react"
import { Wallet, RefreshCw } from "lucide-react"
import { AddFundsDialog } from "./add-funds-dialog"
import { Button } from "@/components/ui/button"

export function BalanceDisplay() {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchBalance = async () => {
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
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Wallet className="size-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Funds</p>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-7 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold">
                {balance !== null ? formatCurrency(balance) : "₹0.00"}
              </p>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={fetchBalance}
              disabled={isLoading}
            >
              <RefreshCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="ml-auto">
        <AddFundsDialog onSuccess={fetchBalance} />
      </div>
    </div>
  )
}
