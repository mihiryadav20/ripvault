"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useBalance } from "@/context/balance-context"
import { toast } from "sonner"
import {
  setPendingPurchase,
  clearPendingPurchase,
  clearPackIntent,
} from "@/lib/pack-intent"
import { PACK_CONFIG, PackTier, TCGType } from "@/lib/packs"

interface RipCard {
  name: string
  imageUrl: string
  rarity?: string
}

export function useRipExperience() {
  const router = useRouter()
  const { balance, refreshBalance } = useBalance()
  const [isPurchasing, setIsPurchasing] = useState(false)

  const purchaseAndRip = useCallback(
    async (
      tcg: TCGType,
      tier: PackTier,
      onInsufficientBalance?: () => void
    ): Promise<boolean> => {
      const packConfig = PACK_CONFIG[tier]
      const currentBalance = balance ?? 0

      // Check balance
      if (currentBalance < packConfig.price) {
        // Store pending purchase intent
        setPendingPurchase(tcg, tier)

        toast.error("Insufficient Balance", {
          description: `You need ₹${packConfig.price - currentBalance} more. Add funds to continue.`,
        })

        onInsufficientBalance?.()
        return false
      }

      setIsPurchasing(true)

      try {
        const response = await fetch("/api/packs/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            packId: `${tcg}-${tier}`,
            tcg,
            tier,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to purchase pack")
        }

        const data = await response.json()
        const cards: RipCard[] = data.cards

        // Clear any stored intents
        clearPackIntent()
        clearPendingPurchase()

        // Refresh balance
        await refreshBalance()

        // Encode cards for URL
        const cardsParam = encodeURIComponent(JSON.stringify(cards))

        // Navigate to rip experience
        router.push(`/dashboard/rip/${tcg}-${tier}?cards=${cardsParam}`)

        return true
      } catch (error) {
        toast.error("Purchase Failed", {
          description:
            error instanceof Error ? error.message : "Something went wrong",
        })
        return false
      } finally {
        setIsPurchasing(false)
      }
    },
    [balance, refreshBalance, router]
  )

  return {
    purchaseAndRip,
    isPurchasing,
  }
}
