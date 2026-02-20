"use client"

import * as React from "react"
import { Check, ChevronDown, Globe, Loader2 } from "lucide-react" // Added Loader2 for feedback
import ReactCountryFlag from "react-country-flag"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useParams, usePathname, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { updateRegionWithValidation } from "@/lib/data/cart"
import { toast } from "@/lib/helpers/toast"

type CountryOption = {
  country: string
  region: string
  label: string
}

interface CountrySelectorProps {
  regions: HttpTypes.StoreRegion[]
}

export function CountrySelector({ regions }: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false)
  const { locale: countryCode } = useParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Safely derive current path
  const currentPath = React.useMemo(() => {
    return pathname.split(`/${countryCode}`)[1] || ""
  }, [pathname, countryCode])

  const options = React.useMemo(() => {
    if (!regions?.length) return []
    
    return regions
      .map((r) => {
        return (r.countries || []).map((c: any) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .filter(Boolean)
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? "")) as CountryOption[]
  }, [regions])

  const currentCountry = React.useMemo(() => {
    return options?.find((o) => o?.country === countryCode) || options?.[0]
  }, [options, countryCode])

  const handleChange = async (option: CountryOption) => {
    try {
      setOpen(false)
      const result = await updateRegionWithValidation(option.country, currentPath)

      if (result.removedItems.length > 0) {
        const itemsList = result.removedItems.join(", ")
        toast.info({
          title: "Cart updated",
          description: `${itemsList} ${result.removedItems.length === 1 ? "is" : "are"} not available in ${option.label} and ${result.removedItems.length === 1 ? "was" : "were"} removed from your cart.`,
        })
      }

      // Clear the regions cache to force a refresh
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('mercur-regions')
      }

      router.replace(result.newPath)
      router.refresh()
    } catch (error: any) {
      toast.error({
        title: "Error switching region",
        description: error?.message || "Failed to update region. Please try again.",
      })
    }
  }

  // --- THE FIX ---
  // Instead of returning null, we return a disabled button state 
  // so the sidebar item still exists but indicates it's waiting for data.
  if (!options || options.length === 0) {
    return (
      <Button variant="ghost" size="sm" disabled className="w-full justify-start gap-2 px-2 h-9 opacity-50">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground italic">Loading regions...</span>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between gap-2 px-2 h-9">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Ship to</span>
            {currentCountry && (
              <>
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px", // Adjusted size for sidebar fit
                    height: "16px",
                  }}
                  countryCode={currentCountry.country}
                  aria-label={currentCountry.label}
                />
                <span className="font-medium text-sm">{currentCountry.country.toUpperCase()}</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 bg-sidebar border border-sidebar-border z-[9999] pointer-events-auto" align="start" side="bottom" sideOffset={4}>
        <div className="p-2 border-b border-sidebar-border">
          <p className="text-sm font-medium">Shipping to</p>
          <p className="text-xs text-muted-foreground">Select your country</p>
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {options.map((option) => (
            <button
              key={option.country}
              onClick={() => handleChange(option)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent",
                currentCountry?.country === option.country && "bg-accent",
              )}
            >
              {/* @ts-ignore */}
              <ReactCountryFlag
                svg
                style={{
                  width: "20px",
                  height: "20px",
                }}
                countryCode={option.country}
                aria-label={option.label}
              />
              <span className="flex-1 text-left">{option.label}</span>
              <span className="text-muted-foreground text-xs">{option.country.toUpperCase()}</span>
              {currentCountry?.country === option.country && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}