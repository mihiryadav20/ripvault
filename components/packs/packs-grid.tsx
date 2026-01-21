"use client"

import { useState } from "react"
import { Pack, TCGType, TCG_INFO, generatePacks } from "@/lib/packs"
import { PackCard } from "./pack-card"
import { toast } from "sonner"
import { useBalance } from "@/context/balance-context"

interface PacksGridProps {
  tcg: TCGType
}

export function PacksGrid({ tcg }: PacksGridProps) {
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const { balance, refreshBalance } = useBalance()
  const packs = generatePacks(tcg)
  const tcgInfo = TCG_INFO[tcg]

  const currentBalance = balance ?? 0

  const handlePurchase = async (pack: Pack) => {
    if (currentBalance < pack.price) {
      toast.error("Insufficient Balance", {
        description: `You need ₹${pack.price - currentBalance} more to purchase this pack.`,
      })
      return
    }

    setPurchasing(pack.id)

    try {
      const response = await fetch("/api/packs/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId: pack.id, tcg: pack.tcg, tier: pack.tier }),
      })

      if (!response.ok) {
        throw new Error("Failed to purchase pack")
      }

      const data = await response.json()

      toast.success("Pack Purchased!", {
        description: `You got ${data.cards.length} cards! Check your collection.`,
      })

      refreshBalance()
    } catch {
      toast.error("Purchase Failed", {
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-normal">{tcgInfo.name} Packs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            onPurchase={handlePurchase}
            disabled={purchasing === pack.id || currentBalance < pack.price}
          />
        ))}
      </div>
    </div>
  )
}
