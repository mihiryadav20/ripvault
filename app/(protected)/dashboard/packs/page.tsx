import { Package } from "lucide-react"

export default function PacksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Packs</h1>
        <p className="text-muted-foreground">
          Browse and open card packs
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Package className="size-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md">
          Card packs will be available here. You&apos;ll be able to purchase and open packs to collect rare cards.
        </p>
      </div>
    </div>
  )
}
