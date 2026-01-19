import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">RIP Vault</h1>
        <p className="text-muted-foreground">Your secure vault application</p>
      </div>

      <div className="flex gap-4">
        {session?.user ? (
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
