"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    id: 2,
    src: "/card2.jpg",
    alt: "Premium Trading Cards",
  },
  {
    id: 4,
    src: "/card4.jpg",
    alt: "Card Collection",
  },
]

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative aspect-[16/5] md:aspect-[21/6] w-full">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover object-top"
                  sizes="100vw"
                  priority={slide.id === 1}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/50 border-0 text-white hover:bg-black/70" />
        <CarouselNext className="right-4 bg-black/50 border-0 text-white hover:bg-black/70" />
      </Carousel>
    </div>
  )
}
