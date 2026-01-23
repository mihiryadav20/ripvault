"use client"

import { useState, useEffect } from "react"
import { Pack, TCGType, TCG_INFO, generatePacks } from "@/lib/packs"
import { PackCard } from "./pack-card"
import { useBalance } from "@/context/balance-context"
import { useRipExperience } from "@/hooks/use-rip-experience"
import { AddFundsDialog } from "@/components/payment/add-funds-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PacksGridProps {
  tcg: TCGType
  autoOpenPackId?: string
  onAutoOpenComplete?: () => void
}

const tierImages: Record<string, string> = {
  starter: "/pack1.png",
  premium: "/pack2.png",
  legend: "/pack3.png",
}

const grailImages: Record<TCGType, string> = {
  pokemon: "/pok_grail.png",
  scryfall: "/magic_grail.png",
  yugioh: "/yug_grail.png",
}

function getPackImage(tcg: TCGType, tier: string): string {
  if (tier === "grail") {
    return grailImages[tcg]
  }
  return tierImages[tier] || "/pack1.png"
}

export function PacksGrid({ tcg, autoOpenPackId, onAutoOpenComplete }: PacksGridProps) {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { balance } = useBalance()
  const { purchaseAndRip, isPurchasing } = useRipExperience()
  const packs = generatePacks(tcg)
  const tcgInfo = TCG_INFO[tcg]
  const currentBalance = balance ?? 0

  // Handle auto-open
  useEffect(() => {
    if (autoOpenPackId) {
      const pack = packs.find((p) => p.id === autoOpenPackId)
      if (pack) {
        setSelectedPack(pack)
        setIsDialogOpen(true)
        onAutoOpenComplete?.()
      }
    }
  }, [autoOpenPackId, packs, onAutoOpenComplete])

  const handlePackClick = (pack: Pack) => {
    setSelectedPack(pack)
    setIsDialogOpen(true)
  }

  const handleRipNow = async () => {
    if (!selectedPack) return

    await purchaseAndRip(selectedPack.tcg, selectedPack.tier, () => {
      // This callback is called when balance is insufficient
      // The dialog stays open and user can use Add Funds
    })
  }

  const handleDialogClose = (open: boolean) => {
    if (!isPurchasing) {
      setIsDialogOpen(open)
      if (!open) {
        setSelectedPack(null)
      }
    }
  }

  const insufficientBalance = selectedPack ? currentBalance < selectedPack.price : false
  const amountNeeded = selectedPack ? selectedPack.price - currentBalance : 0

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-normal">{tcgInfo.name} Packs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            onPurchase={handlePackClick}
            disabled={false}
          />
        ))}
      </div>

      {/* Pack Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          {selectedPack && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPack.name}</DialogTitle>
                <DialogDescription>{selectedPack.description}</DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {/* Pack image */}
                <div className="relative h-48 rounded-lg overflow-hidden mb-4 bg-muted">
                  <Image
                    src={getPackImage(selectedPack.tcg, selectedPack.tier)}
                    alt={selectedPack.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Pack details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Game:</span>
                    <span className="ml-2 font-medium">{tcgInfo.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tier:</span>
                    <span className="ml-2 font-medium capitalize">
                      {selectedPack.tier}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cards:</span>
                    <span className="ml-2 font-medium">
                      {selectedPack.cardCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <span className="ml-2 font-medium">
                      ₹{selectedPack.price}
                    </span>
                  </div>
                </div>

                {/* Balance info */}
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Balance:</span>
                    <span className="font-medium">₹{currentBalance}</span>
                  </div>
                  {insufficientBalance && (
                    <p className="text-sm text-destructive mt-2">
                      You need ₹{amountNeeded} more to rip this pack.
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                  disabled={isPurchasing}
                >
                  Cancel
                </Button>

                {insufficientBalance ? (
                  <AddFundsDialog
                    packIntent={{ tcg: selectedPack.tcg, tier: selectedPack.tier }}
                    suggestedAmount={Math.max(amountNeeded, 100)}
                  >
                    <Button>Add ₹{Math.max(amountNeeded, 100)}</Button>
                  </AddFundsDialog>
                ) : (
                  <Button onClick={handleRipNow} disabled={isPurchasing}>
                    {isPurchasing ? "Ripping..." : "Rip Now"}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
