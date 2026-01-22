"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { TCG_INFO } from "@/lib/packs"

const tierImages = {
  starter: "/pack1.png",
  premium: "/pack2.png",
  legend: "/pack3.png",
  grail: "/pack4.png",
}

interface AnimatedPackCardProps {
  tier: string
  tcg: string
  cardCount: number
  price: number
  description: string
  onViewDetails: () => void
}

export function AnimatedPackCard({ tier, tcg, cardCount, price, description, onViewDetails }: AnimatedPackCardProps) {
  const tcgInfo = TCG_INFO[tcg as keyof typeof TCG_INFO]
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
    <div 
      ref={cardRef}
      onClick={onViewDetails}
      className="bg-card rounded-xl overflow-hidden border border-border shadow-sm transition-all duration-300 h-full flex flex-col cursor-pointer hover:shadow-md"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          ref={imageRef}
          src={tierImages[tier as keyof typeof tierImages]}
          alt={`${tier} ${tcg} pack`}
          fill
          className="object-cover"
        />
        <div className={`absolute inset-0 ${tcgInfo.bgColor} mix-blend-multiply`} />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">
            {tcgInfo.name}
          </h3>
          <Badge 
            variant="outline" 
            className={`${
              tier === 'grail' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
              tier === 'legend' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
              'bg-purple-500/10 text-purple-600 border-purple-500/20'
            }`}
          >
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cards</p>
              <p className="font-medium">{cardCount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">₹{price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
