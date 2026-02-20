"use client"

import { HttpTypes } from "@medusajs/types"
import { ProductCard } from "@/components/organisms"

interface Props {
  products: HttpTypes.StoreProduct[]
}

const NewProductsListingProductsView = ({ products }: Props) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Responsive Grid Layout:
        - Mobile (< 640px): 1 column (full width)
        - Tablet (640px - 1024px): 1 column (full width)
        - Desktop (1024px+): 4 columns
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="w-full flex"
          >
            <ProductCard
              product={product}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewProductsListingProductsView
