import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createCashfreeOrder } from "@/lib/cashfree"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const orderId = `order_${Date.now()}_${session.user.id.slice(0, 8)}`
    const returnUrl = `${process.env.CASHFREE_RETURN_URL}?order_id=${orderId}`

    const cashfreeOrder = await createCashfreeOrder({
      orderId,
      orderAmount: amount,
      customerEmail: user.email || "customer@example.com",
      customerPhone: "9999999999",
      customerId: session.user.id,
      customerName: user.name || "Customer",
      returnUrl,
    })

    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        orderId,
        amount,
        status: "PENDING",
        paymentSessionId: cashfreeOrder.payment_session_id,
        cfOrderId: cashfreeOrder.cf_order_id,
      },
    })

    return NextResponse.json({
      orderId,
      paymentSessionId: cashfreeOrder.payment_session_id,
      cfOrderId: cashfreeOrder.cf_order_id,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
