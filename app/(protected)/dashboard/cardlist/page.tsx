import { PokemonCards } from "@/components/pokemon/pokemon-cards"
import { ScryfallCards } from "@/components/scryfall/scryfall-cards"
import { YugiohCards } from "@/components/yugioh/yugioh-cards"
import { HeroCarousel } from "@/components/dashboard/hero-carousel"
import Script from "next/script"

export default async function DashboardPage() {
  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="beforeInteractive"
      />
      <div className="space-y-8 w-full max-w-full overflow-hidden">
        <HeroCarousel />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pokemon Cards</h2>
          <PokemonCards />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Magic: The Gathering Cards</h2>
          <ScryfallCards />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Yu-Gi-Oh! Cards</h2>
          <YugiohCards />
        </div>
      </div>
    </>
  )
}
