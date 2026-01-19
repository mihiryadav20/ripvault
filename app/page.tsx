import { Vault } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
            <Vault className="size-7" />
          </div>
          <h1 className="text-5xl font-bold">RIP Vault</h1>
        </div>
        <Link
          href="/auth/login"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Login
        </Link>
      </div>
    </div>
  )
}
