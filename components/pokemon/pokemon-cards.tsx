"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

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
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = async (pageNum: number, append = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const response = await fetch(`/api/pokemon/cards?page=${pageNum}&pageSize=30`)

      if (!response.ok) {
        throw new Error("Failed to fetch cards")
      }

      const data: PokemonCardsResponse = await response.json()

      if (append) {
        setCards((prev) => [...prev, ...data.cards])
      } else {
        setCards(data.cards)
      }

      setHasMore(data.hasMore)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cards")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchCards(1)
  }, [])

  const handleSeeMore = () => {
    fetchCards(page + 1, true)
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
          onClick={() => fetchCards(1)}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-[2.5/3.5]">
              <Image
                src={card.image}
                alt={card.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm truncate" title={card.name}>
                {card.name}
              </h3>
              <div className="flex items-center gap-2">
                <Image
                  src={card.setLogo}
                  alt={card.setName}
                  width={40}
                  height={16}
                  className="object-contain h-4 w-auto"
                />
                <span className="text-xs text-muted-foreground truncate" title={card.setName}>
                  {card.setName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                  {card.rarity}
                </span>
                <span className="text-sm font-medium text-green-500">
                  {card.price ? `$${card.price.toFixed(2)}` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleSeeMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></span>
                Loading...
              </span>
            ) : (
              "See More"
            )}
          </button>
        </div>
      )}
    </div>
  )
}
