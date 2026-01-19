import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export async function UserButton() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name ?? "User"}
            className="size-8 rounded-full"
          />
        )}
        <span className="text-sm">{session.user.name ?? session.user.email}</span>
      </div>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <Button variant="outline" size="sm" type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  )
}
