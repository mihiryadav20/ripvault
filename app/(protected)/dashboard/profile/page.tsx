import { auth } from "@/lib/auth"
import { User, Mail, Calendar } from "lucide-react"
import Image from "next/image"

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start gap-6">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "Profile"}
              width={80}
              height={80}
              className="rounded-full"
            />
          ) : (
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="size-10 text-primary" />
            </div>
          )}

          <div className="space-y-4 flex-1">
            <div>
              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-muted-foreground">RipVault Member</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span>{user?.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground" />
                <span>Member since {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Account Settings</h3>
        <p className="text-muted-foreground text-sm">
          Account settings and preferences will be available here soon.
        </p>
      </div>
    </div>
  )
}
