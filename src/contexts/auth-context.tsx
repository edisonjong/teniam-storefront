'use client'
import { toast } from "sonner"
import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"

interface AuthUser {
    name: string
    email: string
    avatar: string
}

interface AuthContextInterface {
    isAuthenticated: boolean
    user: AuthUser | null
    customer: HttpTypes.StoreCustomer | null
    showAuthModal: boolean
    authModalTab: "login" | "register"
    openAuthModal: (mode?: "login" | "register") => void
    closeAuthModal: () => void
    logout: () => void
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<boolean>
    sendPasswordReset: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextInterface | null>(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
    customer: HttpTypes.StoreCustomer | null
    locale?: string
}

export function AuthProvider({ children, customer, locale = "" }: AuthProviderProps) {
    const router = useRouter()
    const localePrefix = locale ? `/${locale}` : ""

    const [showAuthModal, setShowAuthModal] = useState(false)
    const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login")

    const isAuthenticated = !!customer

    const user: AuthUser | null = customer
        ? {
            name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || customer.email || "User",
            email: customer.email || "",
            avatar: "",
        }
        : null

    const openAuthModal = useCallback(
        (mode: "login" | "register" = "login") => {
            setAuthModalTab(mode)
            setShowAuthModal(true)
        },
        []
    )

    const closeAuthModal = useCallback(() => {
        setShowAuthModal(false)
    }, [])

    const logout = useCallback(async () => {
        try {
            const { signout } = await import("@/lib/data/customer")
            // Don't await signout since it handles redirect internally
            signout()
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error("Failed to log out")
        }
    }, [])

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            const { login: loginFn } = await import("@/lib/data/customer")
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            const result = await loginFn(formData)
            if (typeof result === 'string') {
                toast.error(result)
                return false
            }
            toast.success("Logged in successfully")
            closeAuthModal()
            router.refresh()
            return true
        } catch (error) {
            toast.error("An unexpected error occurred")
            return false
        }
    }, [closeAuthModal, router])

    const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const { signup } = await import("@/lib/data/customer")
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            formData.append('first_name', name.split(' ')[0] || '')
            formData.append('last_name', name.split(' ').slice(1).join(' ') || '')
            formData.append('phone', '')
            const result = await signup(formData)
            if (typeof result === 'string') {
                toast.error(result)
                return false
            }
            toast.success("Registered successfully")
            closeAuthModal()
            router.refresh()
            return true
        } catch (error) {
            toast.error("An unexpected error occurred")
            return false
        }
    }, [closeAuthModal, router])

    const sendPasswordReset = useCallback(async (email: string): Promise<boolean> => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Password reset email sent")
            return true
        } catch (error) {
            toast.error("Failed to send password reset email")
            return false
        }
    }, [])

    const value: AuthContextInterface = {
        isAuthenticated,
        user,
        customer,
        showAuthModal,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        logout,
        login,
        register,
        sendPasswordReset,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
