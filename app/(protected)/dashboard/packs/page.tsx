"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PacksGrid } from "@/components/packs/packs-grid"
import { getPackIntent, clearPackIntent, isValidPackId } from "@/lib/pack-intent"

export default function PacksPage() {
  const searchParams = useSearchParams()
  const [autoOpenPack, setAutoOpenPack] = useState<string | null>(null)

  useEffect(() => {
    // Check URL param first
    const packParam = searchParams.get("pack")
    if (packParam && isValidPackId(packParam)) {
      setAutoOpenPack(packParam)
      // Clear the URL param after reading (for cleaner URL)
      window.history.replaceState({}, "", "/dashboard/packs")
      return
    }

    // Fall back to localStorage intent
    const intent = getPackIntent()
    if (intent && isValidPackId(intent.packId)) {
      setAutoOpenPack(intent.packId)
      clearPackIntent()
    }
  }, [searchParams])

  // Clear auto-open after it's been handled
  const handleAutoOpenComplete = () => {
    setAutoOpenPack(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-8xl font-bold">Rip. Reveal. Glory.</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Every pack holds a grail. One tear changes everything.
        </p>
      </div>

      <hr className="border-border" />

      <PacksGrid
        tcg="pokemon"
        autoOpenPackId={autoOpenPack?.startsWith("pokemon") ? autoOpenPack : undefined}
        onAutoOpenComplete={handleAutoOpenComplete}
      />
      <PacksGrid
        tcg="scryfall"
        autoOpenPackId={autoOpenPack?.startsWith("scryfall") ? autoOpenPack : undefined}
        onAutoOpenComplete={handleAutoOpenComplete}
      />
      <PacksGrid
        tcg="yugioh"
        autoOpenPackId={autoOpenPack?.startsWith("yugioh") ? autoOpenPack : undefined}
        onAutoOpenComplete={handleAutoOpenComplete}
      />
    </div>
  )
}
