import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

interface YugiohCard {
  id: number
  name: string
  type: string
  desc: string
  race: string
  card_images: Array<{
    id: number
    image_url: string
    image_url_small: string
    image_url_cropped: string
  }>
  card_prices: Array<{
    cardmarket_price: string
    tcgplayer_price: string
    ebay_price: string
    amazon_price: string
    coolstuffinc_price: string
  }>
  atk?: number
  def?: number
  level?: number
  attribute?: string
}

interface YugiohResponse {
  data: YugiohCard[]
}

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const num = parseInt(searchParams.get("num") || "15")
    const offset = parseInt(searchParams.get("offset") || "0")

    const response = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?num=${num}&offset=${offset}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Yu-Gi-Oh cards")
    }

    const data: YugiohResponse = await response.json()

    const cards = data.data.map((card) => ({
      id: card.id.toString(),
      name: card.name,
      image: card.card_images[0]?.image_url || "",
      type: card.type,
      race: card.race,
      price: card.card_prices[0]?.tcgplayer_price
        ? parseFloat(card.card_prices[0].tcgplayer_price)
        : null,
      atk: card.atk,
      def: card.def,
      level: card.level,
      attribute: card.attribute,
    }))

    return NextResponse.json({
      cards,
      num,
      offset,
    })
  } catch (error) {
    console.error("Fetch Yu-Gi-Oh cards error:", error)
    return NextResponse.json(
      { error: "Failed to fetch Yu-Gi-Oh cards" },
      { status: 500 }
    )
  }
}
