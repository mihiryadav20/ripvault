import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

interface PokemonCard {
  id: string
  name: string
  rarity: string
  images: {
    small: string
    large: string
  }
  set: {
    name: string
    images: {
      symbol: string
      logo: string
    }
  }
  tcgplayer?: {
    prices?: {
      holofoil?: {
        market: number | null
      }
      reverseHolofoil?: {
        market: number | null
      }
      normal?: {
        market: number | null
      }
    }
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "30")

    const response = await fetch(
      `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon cards")
    }

    const data = await response.json()

    const cards = data.data.map((card: PokemonCard) => ({
      id: card.id,
      name: card.name,
      image: card.images.large,
      rarity: card.rarity || "Unknown",
      price: card.tcgplayer?.prices?.holofoil?.market
        ?? card.tcgplayer?.prices?.reverseHolofoil?.market
        ?? card.tcgplayer?.prices?.normal?.market
        ?? null,
      setName: card.set.name,
      setLogo: card.set.images.logo,
    }))

    return NextResponse.json({
      cards,
      page: data.page,
      pageSize: data.pageSize,
      totalCount: data.totalCount,
      hasMore: data.page * data.pageSize < data.totalCount,
    })
  } catch (error) {
    console.error("Fetch Pokemon cards error:", error)
    return NextResponse.json(
      { error: "Failed to fetch Pokemon cards" },
      { status: 500 }
    )
  }
}
