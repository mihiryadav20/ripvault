import Image from "next/image"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserButton } from "@/components/auth/user-button"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen">
      <header className="border-b p-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Image
            src="/ripvault.png"
            alt="RIP Vault"
            width={28}
            height={28}
            className="rounded-md"
          />
          RIP Vault
        </Link>
        <UserButton />
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}
