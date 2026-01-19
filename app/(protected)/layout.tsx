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
    redirect("/login")
  }

  return (
    <div className="min-h-screen">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="font-semibold">RIP Vault</h1>
        <UserButton />
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}
