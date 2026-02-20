import { SellerInfo } from "@/components/molecules"
import { SellerProps } from "@/types/seller"
import { HttpTypes } from "@medusajs/types"

export const ProductDetailsSeller = ({ 
  seller, 
  product 
}: { 
  seller?: SellerProps 
  product?: HttpTypes.StoreProduct & { seller?: SellerProps }
}) => {
  if (!seller) return null

  return (
    <div className="border rounded-sm">
      <div>
          <div className="flex justify-between">
            <SellerInfo seller={seller} product={product} showArrow bottomBorder />
          </div>
      </div>
    </div>
  )
}
