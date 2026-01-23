"use client"

import { useEffect, useState, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { TCG_INFO, PACK_CONFIG, PackTier, TCGType } from "@/lib/packs"
import { isValidPackId } from "@/lib/pack-intent"
import { cn } from "@/lib/utils"

interface RipCard {
  name: string
  imageUrl: string
  rarity?: string
}

// Rarity-based glow colors
function getRarityColor(rarity?: string): string {
  if (!rarity) return "text-white/30"
  const lower = rarity.toLowerCase()
  if (lower.includes("common")) return "text-gray-400"
  if (lower.includes("uncommon")) return "text-green-400"
  if (lower.includes("rare")) return "text-blue-400"
  if (lower.includes("ultra") || lower.includes("secret")) return "text-purple-400"
  if (lower.includes("legend") || lower.includes("mythic")) return "text-yellow-400"
  if (lower.includes("holo") || lower.includes("foil")) return "text-pink-400"
  return "text-white/50"
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
  const [phase, setPhase] = useState<"ripping" | "revealed">("ripping")
  const [isLoading, setIsLoading] = useState(true)
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set())

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

  // Handle reveal animation - flip all cards with staggered delay
  const handleRevealAll = () => {
    setPhase("revealed")

    // Stagger the card reveals
    cards.forEach((_, index) => {
      setTimeout(() => {
        setRevealedCards(prev => new Set([...prev, index]))
      }, index * 150) // 150ms delay between each card
    })
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

  const allRevealed = revealedCards.size === cards.length

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Rip GIF Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/rip.gif"
          alt="Rip animation"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
        {phase === "ripping" && (
          <div className="text-center animate-scale-in">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              style={{ fontFamily: "Oswald" }}
            >
              Your Pack is Ripped!
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              {tcgInfo?.name} {packConfig?.name}
            </p>
            <Button
              size="lg"
              onClick={handleRevealAll}
              className="text-lg px-8 py-6"
            >
              Reveal All Cards
            </Button>
          </div>
        )}

        {phase === "revealed" && (
          <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center animate-fade-in">
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                style={{ fontFamily: "Oswald" }}
              >
                {allRevealed ? "Pack Complete!" : "Revealing..."}
              </h1>
              <p className="text-lg text-gray-300 mt-2">
                {tcgInfo?.name} {packConfig?.name} - {cards.length} cards
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
              {cards.map((card, index) => {
                const isRevealed = revealedCards.has(index)
                const rarityColor = getRarityColor(card.rarity)

                return (
                  <div
                    key={index}
                    className="perspective-1000"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={cn(
                        "relative aspect-[2.5/3.5] transition-transform duration-700 transform-style-preserve-3d",
                        isRevealed && "rotate-y-180"
                      )}
                    >
                      {/* Card Back */}
                      <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 border-2 border-white/20 shadow-xl">
                        <div className="h-full flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            <span
                              className="text-2xl font-bold text-white/40"
                              style={{ fontFamily: "Oswald" }}
                            >
                              ?
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Front */}
                      <div
                        className={cn(
                          "absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden shadow-xl",
                          isRevealed && "animate-glow-pulse",
                          rarityColor
                        )}
                      >
                        <Image
                          src={card.imageUrl}
                          alt={card.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 18vw"
                        />
                      </div>
                    </div>

                    {/* Card Name (shown after reveal) */}
                    {isRevealed && (
                      <div className="mt-2 text-center animate-fade-in">
                        <p className="text-white text-xs md:text-sm font-medium truncate">
                          {card.name}
                        </p>
                        {card.rarity && (
                          <p className={cn("text-xs truncate", rarityColor)}>
                            {card.rarity}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action Buttons (shown after all cards revealed) */}
            {allRevealed && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in">
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}
