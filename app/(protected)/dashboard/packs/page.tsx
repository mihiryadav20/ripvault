"use client"

import { PacksGrid } from "@/components/packs/packs-grid"

export default function PacksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-8xl font-bold">Rip. Reveal. Glory.</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Every pack holds a grail. One tear changes everything.
        </p>
      </div>

      <hr className="border-border" />

      <PacksGrid tcg="pokemon" />
      <PacksGrid tcg="scryfall" />
      <PacksGrid tcg="yugioh" />
    </div>
  )
}
