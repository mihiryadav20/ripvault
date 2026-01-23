"use client"

import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setPendingPurchase } from "@/lib/pack-intent"

declare global {
  interface Window {
    Cashfree: (options: { mode: string }) => {
      checkout: (options: {
        paymentSessionId: string
        redirectTarget: string
      }) => Promise<void>
    }
  }
}

interface AddFundsDialogProps {
  onSuccess?: () => void
  children?: React.ReactNode
  packIntent?: { tcg: string; tier: string }
  suggestedAmount?: number
}

export function AddFundsDialog({ onSuccess, children, packIntent, suggestedAmount }: AddFundsDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(suggestedAmount?.toString() || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const presetAmounts = [100, 500, 1000, 5000]

  const handleAddFunds = async () => {
    // Store pack intent if provided (for auto-purchase after payment)
    if (packIntent) {
      setPendingPurchase(packIntent.tcg, packIntent.tier)
    }
    const numAmount = parseFloat(amount)

    if (!numAmount || numAmount < 1) {
      setError("Please enter a valid amount (minimum ₹1)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numAmount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order")
      }

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox",
      })

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      })

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            Add Funds
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>
            Add money to your RIP Vault balance using Cashfree
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (INR)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError("")
              }}
              min="1"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset.toString())}
                disabled={isLoading}
              >
                ₹{preset}
              </Button>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={handleAddFunds}
            disabled={isLoading || !amount}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay ₹${amount || "0"}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
