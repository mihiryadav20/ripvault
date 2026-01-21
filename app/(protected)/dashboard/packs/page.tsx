"use client"

import { useEffect, useState, useCallback } from "react"
import { PacksGrid } from "@/components/packs/packs-grid"
import { Wallet } from "lucide-react"

export default function PacksPage() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetch("/api/user/balance")
      if (response.ok) {
        const data = await response.json()
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Packs</h1>
          <p className="text-muted-foreground">
            Purchase packs to add cards to your collection
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
          <Wallet className="size-5 text-primary" />
          <span className="font-semibold">
            {loading ? "..." : `$${balance.toFixed(2)}`}
          </span>
        </div>
      </div>

      <PacksGrid tcg="pokemon" balance={balance} onBalanceUpdate={fetchBalance} />
      <PacksGrid tcg="scryfall" balance={balance} onBalanceUpdate={fetchBalance} />
      <PacksGrid tcg="yugioh" balance={balance} onBalanceUpdate={fetchBalance} />
    </div>
  )
}
