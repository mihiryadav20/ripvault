import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

interface ScryfallCard {
  id: string
  name: string
  image_uris?: {
    small: string
    normal: string
    large: string
    png: string
    art_crop: string
    border_crop: string
  }
  card_faces?: Array<{
    image_uris?: {
      small: string
      normal: string
      large: string
      png: string
      art_crop: string
      border_crop: string
    }
  }>
  prices: {
    usd: string | null
    usd_foil: string | null
    eur: string | null
  }
  set_name: string
  rarity: string
  type_line: string
}

interface ScryfallResponse {
  object: string
  total_cards: number
  has_more: boolean
  next_page?: string
  data: ScryfallCard[]
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const query = searchParams.get("q") || "c:white mv=1"

    const response = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "RipVault/1.0",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Scryfall cards")
    }

    const data: ScryfallResponse = await response.json()

    const cards = data.data.map((card) => {
      const imageUri = card.image_uris?.large
        || card.card_faces?.[0]?.image_uris?.large
        || ""

      return {
        id: card.id,
        name: card.name,
        image: imageUri,
        rarity: card.rarity,
        price: card.prices.usd ? parseFloat(card.prices.usd) : null,
        setName: card.set_name,
        typeLine: card.type_line,
      }
    })

    return NextResponse.json({
      cards,
      page,
      totalCount: data.total_cards,
      hasMore: data.has_more,
    })
  } catch (error) {
    console.error("Fetch Scryfall cards error:", error)
    return NextResponse.json(
      { error: "Failed to fetch Scryfall cards" },
      { status: 500 }
    )
  }
}
