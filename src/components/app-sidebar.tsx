"use client"

import * as React from "react"
import {
  Command,
  LifeBuoy,
  Send,
  BookOpen,
  Monitor,
  Keyboard,
  Cpu,
  MonitorSmartphone,
  Headphones,
  Lightbulb,
  Usb,
  Users,
} from "lucide-react"
import { HttpTypes } from "@medusajs/types"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavResources } from "./nav-resources"
import Image from "next/image"
import { useRegions } from "@/hooks/use-regions"
import { listRegions } from "@/lib/data/regions"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
  navResources: [
    {
      title: "Community",
      url: "/community",
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Blogs",
      url: "https://blogs.teniam.com",
      icon: BookOpen,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  categories?: HttpTypes.StoreProductCategory[]
  locale?: string
}

const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('desk') || lowerName.includes('setup')) return Monitor
  if (lowerName.includes('keyboard') || lowerName.includes('input')) return Keyboard
  if (lowerName.includes('pc') || lowerName.includes('component')) return Cpu
  if (lowerName.includes('monitor')) return MonitorSmartphone
  if (lowerName.includes('audio') || lowerName.includes('video')) return Headphones
  if (lowerName.includes('lighting') || lowerName.includes('ambience')) return Lightbulb
  if (lowerName.includes('accessories')) return Usb
  return Monitor // default
}

export function AppSidebar({ categories = [], locale = 'en', ...props }: AppSidebarProps) {
  const { regions } = useRegions()
  
  // Process categories to create proper hierarchy for sidebar
  const navMain = React.useMemo(() => {
    return categories.map((category) => {
      const children = category.category_children || []
      
      return {
        title: category.name,
        url: `/${locale}/categories/${category.handle}`,
        icon: getCategoryIcon(category.name),
        isActive: false,
        items: children.map((child: any) => ({
          title: child.name,
          url: `/${locale}/categories/${child.handle}`,
          // If this child has its own children, include them as sub-items
          subItems: (child.category_children || []).map((grandchild: any) => ({
            title: grandchild.name,
            url: `/${locale}/categories/${grandchild.handle}`,
          })),
        })),
      }
    })
  }, [categories, locale])

  return (
    <Sidebar
      className="!top-[--header-height] !bottom-0 !h-auto border-sidebar-border border"
      {...props}
    >
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={`/${locale}`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src="/mobile-logo.png"
                    alt="Teniam"
                    height={40}
                    width={40}
                    className="size-8 object-cover" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Teniam</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1 min-h-0 overflow-y-auto">
        <NavResources items={data.navResources} />
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} regions={regions} className="mt-auto border border-sidebar-border" />
      </SidebarContent>
      <SidebarFooter className="flex-shrink-0">
        <div className="flex flex-col gap-2">
          <ThemeToggle />
          <NavUser user={data.user} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
