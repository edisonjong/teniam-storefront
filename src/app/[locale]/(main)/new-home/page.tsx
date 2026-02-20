import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/atoms"
import { AlgoliaProductsListing, ProductListing } from "@/components/sections"
import { getRegion, listRegions } from "@/lib/data/regions"
import isBot from "@/lib/helpers/isBot"
import { headers } from "next/headers"
import type { Metadata } from "next"
import Script from "next/script"
import { listProducts } from "@/lib/data/products"
import { toHreflang } from "@/lib/helpers/hreflang"
import { HomeProductListing } from "@/components/HomeProductListing" // Import your new component
import { NewProductsListing } from "@/components/sections/ProductListing/NewProductsListing"

export const revalidate = 60

// Metadata stays on the server to ensure social previews and SEO work perfectly
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || []).flatMap((r) => r.countries?.map((c) => c.iso_2) || [])
      )
    ) as string[]
    languages = locales.reduce<Record<string, string>>((acc, code) => {
      acc[toHreflang(code)] = `${baseUrl}/${code}/categories`
      return acc
    }, {})
  } catch {
    languages = { [toHreflang(locale)]: `${baseUrl}/${locale}/categories` }
  }

  return {
    title: "Teniam | Workspace Essentials",
    description: "Premium desk setups and PC components for the modern workspace.",
    alternates: {
      canonical: `${baseUrl}/${locale}/categories`,
      languages: { ...languages, "x-default": `${baseUrl}/categories` },
    },
    robots: { index: true, follow: true },
  }
}

const ALGOLIA_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

export default async function AllCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const headersList = await headers()
  
  // 1. Detect Bots for SEO-friendly static rendering fallback
  const ua = headersList.get("user-agent") || ""
  const bot = isBot(ua)

  // 2. Fetch Region and initial Products for JSON-LD (Schema.org)
  const currency_code = (await getRegion(locale))?.currency_code || "usd"
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`
  
  const {
    response: { products: jsonLdProducts },
  } = await listProducts({
    countryCode: locale,
    queryParams: { limit: 8, order: "created_at", fields: "id,title,handle" },
  })

  const itemList = jsonLdProducts.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${baseUrl}/${locale}/products/${p.handle}`,
    name: p.title,
  }))

  return (
    <main className="container mx-auto px-4 lg:px-4">
      {/* JSON-LD Scripts for SEO */}
      <Script
        id="ld-itemlist-categories"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: itemList,
          }),
        }}
      />

      <div className="hidden md:block py-4">
        <Breadcrumbs items={[{ path: "/", label: "All Products" }]} />
      </div>

      <Suspense fallback={<ProductListingSkeleton />}>
        {/* PASSING COMPONENTS AS SLOTS:
          We wrap the interactive filters (HomeProductListing) around 
          the data-fetching components (Algolia or Static). 
        */}
        <HomeProductListing 
          locale={locale}
          currency_code={currency_code}
          AlgoliaComponent={
            (!bot && ALGOLIA_ID && ALGOLIA_SEARCH_KEY) ? (
              <NewProductsListing
                locale={locale}
                currency_code={currency_code}
              />
            ) : null
          }
          StaticComponent={
            (bot || !ALGOLIA_ID) ? (
              <ProductListing locale={locale} />
            ) : null
          }
        />
      </Suspense>
    </main>
  )
}