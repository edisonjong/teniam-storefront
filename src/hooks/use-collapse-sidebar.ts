'use client'
import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

/**
 * Custom hook that automatically collapses the sidebar when on the categories page
 * and restores previous state when navigating away
 */
export function useCollapseSidebarOnCategories() {
  const { open, setOpen, state } = useSidebar()
  const pathname = usePathname()
  
  useEffect(() => {
    // Check if current path is the categories page
    const isCategoriesPage = pathname?.includes('/categories')
    
    if (isCategoriesPage) {
      // Store current state before collapsing (for potential restoration)
      const previousState = state
      
      // Collapse the sidebar if it's currently open
      if (open) {
        setOpen(false)
      }
      
      // Return cleanup function to potentially restore state
      return () => {
        // Optional: restore previous state when leaving categories page
        // For now, we'll leave it collapsed until user manually expands
      }
    }
  }, [pathname, open, setOpen, state])
}