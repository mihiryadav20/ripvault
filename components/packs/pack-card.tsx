"use client"

import Image from "next/image"
import { Pack, PACK_CONFIG, TCG_INFO } from "@/lib/packs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tierImages = {
  starter: "/pack1.png",
  premium: "/pack2.png",
  legend: "/pack3.png",
  grail: "/pack4.png",
}

const tierBadgeColors = {
  starter: "bg-slate-500",
  premium: "bg-blue-500",
  legend: "bg-amber-500",
  grail: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
}

interface PackCardProps {
  pack: Pack
  onPurchase: (pack: Pack) => void
  disabled?: boolean
}

export function PackCard({ pack, onPurchase, disabled }: PackCardProps) {
  const tcgInfo = TCG_INFO[pack.tcg]

  return (
    <Card className="overflow-hidden flex flex-col p-0 gap-0">
      <div className="relative aspect-[3/4] bg-muted">
        <Image
          src={tierImages[pack.tier]}
          alt={`${PACK_CONFIG[pack.tier].name}`}
          fill
          className="object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${tierBadgeColors[pack.tier]} text-white border-0`}>
          {pack.cardCount} Cards
        </Badge>
      </div>
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{PACK_CONFIG[pack.tier].name}</h3>
          <Badge variant="outline" className={tcgInfo.color}>
            {tcgInfo.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-muted-foreground">{pack.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-2 pb-4">
        <span className="text-lg font-bold">${pack.price}</span>
        <Button
          onClick={() => onPurchase(pack)}
          disabled={disabled}
          size="sm"
          className={`${pack.tier === "grail" ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600" : ""}`}
        >
          Purchase
        </Button>
      </CardFooter>
    </Card>
  )
}
