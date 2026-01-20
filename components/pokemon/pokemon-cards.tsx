"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface PokemonCard {
  id: string
  name: string
  image: string
  rarity: string
  price: number | null
  setName: string
  setLogo: string
}

interface PokemonCardsResponse {
  cards: PokemonCard[]
  page: number
  pageSize: number
  totalCount: number
  hasMore: boolean
}

export function PokemonCards() {
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const fetchCards = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pokemon/cards?page=1&pageSize=15`)

      if (!response.ok) {
        throw new Error("Failed to fetch cards")
      }

      const data: PokemonCardsResponse = await response.json()
      setCards(data.cards)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cards")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

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
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-contain"
                sizes="176px"
              />
            </div>
            <div className="p-2 space-y-1.5">
              <h3 className="font-semibold text-sm truncate" title={card.name}>
                {card.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <Image
                  src={card.setLogo}
                  alt={card.setName}
                  width={32}
                  height={12}
                  className="object-contain h-3 w-auto"
                />
                <span className="text-xs text-muted-foreground truncate" title={card.setName}>
                  {card.setName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-1.5 py-0.5 bg-secondary rounded-full truncate max-w-[60%]">
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
          href="/dashboard/packs"
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
