export type PackTier = "starter" | "premium" | "legend" | "grail"

export type TCGType = "pokemon" | "scryfall" | "yugioh"

export interface Pack {
  id: string
  tier: PackTier
  tcg: TCGType
  name: string
  cardCount: number
  price: number
  description: string
}

export const PACK_CONFIG: Record<PackTier, { cardCount: number; price: number; name: string; description: string }> = {
  starter: {
    cardCount: 3,
    price: 50,
    name: "Starter Pack",
    description: "A great way to begin your collection",
  },
  premium: {
    cardCount: 5,
    price: 100,
    name: "Premium Pack",
    description: "Better odds for rare cards",
  },
  legend: {
    cardCount: 7,
    price: 200,
    name: "Legend Pack",
    description: "High chance of legendary cards",
  },
  grail: {
    cardCount: 10,
    price: 500,
    name: "Grail Pack",
    description: "The ultimate pack for serious collectors",
  },
}

export const TCG_INFO: Record<TCGType, { name: string; color: string; bgColor: string }> = {
  pokemon: {
    name: "Pokemon",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
  },
  scryfall: {
    name: "Magic: The Gathering",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  yugioh: {
    name: "Yu-Gi-Oh!",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
  },
}

export function generatePacks(tcg: TCGType): Pack[] {
  const tiers: PackTier[] = ["starter", "premium", "legend", "grail"]

  return tiers.map((tier) => ({
    id: `${tcg}-${tier}`,
    tier,
    tcg,
    name: `${TCG_INFO[tcg].name} ${PACK_CONFIG[tier].name}`,
    cardCount: PACK_CONFIG[tier].cardCount,
    price: PACK_CONFIG[tier].price,
    description: PACK_CONFIG[tier].description,
  }))
}
