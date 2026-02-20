"use client"

import NewProductsListingProductsView from "@/components/molecules/NewProductsListingProductsView/NewProductsListingProductsView"
import { useSearchParams } from "next/navigation"
import { getFacedFilters } from "@/lib/helpers/get-faced-filters"
import { PRODUCT_LIMIT } from "@/const"
import { searchProducts } from "@/lib/data/products"
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductListingProductView from "@/components/molecules/ProductListingProductsView/ProductListingProductsView"
import ProductListingProductsView from "@/components/molecules/ProductListingProductsView/ProductListingProductsView"

interface ProductGridWrapperProps {
  locale: string
  currency_code: string
}

export const ProductGridWrapper = ({ locale, currency_code }: ProductGridWrapperProps) => {
  const searchParams = useSearchParams()
  const facetFilters: string = getFacedFilters(searchParams)
  const query: string = searchParams.get("query") || ""
  const page: number = +(searchParams.get("page") || 1)

  const filters = `NOT seller:null AND NOT seller.store_status:SUSPENDED AND supported_countries:${locale} AND variants.prices.currency_code:${currency_code} AND variants.prices.amount > 0 ${facetFilters}`

  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      if (!locale) return

      try {
        setIsLoading(true)
        const result = await searchProducts({
          query: query || undefined,
          page: page - 1,
          hitsPerPage: PRODUCT_LIMIT,
          filters,
          currency_code,
          countryCode: locale,
        })

        setProducts(result.products)
      } catch (error) {
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [locale, filters, query, page, currency_code])

  if (isLoading && products.length === 0) {
    return (
      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="w-full flex">
              <div className="w-full bg-gray-200 animate-pulse rounded-sm" style={{ height: '300px' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <ProductListingProductsView products={products} />
    </div>
  )
}