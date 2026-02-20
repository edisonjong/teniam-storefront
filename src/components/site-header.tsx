"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { SidebarIcon, Search, X, Trash2 } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

import { useAuth } from "@/contexts/auth-context"
import { useCartContext } from "@/components/providers"
import { SearchForm } from "@/components/search-form"
import { CartIcon } from "@/icons"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getDiscountPercent, getItemPricing } from "@/lib/helpers/cart-pricing"
import { convertToLocale } from "@/lib/helpers/money"
import { CartDropdown } from "./cells"

const getFirstImageUrl = (value?: string | null): string | null => {
  if (!value) {
    return null
  }

  if (value.includes(",")) {
    return value.split(",")[0].trim()
  }

  return value
}

const getCartItemImage = (item: HttpTypes.StoreCartLineItem) => {
  const thumb = getFirstImageUrl(item.thumbnail)
  if (thumb) {
    return thumb
  }

  const productImage = getFirstImageUrl(item.product?.images?.[0]?.url)
  if (productImage) {
    return productImage
  }

  return "/placeholder.svg"
}

function getBreadcrumbData(pathname: string) {
  const localeMatch = pathname.match(/^\/([^/]+)\b/)
  const localePrefix = localeMatch ? `/${localeMatch[1]}` : ""

  if (pathname === "/" || pathname === localePrefix || pathname === `${localePrefix}/`) {
    return { parent: null, current: "Home", localePrefix }
  }
  if (pathname.startsWith(`${localePrefix}/product/`) || pathname.startsWith("/product/")) {
    return { parent: { label: "Home", href: "/" }, current: "Product Details" }
  }
  if (pathname.startsWith(`${localePrefix}/seller/`) || pathname.startsWith("/seller/")) {
    return { parent: { label: "Home", href: "/" }, current: "Seller Store" }
  }
  if (pathname === `${localePrefix}/cart` || pathname === "/cart") {
    return { parent: { label: "Home", href: "/" }, current: "Shopping Cart" }
  }
  if (pathname === `${localePrefix}/checkout` || pathname === "/checkout") {
    return { parent: { label: "Cart", href: `${localePrefix || ""}/cart` || "/cart" }, current: "Checkout" }
  }
  return { parent: { label: "Home", href: "/" }, current: "Page" }
}

interface SiteHeaderProps {
  locale: string
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const { toggleSidebar } = useSidebar()
  const { isAuthenticated, openAuthModal } = useAuth()
  const { cart, removeCartItem } = useCartContext()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()
  const breadcrumbData = getBreadcrumbData(pathname)
  const localeMatch = pathname.match(/^\/([^/]+)\b/)
  const localePrefix = localeMatch ? `/${localeMatch[1]}` : ""

  // Debug logging for cart state and click events
  if (typeof window !== 'undefined') {
    console.log('SiteHeader render - isCartOpen:', isCartOpen, 'cart items:', cart?.items?.length || 0)
  }

  // Get cart item count using the same logic as Medusa's CartDropdown
  const getItemCount = (cart: HttpTypes.StoreCart | null) => {
    return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  }


  // Use Medusa cart totals directly instead of manual calculation
  const validItems = cart?.items || []
  const validItemsTotal = cart?.item_subtotal || 0
  const delivery = cart?.shipping_subtotal || 0
  const tax = cart?.tax_total || 0
  const total = cart?.total || 0

  // Debug logging for cart state
  if (typeof window !== 'undefined') {
    console.log('SiteHeader cart state:', {
      cartId: cart?.id,
      itemsCount: cart?.items?.length || 0,
      validItemsCount: validItems.length,
      validItemsTotal,
      delivery,
      tax,
      total
    })
  }

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-sidebar-border border-b">
      <div className="flex h-14 w-full items-center gap-2 px-4">
        <Button className="h-8 w-8 text-foreground" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon className="h-5 w-5" />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-full bg-sidebar-border" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {breadcrumbData.parent && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={breadcrumbData.parent.href}>
                    {breadcrumbData.parent.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              {/* <BreadcrumbPage>{breadcrumbData.current}</BreadcrumbPage> */}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="hidden sm:flex flex-1 justify-center">
          <SearchForm className="w-full max-w-md" />
        </div>

        {isSearchOpen && (
          <div className="absolute inset-0 z-50 flex items-center gap-2 bg-sidebar px-4 sm:hidden">
            <div className="relative flex-1 bg-sidebar">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="h-9 w-full pl-9 pr-4 bg-sidebar text-sidebar placeholder:text-sidebar-foreground"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-foreground hover:text-foreground/80 sm:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <CartDropdown />
        </div>
      </div>
    </header>
  )
}