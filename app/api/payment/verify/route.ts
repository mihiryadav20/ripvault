import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCashfreeOrderStatus } from "@/lib/cashfree"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (transaction.status === "SUCCESS") {
      return NextResponse.json({
        status: "SUCCESS",
        message: "Payment already verified",
      })
    }

    const orderStatus = await getCashfreeOrderStatus(orderId)

    if (orderStatus.order_status === "PAID") {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { orderId },
          data: {
            status: "SUCCESS",
            paymentMethod: orderStatus.payments?.[0]?.payment_method
              ? Object.keys(orderStatus.payments[0].payment_method)[0]
              : "unknown",
          },
        }),
        prisma.user.update({
          where: { id: session.user.id },
          data: {
            balance: {
              increment: transaction.amount,
            },
          },
        }),
      ])

      return NextResponse.json({
        status: "SUCCESS",
        message: "Payment verified and balance updated",
      })
    }

    if (orderStatus.order_status === "EXPIRED" || orderStatus.order_status === "TERMINATED") {
      await prisma.transaction.update({
        where: { orderId },
        data: { status: "FAILED" },
      })

      return NextResponse.json({
        status: "FAILED",
        message: "Payment failed or expired",
      })
    }

    return NextResponse.json({
      status: orderStatus.order_status,
      message: "Payment is pending",
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
