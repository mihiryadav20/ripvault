"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface RipCardRevealProps {
  card: {
    name: string
    imageUrl: string
    rarity?: string
  }
  onRevealed: () => void
  cardNumber: number
  totalCards: number
}

export function RipCardReveal({
  card,
  onRevealed,
  cardNumber,
  totalCards,
}: RipCardRevealProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showNext, setShowNext] = useState(false)

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false)
    setShowNext(false)
  }, [card])

  // Auto-flip after a short delay
  useEffect(() => {
    const flipTimer = setTimeout(() => setIsFlipped(true), 800)
    return () => clearTimeout(flipTimer)
  }, [card])

  // Show next button after flip animation
  useEffect(() => {
    if (isFlipped) {
      const showTimer = setTimeout(() => setShowNext(true), 800)
      return () => clearTimeout(showTimer)
    }
  }, [isFlipped])

  const handleNext = () => {
    setIsFlipped(false)
    setShowNext(false)
    setTimeout(onRevealed, 300)
  }

  // Rarity-based glow colors
  const getRarityColor = (rarity?: string): string => {
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

  const rarityColor = getRarityColor(card.rarity)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress indicator */}
      <div className="text-white/70 text-sm font-medium">
        Card {cardNumber} of {totalCards}
      </div>

      {/* Card with 3D flip */}
      <div
        className="perspective-1000 cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div
          className={cn(
            "relative w-64 md:w-72 lg:w-80 aspect-[2.5/3.5] transition-transform duration-700 transform-style-preserve-3d",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 border-2 border-white/20 shadow-2xl">
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                <span
                  className="text-5xl font-bold text-white/40"
                  style={{ fontFamily: "Oswald" }}
                >
                  ?
                </span>
              </div>
              <p className="text-white/40 text-sm">Tap to reveal</p>
            </div>
          </div>

          {/* Card Front */}
          <div
            className={cn(
              "absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-2xl",
              isFlipped && showNext && "animate-glow-pulse",
              rarityColor
            )}
          >
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 256px, (max-width: 1024px) 288px, 320px"
            />
          </div>
        </div>
      </div>

      {/* Card info and next button */}
      {showNext && (
        <div className="text-center space-y-4 animate-fade-in">
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: "Oswald" }}
          >
            {card.name}
          </h2>
          {card.rarity && (
            <span
              className={cn(
                "inline-block px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium",
                rarityColor
              )}
            >
              {card.rarity}
            </span>
          )}
          <div className="pt-2">
            <Button
              onClick={handleNext}
              size="lg"
              className="min-w-[160px]"
            >
              {cardNumber < totalCards ? "Next Card" : "Complete"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
