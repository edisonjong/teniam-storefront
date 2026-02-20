"use client"

import { Chat } from "@/components/organisms/Chat/Chat"
import { HttpTypes } from "@medusajs/types"
import { SellerProps } from "@/types/seller"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProductChatButtonProps {
    seller: SellerProps | null
    product?: HttpTypes.StoreProduct
    buttonClassNames?: string
    variant?: "tonal" | "filled"
    buttonSize?: "small" | "large"
    subject?: string
}

export function ProductChatButton({
    seller,
    product,
    buttonClassNames,
    variant = "tonal",
    buttonSize = "small"
}: ProductChatButtonProps) {
    const { customer, isAuthenticated } = useAuth()
    const router = useRouter()

    // Don't render if we don't have the necessary data
    if (!customer || !seller) {
        return null
    }

    // Fallback button for when Chat component doesn't render properly
    const handleChatClick = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to chat with the seller")
            return
        }

        if (!seller || !product) {
            toast.error("Unable to start chat. Please try again.")
            return
        }

        // Navigate to chat page with seller and product info
        router.push(`/chat?sellerId=${seller.id}&productId=${product.id}`)
    }

    const getButtonSizeClass = () => {
        switch (buttonSize) {
            case "small":
                return "px-3 py-1.5 text-sm"
            case "large":
                return "px-6 py-3 text-base"
            default:
                return "px-4 py-2 text-sm"
        }
    }

    const getButtonVariantClass = () => {
        switch (variant) {
            case "tonal":
                return "bg-gray-100 text-gray-900 hover:bg-gray-200"
            case "filled":
                return "bg-blue-600 text-white hover:bg-blue-700"
            default:
                return "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }
    }

    return (
        <Chat
            user={customer}
            seller={seller}
            product={product}
            subject={product ? product.title : "General inquiry"}
            buttonClassNames={buttonClassNames}
            variant={variant}
            buttonSize={buttonSize}
        />
    )
}
