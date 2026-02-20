"use client"

import { HttpTypes } from "@medusajs/types"
import { format } from "date-fns"
import { CheckCircle, Star, Package, Calendar, Clock, MessageCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Chat } from "@/components/organisms/Chat/Chat"

export const SellerPageHeader = ({
  seller,
  user,
}: {
  seller: any
  user: HttpTypes.StoreCustomer | null
}) => {
  // Logic preservation: Calculate rating and count from reviews
  const reviewCount = seller.reviews ? seller.reviews.filter((rev: any) => rev !== null).length : 0
  const rating = seller.reviews && seller.reviews.length > 0
      ? seller.reviews
          .filter((rev: any) => rev !== null)
          .reduce((sum: number, r: any) => sum + (r?.rating || 0), 0) / reviewCount
      : 0

  return (
    <div className="rounded-2xl border bg-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        
        {/* Avatar */}
        <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-2xl">
          <AvatarImage
            src={seller.photo || "/placeholder.svg"}
            alt={seller.name}
            className="object-cover"
          />
          <AvatarFallback className="rounded-2xl text-2xl">
            {seller.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{seller.name}</h1>
              {seller.verified && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
          </div>

          <div 
            className="text-muted-foreground max-w-2xl text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: seller.description }}
          />

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{seller.total_sales || 0} sales</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member since {format(new Date(seller.created_at), "yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Usually responds within 1 hour</span>
            </div>
          </div>
        </div>

        {/* Chat Button - Preserving your user/TalkJS logic */}
     {user && (
  <div className="md:ml-auto">
    <Chat
      user={user}
      seller={seller}
      /* Passing h-12 to ensure it matches your design's height */
      buttonClassNames="h-12 px-6"
    />
  </div>
)}
      </div>
    </div>
  )
}