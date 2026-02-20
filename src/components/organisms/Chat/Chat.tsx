"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react" 
import { HttpTypes } from "@medusajs/types"

import { Button } from "@/components/atoms"
import { ChatBox } from "@/components/cells/ChatBox/ChatBox"
import { Modal } from "@/components/molecules"
import { SellerProps } from "@/types/seller"

const TALKJS_APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID || ""

export const Chat = ({
  user,
  seller,
  buttonClassNames,
  product,
  subject,
  order_id,
  variant = "filled",
  buttonSize = "large",
}: {
  user: HttpTypes.StoreCustomer | null
  seller: SellerProps
  buttonClassNames?: string
  product?: HttpTypes.StoreProduct
  subject?: string
  order_id?: string
  variant?: "tonal" | "filled" | "outline" | "text"
  buttonSize?: "small" | "large"
}) => {
  const [modal, setModal] = useState(false)

  if (!TALKJS_APP_ID) return null

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setModal(true)}
        /* - group: triggers child transitions
           - hover:bg-black: turns background black on hover
           - rounded-full: pill shape from image_70b8de.png
        */
        className={`group justify-center bg-foreground/20 rounded-xl flex items-center gap-2 transition-all hover:bg-black ${buttonClassNames}`}
        size={buttonSize}
      >
        {/* Icon: turns light (white) on hover */}
        <MessageCircle className="h-5 w-5 stroke-2 text-black group-hover:text-white transition-colors" />
        
        {/* Text: remains black, becoming "unseen" against the black background */}
        <span className="font-medium tracking-tight text-black group-hover:text-white transition-colors">
          Contact Seller
        </span>
      </Button>

      {/* Standard Fleek Modal/TalkJS Logic */}
      {modal && (
        <Modal heading="Chat" onClose={() => setModal(false)}>
          <div className="px-4">
            <ChatBox
              order_id={order_id}
              product_id={product?.id}
              subject={subject || product?.title || null}
              currentUser={{
                id: user?.id || "",
                name: `${user?.first_name} ${user?.last_name}` || "",
                email: user?.email || null,
                photoUrl: "/talkjs-placeholder.jpg",
                role: "customer",
              }}
              supportUser={{
                id: seller?.id || "",
                name: seller?.name || "",
                email: seller?.email || null,
                photoUrl: seller.photo || "/talkjs-placeholder.jpg",
                role: "seller",
              }}
            />
          </div>
        </Modal>
      )}
    </>
  )
}