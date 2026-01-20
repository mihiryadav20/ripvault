"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Wallet,
  Plus,
  Package,
  Layers,
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { AddFundsDialog } from "@/components/payment/add-funds-dialog"

const mainNavItems = [
  {
    id: "packs",
    title: "Packs",
    url: "/dashboard/packs",
    icon: Package,
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

const secondaryNavItems = [
  {
    id: "profile",
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchBalance = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/balance")
      const data = await response.json()
      if (response.ok) {
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

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
          <Image
            src="/ripvault.png"
            alt="RipVault"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-lg font-semibold" style={{ fontFamily: "Oswald" }}>RipVault</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Wallet Section */}
      <SidebarGroup className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="size-5 text-primary" />
            <span className="text-sm text-muted-foreground">Wallet Balance</span>
          </div>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            ) : (
              balance !== null ? formatCurrency(balance) : "₹0.00"
            )}
          </div>
          <AddFundsDialog onSuccess={fetchBalance}>
            <Button className="w-full" size="sm">
              <Plus className="size-4 mr-2" />
              Deposit
            </Button>
          </AddFundsDialog>
        </div>
      </SidebarGroup>

      <SidebarSeparator />

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    disabled={item.comingSoon}
                    className={item.comingSoon ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Link href={item.comingSoon ? "#" : item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.comingSoon && (
                        <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Logout Footer */}
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: "/" })}
              tooltip="Logout"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
