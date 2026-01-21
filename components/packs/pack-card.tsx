"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { Pack, PACK_CONFIG, TCG_INFO } from "@/lib/packs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tierImages = {
  starter: "/pack1.png",
  premium: "/pack2.png",
  legend: "/pack3.png",
  grail: "/pack4.png",
}

interface PackCardProps {
  pack: Pack
  onPurchase: (pack: Pack) => void
  disabled?: boolean
}

export function PackCard({ pack, onPurchase, disabled }: PackCardProps) {
  const tcgInfo = TCG_INFO[pack.tcg]
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastMousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current

    if (!card || !image) return

    let rect: DOMRect
    let centerX: number
    let centerY: number

    const updateCardTransform = (mouseX: number, mouseY: number) => {
      if (!rect) {
        rect = card.getBoundingClientRect()
        centerX = rect.left + rect.width / 2
        centerY = rect.top + rect.height / 2
      }

      const relativeX = mouseX - centerX
      const relativeY = mouseY - centerY

      const cardTransform = {
        rotateX: -relativeY * 0.00984375,
        rotateY: relativeX * 0.00984375,
        scale: 1.00703125,
      }

      const imageTransform = {
        rotateX: -relativeY * 0.00703125,
        rotateY: relativeX * 0.00703125,
        scale: 1.0140625,
      }

      return { cardTransform, imageTransform }
    }

    const animate = () => {
      const { cardTransform, imageTransform } = updateCardTransform(
        lastMousePosition.current.x,
        lastMousePosition.current.y
      )

      card.style.transform = `perspective(1000px) rotateX(${cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg) scale3d(${cardTransform.scale}, ${cardTransform.scale}, ${cardTransform.scale})`
      card.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.2)"

      image.style.transform = `perspective(1000px) rotateX(${imageTransform.rotateX}deg) rotateY(${imageTransform.rotateY}deg) scale3d(${imageTransform.scale}, ${imageTransform.scale}, ${imageTransform.scale})`

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseEnter = () => {
      card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease"
      image.style.transition = "transform 0.2s ease"
      animate()
    }

    const handleMouseLeave = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      card.style.boxShadow = "none"
      card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease"

      image.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      image.style.transition = "transform 0.5s ease"
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <Card ref={cardRef} className="overflow-hidden p-0">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          ref={imageRef}
          src={tierImages[pack.tier]}
          alt={PACK_CONFIG[pack.tier].name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-2xl font-semibold">{PACK_CONFIG[pack.tier].name}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="rounded-sm text-lg">
            {tcgInfo.name}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm">{pack.description}</p>
          <Badge className="bg-green-500 text-white border-0 whitespace-nowrap">
            {pack.cardCount} Cards
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase">Price</span>
          <span className="text-xl font-semibold">₹{pack.price}</span>
        </div>
        <Button size="lg" onClick={() => onPurchase(pack)} disabled={disabled}>
          Purchase
        </Button>
      </CardFooter>
    </Card>
  )
}
