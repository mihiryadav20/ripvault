"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Package, Layers, Sparkles } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Rip Packs, Reveal Graded Gems",
    description: "Open premium card packs and discover rare collectibles",
    icon: Package,
    gradient: "from-violet-600 to-indigo-600",
  },
  {
    id: 2,
    title: "Build Your Collection",
    description: "Collect Pokemon, Magic: The Gathering, and Yu-Gi-Oh! cards",
    icon: Layers,
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    id: 3,
    title: "Trade & Earn",
    description: "Marketplace coming soon - trade cards with other collectors",
    icon: Sparkles,
    gradient: "from-orange-600 to-rose-600",
  },
]

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  return (
    <div className="w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <Card className="border-0 shadow-none">
                <CardContent
                  className={`flex aspect-[3/1] md:aspect-[4/1] items-center justify-center p-6 rounded-xl bg-gradient-to-r ${slide.gradient}`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white text-center md:text-left">
                    <div className="size-16 md:size-20 rounded-full bg-white/20 flex items-center justify-center">
                      <slide.icon className="size-8 md:size-10" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-3xl font-bold mb-2">{slide.title}</h2>
                      <p className="text-sm md:text-lg text-white/80">{slide.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 border-0 text-white hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 border-0 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  )
}
