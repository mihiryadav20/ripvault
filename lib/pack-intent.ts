export interface PackIntent {
  packTcg: string
  packTier: string
  packId: string
  timestamp: number
}

const PACK_INTENT_KEY = "ripvault_pack_intent"
const PENDING_PURCHASE_KEY = "ripvault_pending_purchase"
const INTENT_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes

export function setPackIntent(tcg: string, tier: string): void {
  const intent: PackIntent = {
    packTcg: tcg,
    packTier: tier,
    packId: `${tcg}-${tier}`,
    timestamp: Date.now(),
  }
  localStorage.setItem(PACK_INTENT_KEY, JSON.stringify(intent))
}

export function getPackIntent(): PackIntent | null {
  try {
    const stored = localStorage.getItem(PACK_INTENT_KEY)
    if (!stored) return null

    const intent: PackIntent = JSON.parse(stored)

    // Check if intent has expired
    if (Date.now() - intent.timestamp > INTENT_EXPIRY_MS) {
      clearPackIntent()
      return null
    }

    return intent
  } catch {
    return null
  }
}

export function clearPackIntent(): void {
  localStorage.removeItem(PACK_INTENT_KEY)
}

// For pending purchases (when user adds funds for a specific pack)
export function setPendingPurchase(tcg: string, tier: string): void {
  const pending: PackIntent = {
    packTcg: tcg,
    packTier: tier,
    packId: `${tcg}-${tier}`,
    timestamp: Date.now(),
  }
  localStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(pending))
}

export function getPendingPurchase(): PackIntent | null {
  try {
    const stored = localStorage.getItem(PENDING_PURCHASE_KEY)
    if (!stored) return null

    const pending: PackIntent = JSON.parse(stored)

    // Check if pending purchase has expired
    if (Date.now() - pending.timestamp > INTENT_EXPIRY_MS) {
      clearPendingPurchase()
      return null
    }

    return pending
  } catch {
    return null
  }
}

export function clearPendingPurchase(): void {
  localStorage.removeItem(PENDING_PURCHASE_KEY)
}

// Validate pack ID format
export function isValidPackId(packId: string): boolean {
  const validTcgs = ["pokemon", "scryfall", "yugioh"]
  const validTiers = ["starter", "premium", "legend", "grail"]

  if (!packId || typeof packId !== "string") return false

  const parts = packId.split("-")
  if (parts.length !== 2) return false

  const [tcg, tier] = parts
  return validTcgs.includes(tcg) && validTiers.includes(tier)
}
