import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userCards = await prisma.userCard.findMany({
      where: { userId: session.user.id },
      include: {
        cardTemplate: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      cards: userCards.map((uc) => ({
        id: uc.id,
        cardId: uc.cardTemplate.cardId,
        name: uc.cardTemplate.name,
        imageUrl: uc.cardTemplate.imageUrl,
        rarity: uc.cardTemplate.rarity,
        type: uc.cardTemplate.type,
        tcg: uc.cardTemplate.tcg,
        price: uc.cardTemplate.price,
        acquiredAt: uc.createdAt,
      })),
    })
  } catch (error) {
    console.error("Failed to fetch collection:", error)
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    )
  }
}
