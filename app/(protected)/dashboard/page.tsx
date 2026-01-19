import { auth } from "@/lib/auth"
import { BalanceDisplay } from "@/components/payment/balance-display"
import Script from "next/script"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="beforeInteractive"
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name ?? session?.user?.email}!
          </p>
        </div>

        <BalanceDisplay />
      </div>
    </>
  )
}
