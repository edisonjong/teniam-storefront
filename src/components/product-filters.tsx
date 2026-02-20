"use client"

import { Button, Chip, Input, StarRating } from "@/components/atoms"
import { Accordion, FilterCheckboxOption } from "@/components/molecules"
import useFilters from "@/hooks/useFilters"
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { ProductListingActiveFilters } from "@/components/organisms/ProductListingActiveFilters/ProductListingActiveFilters"
import useGetAllSearchParams from "@/hooks/useGetAllSearchParams"
import { SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { HttpTypes } from "@medusajs/types"
import { SellerProps } from "@/types/seller"
import { useFacets } from "@/contexts/FacetsContext"

export type FacetModel = {
  count: number
  value: string
  label: string
}

interface ProductFiltersProps {
  activeFiltersCount: number
  products?: (HttpTypes.StoreProduct & { seller?: SellerProps })[]
}

export function ProductFilters({ activeFiltersCount, products = [] }: ProductFiltersProps) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const { allSearchParams } = useGetAllSearchParams()
  const { facets } = useFacets()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="tonal" size="small" className="flex gap-2 bg-transparent border border-sidebar-border rounded-md px-5 h-9">
          <SlidersHorizontal className="h-4 w-auto" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-background">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                // Clear all filters
                const url = new URL(window.location.href)
                url.searchParams.delete('min_price')
                url.searchParams.delete('max_price')
                url.searchParams.delete('size')
                url.searchParams.delete('color')
                url.searchParams.delete('condition')
                url.searchParams.delete('rating')
                window.location.href = url.toString()
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset All
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-4">
          <div className="hidden md:block">
            <ProductListingActiveFilters />
          </div>
          
          <PriceFilter />
          <SizeFilter items={facets["variants.size"]} />
          <ColorFilter items={facets["variants.color"]} />
          <ConditionFilter items={facets["variants.condition"]} />
        </div>

        <div className="sticky bottom-0 mt-6 flex gap-3 bg-background pt-4 pb-2 border-t">
          <Button
            variant="tonal"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ConditionFilter({ items }: { items: FacetModel[] }) {
  const { updateFilters, isFilterActive } = useFilters("condition")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }
  
  return (
    <Accordion heading="Condition">
      <ul className="px-4">
        {items && Object.entries(items).map(([label, count]) => (
          <li key={label} className="mb-4">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function ColorFilter({ items }: { items: FacetModel[] }) {
  const { updateFilters, isFilterActive } = useFilters("color")

  const selectHandler = (option: string) => {
    updateFilters(option)
  }
  
  return (
    <Accordion heading="Color">
      <ul className="px-4">
        {items && Object.entries(items).map(([label, count]) => (
          <li key={label} className="mb-4 flex items-center justify-between">
            <FilterCheckboxOption
              checked={isFilterActive(label)}
              disabled={Boolean(!count)}
              onCheck={selectHandler}
              label={label}
            />
            <div
              style={{ backgroundColor: label.toLowerCase() }}
              className={cn(
                "w-5 h-5 border border-primary rounded-xs",
                Boolean(!label) && "opacity-30"
              )}
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function SizeFilter({ items }: { items: FacetModel[] }) {
  const { updateFilters, isFilterActive } = useFilters("size")

  const selectSizeHandler = (size: string) => {
    updateFilters(size)
  }

  return (
    <Accordion heading="Size">
      <ul className="grid grid-cols-4 mt-2 gap-2">
        {items && Object.entries(items).map(([label]) => (
          <li key={label} className="mb-4">
            <Chip
              selected={isFilterActive(label)}
              onSelect={() => selectSizeHandler(label)}
              value={label}
              className="w-full !justify-center !py-2 !font-normal"
            />
          </li>
        ))}
      </ul>
    </Accordion>
  )
}

function PriceFilter() {
  const [min, setMin] = useState("")
  const [max, setMax] = useState("")

  const updateSearchParams = useUpdateSearchParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMin(searchParams.get("min_price") || "")
    setMax(searchParams.get("max_price") || "")
  }, [searchParams])

  const updateMinPriceHandler = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    updateSearchParams("min_price", min)
  }

  const updateMaxPriceHandler = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>
  ) => {
    e.preventDefault()
    updateSearchParams("max_price", max)
  }
  
  return (
    <Accordion heading="Price">
      <div className="flex gap-2 mb-4">
        <form method="POST" onSubmit={updateMinPriceHandler}>
          <Input
            placeholder="Min"
            onChange={(e) => setMin(e.target.value)}
            value={min}
            onBlur={(e) => {
              setTimeout(() => {
                updateMinPriceHandler(e)
              }, 500)
            }}
            type="number"
            className="no-arrows-number-input"
          />
          <input type="submit" className="hidden" />
        </form>
        <form method="POST" onSubmit={updateMaxPriceHandler}>
          <Input
            placeholder="Max"
            onChange={(e) => setMax(e.target.value)}
            onBlur={(e) => {
              setTimeout(() => {
                updateMaxPriceHandler(e)
              }, 500)
            }}
            value={max}
            type="number"
            className="no-arrows-number-input"
          />
          <input type="submit" className="hidden" />
        </form>
      </div>
    </Accordion>
  )
}
