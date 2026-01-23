"use client"

import { useEffect, useState, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RipCardReveal } from "@/components/rip/rip-card-reveal"
import { Loader2 } from "lucide-react"
import { TCG_INFO, PACK_CONFIG, PackTier, TCGType } from "@/lib/packs"
import { isValidPackId } from "@/lib/pack-intent"

interface RipCard {
  name: string
  imageUrl: string
  rarity?: string
}

export default function RipExperiencePage({
  params,
}: {
  params: Promise<{ packId: string }>
}) {
  const { packId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cards, setCards] = useState<RipCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [phase, setPhase] = useState<"ripping" | "revealing" | "complete">(
    "ripping"
  )
  const [isLoading, setIsLoading] = useState(true)

  // Parse packId to get tcg and tier
  const [tcg, tier] = packId.split("-") as [TCGType, PackTier]
  const tcgInfo = TCG_INFO[tcg]
  const packConfig = PACK_CONFIG[tier]

  useEffect(() => {
    // Validate pack ID
    if (!isValidPackId(packId)) {
      router.push("/dashboard/packs")
      return
    }

    // Get cards from URL params (passed after purchase)
    const cardsParam = searchParams.get("cards")
    if (cardsParam) {
      try {
        const parsedCards = JSON.parse(decodeURIComponent(cardsParam))
        if (Array.isArray(parsedCards) && parsedCards.length > 0) {
          setCards(parsedCards)
          setIsLoading(false)
        } else {
          router.push("/dashboard/packs")
        }
      } catch {
        router.push("/dashboard/packs")
      }
    } else {
      router.push("/dashboard/packs")
    }
  }, [searchParams, router, packId])

  // Handle rip animation completion
  const handleRipComplete = () => {
    setPhase("revealing")
  }

  const handleCardRevealed = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1)
    } else {
      setPhase("complete")
    }
  }

  const handleRipAnother = () => {
    router.push("/dashboard/packs")
  }

  const handleViewCollection = () => {
    router.push("/dashboard/collection")
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <Loader2 className="size-12 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Rip GIF Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/rip.gif"
          alt="Rip animation"
          fill
          className={`object-cover transition-opacity duration-1000 ${
            phase === "ripping" ? "opacity-100" : "opacity-30"
          }`}
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
        {phase === "ripping" && (
          <div className="text-center animate-scale-in">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              style={{ fontFamily: "Oswald" }}
            >
              Ripping...
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              {tcgInfo?.name} {packConfig?.name}
            </p>
            <Button
              size="lg"
              onClick={handleRipComplete}
              className="text-lg px-8 py-6"
            >
              Reveal Cards
            </Button>
          </div>
        )}

        {phase === "revealing" && cards[currentCardIndex] && (
          <RipCardReveal
            card={cards[currentCardIndex]}
            onRevealed={handleCardRevealed}
            cardNumber={currentCardIndex + 1}
            totalCards={cards.length}
          />
        )}

        {phase === "complete" && (
          <div className="text-center space-y-6 animate-fade-in">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              style={{ fontFamily: "Oswald" }}
            >
              Pack Complete!
            </h1>
            <p className="text-xl text-gray-300">
              You revealed {cards.length} cards from your {tcgInfo?.name}{" "}
              {packConfig?.name}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                size="lg"
                variant="outline"
                onClick={handleViewCollection}
                className="min-w-[180px]"
              >
                View Collection
              </Button>
              <Button
                size="lg"
                onClick={handleRipAnother}
                className="min-w-[180px]"
              >
                Rip Another Pack
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
