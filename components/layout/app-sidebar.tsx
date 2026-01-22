"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  Wallet,
  Plus,
  Package,
  Layers,
  List,
  ShoppingCart,
  User,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { AddFundsDialog } from "@/components/payment/add-funds-dialog"
import { useBalance } from "@/context/balance-context"

const mainNavItems = [
  {
    id: "packs",
    title: "Packs",
    url: "/dashboard/packs",
    icon: Package,
  },
  {
    id: "cardlist",
    title: "Card List",
    url: "/dashboard/cardlist",
    icon: List,
  },
  {
    id: "collection",
    title: "Collection",
    url: "/dashboard/collection",
    icon: Layers,
  },
  {
    id: "marketplace",
    title: "Marketplace",
    url: "/dashboard/marketplace",
    icon: ShoppingCart,
    comingSoon: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { balance, isLoading, refreshBalance } = useBalance()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <Sidebar {...props}>
      {/* Logo Header */}
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="text-3xl font-semibold" style={{ fontFamily: "Oswald" }}>RipVault</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Wallet Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Wallet</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-3">
              <div className="flex items-center gap-2">
                <Wallet className="size-5 text-primary" />
                <div className="text-xl font-bold">
                  {isLoading ? (
                    <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                  ) : (
                    balance !== null ? formatCurrency(balance) : "₹0.00"
                  )}
                </div>
              </div>
              <AddFundsDialog onSuccess={refreshBalance}>
                <Button className="w-full" size="sm">
                  <Plus className="size-4 mr-2" />
                  Deposit
                </Button>
              </AddFundsDialog>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                    tooltip={item.title}
                    className={item.comingSoon ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Link href={item.comingSoon ? "#" : item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.comingSoon && (
                    <SidebarMenuBadge className="bg-primary/10 rounded-full text-xs">
                      Soon
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/profile"}
                  tooltip="Profile"
                >
                  <Link href="/dashboard/profile">
                    <User />
                    <span>{session?.user?.name || "Profile"}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Footer */}
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: "/" })}
              tooltip="Logout"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
