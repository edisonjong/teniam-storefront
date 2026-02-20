import {
  ProductDetailsFooter,
  ProductDetailsHeader,
  ProductDetailsSeller,
  ProductDetailsShipping,
  ProductPageDetails,
  ProductAdditionalAttributes,
} from "@/components/cells"

import { retrieveCustomer } from "@/lib/data/customer"
import { getUserWishlists } from "@/lib/data/wishlist"
import { AdditionalAttributeProps } from "@/types/product"
import { SellerProps } from "@/types/seller"
import { Wishlist } from "@/types/wishlist"
import { HttpTypes } from "@medusajs/types"
import { RotateCcw, ShieldCheck, Truck } from "lucide-react"

export const ProductDetails = async ({
  product,
  locale,
}: {
  product: HttpTypes.StoreProduct & {
    seller?: SellerProps
    attribute_values?: AdditionalAttributeProps[]
  }
  locale: string
}) => {
  const user = await retrieveCustomer()

  let wishlist: Wishlist = {products: []}
  if (user) {
    wishlist = await getUserWishlists({countryCode: locale})
  }

  return (
    <div>
      <ProductDetailsHeader
        product={product}
        locale={locale}
        user={user}
        wishlist={wishlist}
      />
      <ProductPageDetails details={product?.description || ""} />
       {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-4 bg-muted/50 p-4">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">Free Shipping</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <RotateCcw className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">30-Day Returns</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">Buyer Protection</span>
                      </div>
                    </div>
      <ProductAdditionalAttributes
        attributes={product?.attribute_values || []}
      />
      <ProductDetailsShipping />
      <ProductDetailsSeller seller={product?.seller} product={product} />
      <ProductDetailsFooter
        tags={product?.tags || []}
        posted={product?.created_at}
      />
    </div>
  )
}
