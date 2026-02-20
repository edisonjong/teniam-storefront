"use client"

import type * as React from "react"
import type { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FeedbackDialog } from "@/components/feedback-dialog"
import { CountrySelector } from "@/components/country-selector"
import { HttpTypes } from "@medusajs/types"

export function NavSecondary({
  items,
  regions = [],
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
  regions?: HttpTypes.StoreRegion[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.title === "Feedback" ? (
                <FeedbackDialog>
                  <SidebarMenuButton size="sm" className="cursor-pointer">
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </FeedbackDialog>
              ) : (
                <SidebarMenuButton asChild size="sm">
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
          {regions.length > 0 && (
            <SidebarMenuItem>
              <CountrySelector regions={regions} />
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
