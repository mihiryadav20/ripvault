import { auth } from "@/lib/auth"
import { PokemonCards } from "@/components/pokemon/pokemon-cards"
import Script from "next/script"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="beforeInteractive"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name ?? session?.user?.email}!
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pokemon Cards</h2>
          <PokemonCards />
        </div>
      </div>
    </>
  )
}
