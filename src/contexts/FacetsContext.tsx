"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface FacetsContextType {
  facets: Record<string, any>
  updateFacets: (newFacets: Record<string, any>) => void
}

const FacetsContext = createContext<FacetsContextType | undefined>(undefined)

export function FacetsProvider({ children }: { children: ReactNode }) {
  const [facets, setFacets] = useState<Record<string, any>>({})

  const updateFacets = useCallback((newFacets: Record<string, any>) => {
    setFacets(newFacets)
  }, [])

  return (
    <FacetsContext.Provider value={{ facets, updateFacets }}>
      {children}
    </FacetsContext.Provider>
  )
}

export function useFacets() {
  const context = useContext(FacetsContext)
  if (context === undefined) {
    throw new Error('useFacets must be used within a FacetsProvider')
  }
  return context
}