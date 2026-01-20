import { Layers } from "lucide-react"

export default function CollectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Collection</h1>
        <p className="text-muted-foreground">
          View your card collection
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Layers className="size-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Your Collection is Empty</h2>
        <p className="text-muted-foreground max-w-md">
          Start collecting cards by opening packs. Your cards will appear here once you have them.
        </p>
      </div>
    </div>
  )
}
