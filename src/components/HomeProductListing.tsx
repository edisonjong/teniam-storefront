"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Loader2 } from "lucide-react"
import { ProductFilters } from "@/components/product-filters"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface HomeProductListingProps {
  locale: string
  currency_code: string
  AlgoliaComponent: React.ReactNode | null
  StaticComponent: React.ReactNode | null
}

export function HomeProductListing({ 
  locale, 
  currency_code, 
  AlgoliaComponent, 
  StaticComponent 
}: HomeProductListingProps) {
  const router = useRouter()
  const [condition, setCondition] = useState("all")
  const [view, setView] = useState("grid")
  const [error, setError] = useState<string | null>(null)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [facets, setFacets] = useState<Record<string, any>>({})
  
  // Ref to store the actual facets data from AlgoliaProductsListing
  const facetsRef = useRef<Record<string, any>>({})

  // Function to update facets from AlgoliaProductsListing
  const updateFacets = (newFacets: Record<string, any>) => {
    facetsRef.current = newFacets
    setFacets(newFacets)
  }

  // Handle Algolia filtering
  const handleFilterUpdate = async (newFilters: any) => {
    // In a real setup, you'd call searchProducts() here
    // For now, we update the UI state
  }

  return (
    <div className="bg-background flex-1">
      <div className="mx-auto max-w-7xl px-2 py-12 sm:px-6 ">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight">Workspace Essentials</h1>
          <Button variant="ghost" size="icon" onClick={() => setView(view === "grid" ? "list" : "grid")}>
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
              {["all", "new", "used"].map((t) => (
  <Button
    key={t}
    size="sm"
    className={cn(
      "capitalize transition-colors",
      condition === t 
        ? "bg-foreground text-background hover:bg-foreground/90"
        : "bg-background text-foreground border border-input hover:bg-accent"
    )}
    onClick={() => setCondition(t)}
  >
    {t}
  </Button>
))}
          </div>
          <ProductFilters activeFiltersCount={activeFiltersCount} />
        </div>

        {/* Render the appropriate component based on props */}
        {AlgoliaComponent || StaticComponent}
      </div>
    </div>
  )
}
