"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface ScryfallCard {
  id: string
  name: string
  image: string
  rarity: string
  price: number | null
  setName: string
  typeLine: string
}

interface ScryfallCardsResponse {
  cards: ScryfallCard[]
  page: number
  totalCount: number
  hasMore: boolean
}

export function ScryfallCards() {
  const [cards, setCards] = useState<ScryfallCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const fetchCards = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/scryfall/cards?page=1`)

      if (!response.ok) {
        throw new Error("Failed to fetch cards")
      }

      const data: ScryfallCardsResponse = await response.json()
      setCards(data.cards.slice(0, 15))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cards")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "mythic":
        return "bg-orange-500/20 text-orange-400"
      case "rare":
        return "bg-yellow-500/20 text-yellow-400"
      case "uncommon":
        return "bg-slate-400/20 text-slate-300"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => fetchCards()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex-shrink-0 w-44 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-[2.5/3.5]">
              {card.image ? (
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-contain"
                  sizes="176px"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="p-2 space-y-1.5">
              <h3 className="font-semibold text-sm truncate" title={card.name}>
                {card.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate" title={card.typeLine}>
                {card.typeLine}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${getRarityColor(card.rarity)}`}>
                  {card.rarity}
                </span>
                <span className="text-sm font-medium text-green-500">
                  {card.price ? `$${card.price.toFixed(2)}` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* See More Card */}
        <Link
          href="/dashboard/collection"
          className="flex-shrink-0 w-44 bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col items-center justify-center gap-3 min-h-[280px] hover:bg-accent"
        >
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ChevronRight className="size-6 text-primary" />
          </div>
          <span className="font-medium text-sm">See More</span>
        </Link>
      </div>
    </div>
  )
}
