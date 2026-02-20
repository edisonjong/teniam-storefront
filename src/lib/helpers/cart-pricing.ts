import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@/lib/helpers/get-product-price"

export type ItemPricing = {
    unitPrice: number | null
    comparePrice: number | null
    totalPrice: number | null
}

export function getItemPricing(item: HttpTypes.StoreCartLineItem): ItemPricing {
    let unitPrice: number | null = null
    let comparePrice: number | null = null

    if (item.unit_price !== undefined && item.unit_price !== null) {
        unitPrice = item.unit_price
        if (item.product) {
            const { cheapestPrice } = getProductPrice({ product: item.product })
            if (
                cheapestPrice?.original_price_number &&
                cheapestPrice.original_price_number > unitPrice
            ) {
                comparePrice = cheapestPrice.original_price_number
            }
        }
    } else if (item.product) {
        const { cheapestPrice } = getProductPrice({ product: item.product })
        if (cheapestPrice) {
            unitPrice = cheapestPrice.calculated_price_number
            comparePrice = cheapestPrice.original_price_number || null
        }
    }

    const totalPrice = unitPrice ? unitPrice * item.quantity : null
    return { unitPrice, comparePrice, totalPrice }
}

export const getDiscountPercent = (price: number, comparePrice: number | null) => {
    if (!comparePrice) return null
    return Math.round(((comparePrice - price) / comparePrice) * 100)
}
