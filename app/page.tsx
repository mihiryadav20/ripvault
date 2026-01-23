"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { TCG_INFO } from "@/lib/packs"
import { setPackIntent } from "@/lib/pack-intent"
import { AnimatedPackCard } from "@/components/packs/animated-pack-card"

const tierImages: Record<string, string> = {
  legend: "/pack3.png",
  premium: "/pack2.png",
  starter: "/pack1.png",
}

const grailImages: Record<string, string> = {
  pokemon: "/pok_grail.png",
  scryfall: "/magic_grail.png",
  yugioh: "/yug_grail.png",
}

function getPackImage(tcg: string, tier: string): string {
  if (tier === "grail") {
    return grailImages[tcg] || "/pack4.png"
  }
  return tierImages[tier] || "/pack1.png"
}

const tierConfigs = [
  {
    id: "grail",
    title: "Grail Cards",
    description: "The rarest and most valuable cards from all TCGs",
    price: 500,
    cardCount: 10
  },
  {
    id: "legend",
    title: "Legendary Cards",
    description: "Powerful and sought-after cards from each universe",
    price: 200,
    cardCount: 7
  },
  {
    id: "premium",
    title: "Premium Cards",
    description: "High-quality cards with great value",
    price: 100,
    cardCount: 5
  }
]

const tcgs = ["pokemon", "scryfall", "yugioh"] as const

interface CardDetails {
  title: string;
  tcg: string;
  tier: string;
  cardCount: number;
  description: string;
  image: string;
  price: number;
}

export default function Home() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null)

  const openCardDialog = (tierId: string, tcg: string) => {
    const tcgInfo = TCG_INFO[tcg as keyof typeof TCG_INFO]
    const tier = tierConfigs.find(t => t.id === tierId) || tierConfigs[0]

    setSelectedCard({
      title: `${tcgInfo.name} ${tier.title}`,
      tcg,
      tier: tierId,
      cardCount: tier.cardCount,
      description: tier.description,
      image: getPackImage(tcg, tierId),
      price: tier.price
    })
    setIsDialogOpen(true)
  }

  const handleRipNow = () => {
    if (selectedCard) {
      // Store intent in localStorage for after login
      setPackIntent(selectedCard.tcg, selectedCard.tier)
    }
    setIsDialogOpen(false)
    // Include pack parameter in callback URL
    const packId = selectedCard ? `${selectedCard.tcg}-${selectedCard.tier}` : ''
    router.push(`/auth/login?callbackUrl=/dashboard/packs${packId ? `?pack=${packId}` : ''}`)
  }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/ripvault.gif"
            alt="RipVault Showcase"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-semibold leading-tight text-white" style={{ fontFamily: "Oswald" }}>
            Chase the Grail with RipVault
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mt-4 max-w-3xl" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Premium cards. Insured storage. Rip packs, reveal graded gems, and build a collection that holds real value.
          </p>
          <Link
            href="/auth/login"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mt-8 text-lg"
          >
            Get Started with RipVault ➤
          </Link>
        </div>
      </div>

      {/* Card Carousels */}
      <div className="container mx-auto px-1 pt-6 pb-12 space-y-8">
        {tierConfigs.map((tier) => (
          <section key={tier.id} className="space-y-4">
            {/* Commented out headers
            <div className="text-left pl-4">
              <h2 className="text-3xl font-bold">
                {tier.title} : <span className="text-muted-foreground font-normal text-2xl">{tier.description}</span>
              </h2>
            </div>
            */}
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-1 py-4">
                {tcgs.map((tcg) => {
                  const tcgInfo = TCG_INFO[tcg]
                  return (
                    <CarouselItem key={tcg} className="pl-1 md:basis-1/2 lg:basis-1/3">
                      <AnimatedPackCard
                        tier={tier.id}
                        tcg={tcg}
                        cardCount={tier.id === 'grail' ? 10 : tier.id === 'legend' ? 7 : 5}
                        price={tier.id === 'grail' ? 500 : tier.id === 'legend' ? 200 : 100}
                        description={tier.description}
                        onViewDetails={() => openCardDialog(tier.id, tcg)}
                      />
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </section>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Collection?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of collectors who trust RipVault for their most valuable cards.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">
              Create Free Account
            </Link>
          </Button>
        </div>
      </div>

      {/* Card Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCard.title}</DialogTitle>
                <DialogDescription>
                  {selectedCard.description}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image
                    src={selectedCard.image}
                    alt={selectedCard.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 ${TCG_INFO[selectedCard.tcg as keyof typeof TCG_INFO].bgColor} mix-blend-multiply`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Card Game</h4>
                    <p className="text-sm text-muted-foreground">
                      {TCG_INFO[selectedCard.tcg as keyof typeof TCG_INFO].name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Tier</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedCard.tier}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Cards</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCard.cardCount} cards per pack
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Rarity</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedCard.tier === 'grail' 
                        ? 'Ultra Rare' 
                        : selectedCard.tier === 'legend' 
                          ? 'Rare' 
                          : 'Uncommon'}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={handleRipNow}
                >
                  Rip Now
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
