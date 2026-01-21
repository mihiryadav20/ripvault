import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PACK_CONFIG, PackTier, TCGType } from "@/lib/packs"

interface CardData {
  cardId: string
  name: string
  imageUrl: string
  rarity?: string
  type?: string
  price?: number
}

// Valid TCG types
const VALID_TCG_TYPES: TCGType[] = ["pokemon", "scryfall", "yugioh"]
const VALID_TIERS: PackTier[] = ["starter", "premium", "legend", "grail"]

async function fetchPokemonCards(count: number): Promise<CardData[]> {
  const randomPage = Math.floor(Math.random() * 100) + 1
  const response = await fetch(
    `https://api.pokemontcg.io/v2/cards?pageSize=${count * 2}&page=${randomPage}`
  )
  const data = await response.json()
  const cards = data.data || []

  const shuffled = cards.sort(() => 0.5 - Math.random()).slice(0, count)

  return shuffled.map((card: { id: string; name: string; images: { small: string }; rarity?: string; types?: string[]; cardmarket?: { prices?: { averageSellPrice?: number } } }) => ({
    cardId: card.id,
    name: card.name,
    imageUrl: card.images.small,
    rarity: card.rarity,
    type: card.types?.[0],
    price: card.cardmarket?.prices?.averageSellPrice,
  }))
}

async function fetchScryfallCards(count: number): Promise<CardData[]> {
  const queries = ["c:white", "c:blue", "c:black", "c:red", "c:green"]
  const randomQuery = queries[Math.floor(Math.random() * queries.length)]
  const randomPage = Math.floor(Math.random() * 5) + 1

  const response = await fetch(
    `https://api.scryfall.com/cards/search?q=${randomQuery}&page=${randomPage}`
  )
  const data = await response.json()
  const cards = data.data || []

  const shuffled = cards.sort(() => 0.5 - Math.random()).slice(0, count)

  return shuffled.map((card: { id: string; name: string; image_uris?: { normal: string }; card_faces?: { image_uris?: { normal: string } }[]; rarity: string; type_line: string; prices?: { usd?: string } }) => ({
    cardId: card.id,
    name: card.name,
    imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || "",
    rarity: card.rarity,
    type: card.type_line,
    price: card.prices?.usd ? parseFloat(card.prices.usd) : undefined,
  }))
}

async function fetchYugiohCards(count: number): Promise<CardData[]> {
  const offset = Math.floor(Math.random() * 1000)
  const response = await fetch(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?num=${count * 2}&offset=${offset}`
  )
  const data = await response.json()
  const cards = data.data || []

  const shuffled = cards.sort(() => 0.5 - Math.random()).slice(0, count)

  return shuffled.map((card: { id: number; name: string; card_images: { image_url: string }[]; type: string; race: string; card_prices?: { tcgplayer_price?: string }[] }) => ({
    cardId: String(card.id),
    name: card.name,
    imageUrl: card.card_images[0]?.image_url || "",
    rarity: card.race,
    type: card.type,
    price: card.card_prices?.[0]?.tcgplayer_price
      ? parseFloat(card.card_prices[0].tcgplayer_price)
      : undefined,
  }))
}

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tcg, tier } = body as { tcg: string; tier: string }

    // Validate tcg and tier
    if (!tcg || !VALID_TCG_TYPES.includes(tcg as TCGType)) {
      return NextResponse.json({ error: "Invalid TCG type" }, { status: 400 })
    }

    if (!tier || !VALID_TIERS.includes(tier as PackTier)) {
      return NextResponse.json({ error: "Invalid pack tier" }, { status: 400 })
    }

    const packConfig = PACK_CONFIG[tier as PackTier]
    const price = packConfig.price
    const cardCount = packConfig.cardCount

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    })

    if (!user || user.balance < price) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    let cards: CardData[] = []

    switch (tcg) {
      case "pokemon":
        cards = await fetchPokemonCards(cardCount)
        break
      case "scryfall":
        cards = await fetchScryfallCards(cardCount)
        break
      case "yugioh":
        cards = await fetchYugiohCards(cardCount)
        break
      default:
        return NextResponse.json({ error: "Invalid TCG" }, { status: 400 })
    }

    console.log(`[Purchase] Fetched ${cards.length} cards for ${tcg}/${tier}`)

    const cardTemplates = await Promise.all(
      cards.map((card) =>
        prisma.cardTemplate.upsert({
          where: { cardId_tcg: { cardId: card.cardId, tcg } },
          update: {
            name: card.name,
            imageUrl: card.imageUrl,
            rarity: card.rarity,
            type: card.type,
            price: card.price,
          },
          create: {
            cardId: card.cardId,
            tcg,
            name: card.name,
            imageUrl: card.imageUrl,
            rarity: card.rarity,
            type: card.type,
            price: card.price,
          },
        })
      )
    )

    console.log(`[Purchase] Created/updated ${cardTemplates.length} card templates`)

    // Create UserCard entries for each card and deduct balance in a single transaction
    const results = await prisma.$transaction([
      ...cardTemplates.map((ct: { id: string }) =>
        prisma.userCard.create({
          data: {
            userId: session.user.id!,
            cardTemplateId: ct.id,
          },
        })
      ),
      prisma.user.update({
        where: { id: session.user.id },
        data: { balance: { decrement: price } },
      }),
    ])

    console.log(`[Purchase] Transaction complete, created ${results.length - 1} user cards`)

    return NextResponse.json({
      success: true,
      cards: cardTemplates.map((c) => ({
        name: c.name,
        imageUrl: c.imageUrl,
        rarity: c.rarity,
      })),
    })
  } catch (error) {
    console.error("Pack purchase error:", error)
    return NextResponse.json({ error: "Failed to purchase pack" }, { status: 500 })
  }
}
