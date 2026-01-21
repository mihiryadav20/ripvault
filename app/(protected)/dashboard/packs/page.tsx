"use client"

import { useEffect, useState, useCallback } from "react"
import { PacksGrid } from "@/components/packs/packs-grid"

export default function PacksPage() {
  const [balance, setBalance] = useState(0)

  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetch("/api/user/balance")
      if (response.ok) {
        const data = await response.json()
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    }
  }, [])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-8xl font-bold">Rip. Reveal. Glory.</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Every pack holds a grail. One tear changes everything.
        </p>
      </div>

      <hr className="border-border" />

      <PacksGrid tcg="pokemon" balance={balance} onBalanceUpdate={fetchBalance} />
      <PacksGrid tcg="scryfall" balance={balance} onBalanceUpdate={fetchBalance} />
      <PacksGrid tcg="yugioh" balance={balance} onBalanceUpdate={fetchBalance} />
    </div>
  )
}
