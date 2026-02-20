import { Footer } from "@/components/organisms"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { retrieveCustomer } from "@/lib/data/customer"
import { checkRegion } from "@/lib/helpers/check-region"
import { listCategories } from "@/lib/data/categories" // Ensure this helper exists
import { Session } from "@talkjs/react"
import { redirect } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { FacetsProvider } from "@/contexts/FacetsContext"

export default async function MainLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const APP_ID = process.env.NEXT_PUBLIC_TALKJS_APP_ID

  // 1. Data Fetching & Safety Checks (Preserved)
  const user = await retrieveCustomer()
  const regionCheck = await checkRegion(locale)
  const categoryData = await listCategories()
  const categories = categoryData?.categories || []

  if (!regionCheck) {
    return redirect("/")
  }

  // 2. Define the New Structure
  const MainContent = (
    <div className="[--header-height:calc(theme(spacing.14))] bg-sidebar min-h-screen">
      <FacetsProvider>
        <AuthProvider customer={user} locale={locale}>
          <SidebarProvider className="flex flex-col">
          {/* SiteHeader handles top-level actions (Search, Cart, Trigger) */}
          <SiteHeader locale={locale} />
          
          <div className="flex flex-1">
            {/* AppSidebar handles responsive navigation & categories */}
            <AppSidebar categories={categories} locale={locale} />
            
            <SidebarInset className="w-full overflow-x-hidden bg-background">
              <div className="w-full min-w-0 flex flex-col min-h-[calc(100vh-var(--header-height))]">
                <main className="flex-1 p-4 lg:p-0">
                  {children}
                </main>
                <Footer />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
        </AuthProvider>
      </FacetsProvider>
    </div>
  )

  // 3. Conditional TalkJS Session (Preserved)
  if (!APP_ID || !user) {
    return MainContent
  }

  return (
    <Session appId={APP_ID} userId={user.id}>
      {MainContent}
    </Session>
  )
}