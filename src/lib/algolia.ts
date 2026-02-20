import algoliasearch from "algoliasearch/lite"

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
)

const index = searchClient.initIndex("products")

export async function searchProducts(filters: {
  query?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  categories?: string[]
}) {
  let numericFilters = []
  let facetFilters = []

  if (filters.condition && filters.condition !== "all") {
    facetFilters.push(`condition:${filters.condition}`)
  }
  
  if (filters.categories?.length) {
    facetFilters.push(filters.categories.map(c => `categories.id:${c}`))
  }

  if (filters.minPrice) numericFilters.push(`price >= ${filters.minPrice}`)
  if (filters.maxPrice) numericFilters.push(`price <= ${filters.maxPrice}`)

  const { hits } = await index.search(filters.query || "", {
    facetFilters,
    numericFilters: numericFilters.join(" AND "),
  })

  return hits
}