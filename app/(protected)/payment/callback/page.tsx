"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBalance } from "@/context/balance-context"
import { getPendingPurchase, clearPendingPurchase } from "@/lib/pack-intent"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshBalance } = useBalance()
  const [status, setStatus] = useState<"loading" | "success" | "purchasing" | "failed">("loading")
  const [message, setMessage] = useState("")
  const hasVerified = useRef(false)

  useEffect(() => {
    if (hasVerified.current) return

    const orderId = searchParams.get("order_id")

    if (!orderId) {
      setStatus("failed")
      setMessage("No order ID found")
      return
    }

    hasVerified.current = true

    const verifyAndProcess = async () => {
      try {
        // Verify payment
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })

        const data = await response.json()

        if (data.status === "SUCCESS") {
          await refreshBalance()

          // Check for pending pack purchase
          const pendingPurchase = getPendingPurchase()

          if (pendingPurchase) {
            setStatus("purchasing")
            setMessage("Payment successful! Opening your pack...")

            // Attempt auto-purchase
            try {
              const purchaseResponse = await fetch("/api/packs/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  packId: pendingPurchase.packId,
                  tcg: pendingPurchase.packTcg,
                  tier: pendingPurchase.packTier,
                }),
              })

              if (purchaseResponse.ok) {
                const purchaseData = await purchaseResponse.json()
                clearPendingPurchase()
                await refreshBalance()

                // Redirect to rip experience
                const cardsParam = encodeURIComponent(JSON.stringify(purchaseData.cards))
                router.push(`/dashboard/rip/${pendingPurchase.packId}?cards=${cardsParam}`)
                return
              } else {
                // Purchase failed, but payment succeeded
                clearPendingPurchase()
                setStatus("success")
                setMessage("Payment successful! Your balance has been updated. Pack purchase failed - please try again from the packs page.")
              }
            } catch {
              clearPendingPurchase()
              setStatus("success")
              setMessage("Payment successful! Your balance has been updated.")
            }
          } else {
            setStatus("success")
            setMessage("Payment successful! Your balance has been updated.")
          }
        } else if (data.status === "FAILED" || data.status === "EXPIRED") {
          setStatus("failed")
          setMessage(data.message || "Payment failed")
          clearPendingPurchase()
        } else {
          setStatus("failed")
          setMessage("Payment is still pending. Please check back later.")
        }
      } catch {
        setStatus("failed")
        setMessage("Failed to verify payment")
        clearPendingPurchase()
      }
    }

    verifyAndProcess()
  }, [searchParams, refreshBalance, router])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center max-w-md">
        {status === "loading" && (
          <>
            <Loader2 className="size-16 animate-spin mx-auto text-primary" />
            <h1 className="text-2xl font-bold mt-4">Verifying Payment</h1>
            <p className="text-muted-foreground mt-2">Please wait...</p>
          </>
        )}

        {status === "purchasing" && (
          <>
            <Sparkles className="size-16 animate-pulse mx-auto text-primary" />
            <h1 className="text-2xl font-bold mt-4">Opening Your Pack</h1>
            <p className="text-muted-foreground mt-2">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="size-16 mx-auto text-green-500" />
            <h1 className="text-2xl font-bold mt-4">Payment Successful</h1>
            <p className="text-muted-foreground mt-2">{message}</p>
            <Button className="mt-6" onClick={() => router.push("/dashboard/packs")}>
              Go to Packs
            </Button>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="size-16 mx-auto text-destructive" />
            <h1 className="text-2xl font-bold mt-4">Payment Failed</h1>
            <p className="text-muted-foreground mt-2">{message}</p>
            <Button className="mt-6" onClick={() => router.push("/dashboard/packs")}>
              Go to Packs
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
