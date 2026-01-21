"use client"

import { useState } from "react"
import { Pack, TCGType, TCG_INFO, generatePacks } from "@/lib/packs"
import { PackCard } from "./pack-card"
import { toast } from "sonner"

interface PacksGridProps {
  tcg: TCGType
  balance: number
  onBalanceUpdate: () => void
}

export function PacksGrid({ tcg, balance, onBalanceUpdate }: PacksGridProps) {
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const packs = generatePacks(tcg)
  const tcgInfo = TCG_INFO[tcg]

  const handlePurchase = async (pack: Pack) => {
    if (balance < pack.price) {
      toast.error("Insufficient Balance", {
        description: `You need $${pack.price - balance} more to purchase this pack.`,
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

      onBalanceUpdate()
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
      <div className={`flex items-center gap-2 ${tcgInfo.color}`}>
        <div className={`size-3 rounded-full ${tcgInfo.bgColor.replace("/10", "")}`} />
        <h2 className="text-xl font-semibold">{tcgInfo.name} Packs</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            onPurchase={handlePurchase}
            disabled={purchasing === pack.id || balance < pack.price}
          />
        ))}
      </div>
    </div>
  )
}
