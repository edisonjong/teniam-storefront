"use client"

import { useCollapseSidebarOnCategories } from "@/hooks/use-collapse-sidebar"

/**
 * Client-side wrapper component for the categories page
 * This handles the sidebar collapse functionality
 */
export function CategoriesPageWrapper({ children }: { children: React.ReactNode }) {
  // Use the hook to collapse sidebar on categories page
  useCollapseSidebarOnCategories()

  return <>{children}</>
}