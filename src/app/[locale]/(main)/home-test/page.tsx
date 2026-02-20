import { listProducts } from "@/lib/data/products"
import { getCategoryByHandle } from "@/lib/data/categories"
import { HomeProductListing } from "@/components/HomeProductListing"

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>
    searchParams: Promise<{ category?: string }>
}) {
    const { locale } = await params
    const { category: categoryHandle } = await searchParams

    // If category is specified, look up the category and filter products
    let categoryId: string | undefined
    let categoryName: string | null = null

    if (categoryHandle) {
        const category = await getCategoryByHandle(categoryHandle)
        if (category) {
            categoryId = category.id
            categoryName = category.name
        }
    }

    // Fetch products, optionally filtered by category
    const { response } = await listProducts({
        countryCode: locale,
        queryParams: { limit: 50 },
        category_id: categoryId,
    })

    return (
        <HomeProductListing
            initialProducts={response.products}
            locale={locale}
            selectedCategory={categoryName}
            categoryHandle={categoryHandle || null}
        />
    )
}
