"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Package,
  MessageSquare,
  RotateCcw,
  MapPin,
  Star,
  Heart,
  Settings,
  LogIn,
} from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { isAuthenticated, user: authUser, openAuthModal, logout } = useAuth()
  const router = useRouter()
  const { locale } = useParams()

  if (!isAuthenticated) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            onClick={() => router.push(`/${locale}/login`)}
          >
            <Avatar className="h-8 w-8 rounded-lg bg-sidebar-accent">
              <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                <LogIn className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-sidebar-foreground">Sign In</span>
              <span className="truncate text-xs text-sidebar-foreground/70">Access your account</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Use auth user data if available
  const displayUser = authUser || user

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={displayUser.avatar || undefined} alt={displayUser.name} />
                <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">{displayUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-sidebar-foreground">{displayUser.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">{displayUser.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-sidebar border-sidebar-border border"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={displayUser.avatar || undefined} alt={displayUser.name} />
                  <AvatarFallback className="rounded-lg">{displayUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayUser.name}</span>
                  <span className="truncate text-xs">{displayUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <LocalizedClientLink href="/user/orders">
                <DropdownMenuItem>
                  <Package />
                  Orders
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/messages">
                <DropdownMenuItem>
                  <MessageSquare />
                  Messages
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/returns">
                <DropdownMenuItem>
                  <RotateCcw />
                  Returns
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/addresses">
                <DropdownMenuItem>
                  <MapPin />
                  Addresses
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/reviews">
                <DropdownMenuItem>
                  <Star />
                  Reviews
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/wishlist">
                <DropdownMenuItem>
                  <Heart />
                  Wishlist
                </DropdownMenuItem>
              </LocalizedClientLink>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <LocalizedClientLink href="/user">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/billing">
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/notifications">
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </LocalizedClientLink>
              <LocalizedClientLink href="/user/settings">
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </LocalizedClientLink>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
