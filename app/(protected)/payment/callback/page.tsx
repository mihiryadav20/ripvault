"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      setStatus("failed")
      setMessage("No order ID found")
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })

        const data = await response.json()

        if (data.status === "SUCCESS") {
          setStatus("success")
          setMessage("Payment successful! Your balance has been updated.")
        } else if (data.status === "FAILED" || data.status === "EXPIRED") {
          setStatus("failed")
          setMessage(data.message || "Payment failed")
        } else {
          setStatus("failed")
          setMessage("Payment is still pending. Please check back later.")
        }
      } catch {
        setStatus("failed")
        setMessage("Failed to verify payment")
      }
    }

    verifyPayment()
  }, [searchParams])

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

        {status === "success" && (
          <>
            <CheckCircle className="size-16 mx-auto text-green-500" />
            <h1 className="text-2xl font-bold mt-4">Payment Successful</h1>
            <p className="text-muted-foreground mt-2">{message}</p>
            <Button className="mt-6" onClick={() => router.push("/dashboard?refresh=true")}>
              Go to Dashboard
            </Button>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="size-16 mx-auto text-destructive" />
            <h1 className="text-2xl font-bold mt-4">Payment Failed</h1>
            <p className="text-muted-foreground mt-2">{message}</p>
            <Button className="mt-6" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
