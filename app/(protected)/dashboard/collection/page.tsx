"use client"

import { useEffect, useState } from "react"
import { Layers, Loader2 } from "lucide-react"
import Image from "next/image"
import { TCG_INFO, TCGType } from "@/lib/packs"

interface CollectionCard {
  id: string
  cardId: string
  name: string
  imageUrl: string
  rarity: string | null
  type: string | null
  tcg: string
  price: number | null
  acquiredAt: string
}

export default function CollectionPage() {
  const [cards, setCards] = useState<CollectionCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    async function fetchCollection() {
      try {
        const response = await fetch("/api/user/collection")
        if (response.ok) {
          const data = await response.json()
          setCards(data.cards)
        }
      } catch (error) {
        console.error("Failed to fetch collection:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollection()
  }, [])

  const filteredCards = filter === "all"
    ? cards
    : cards.filter(card => card.tcg === filter)

  const tcgCounts = cards.reduce((acc, card) => {
    acc[card.tcg] = (acc[card.tcg] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Collection</h1>
        <p className="text-muted-foreground">
          You have {cards.length} card{cards.length !== 1 ? "s" : ""} in your collection
        </p>
      </div>

      {cards.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All ({cards.length})
          </button>
          {Object.entries(tcgCounts).map(([tcg, count]) => (
            <button
              key={tcg}
              onClick={() => setFilter(tcg)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === tcg
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {TCG_INFO[tcg as TCGType]?.name || tcg} ({count})
            </button>
          ))}
        </div>
      )}

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Layers className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Collection is Empty</h2>
          <p className="text-muted-foreground max-w-md">
            Start collecting cards by opening packs. Your cards will appear here once you have them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="group relative rounded-lg overflow-hidden bg-card border hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="aspect-[2.5/3.5] relative">
                <Image
                  src={card.imageUrl}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate" title={card.name}>
                  {card.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${TCG_INFO[card.tcg as TCGType]?.bgColor || "bg-muted"} ${TCG_INFO[card.tcg as TCGType]?.color || ""}`}>
                    {TCG_INFO[card.tcg as TCGType]?.name || card.tcg}
                  </span>
                  {card.rarity && (
                    <span className="text-[10px] text-muted-foreground truncate max-w-[60px]" title={card.rarity}>
                      {card.rarity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
