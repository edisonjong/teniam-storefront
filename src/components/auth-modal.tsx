"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react"

export function AuthModal() {
    const { showAuthModal, authModalTab, closeAuthModal, login, register, sendPasswordReset } = useAuth()
    const [activeTab, setActiveTab] = useState<"login" | "register">(authModalTab)
    const [view, setView] = useState<"auth" | "forgot" | "reset-sent" | "reset-password">("auth")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")

    // Login form state
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Register form state
    const [registerName, setRegisterName] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

    const [forgotEmail, setForgotEmail] = useState("")

    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    useEffect(() => {
        if (showAuthModal) {
            setActiveTab(authModalTab)
            setView("auth")
            setError("")
        }
    }, [showAuthModal, authModalTab])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const success = await login(loginEmail, loginPassword)
            if (!success) {
                setError("Invalid email or password")
            }
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (registerPassword !== registerConfirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (registerPassword.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setIsLoading(true)

        try {
            const success = await register(registerName, registerEmail, registerPassword)
            if (!success) {
                setError("Registration failed. Please try again.")
            }
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const success = await sendPasswordReset(forgotEmail)
            if (success) {
                setView("reset-sent")
            } else {
                setError("Failed to send reset email. Please try again.")
            }
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match")
            return
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setIsLoading(true)

        try {
            // Simulate password reset - in real app would use token from URL
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setView("auth")
            setActiveTab("login")
            // Clear form
            setNewPassword("")
            setConfirmNewPassword("")
        } catch {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = (provider: string) => {
        setIsLoading(true)
        setTimeout(() => {
            login(`user@${provider}.com`, "password")
            setIsLoading(false)
        }, 1500)
    }

    const handleClose = () => {
        setView("auth")
        setError("")
        setForgotEmail("")
        setNewPassword("")
        setConfirmNewPassword("")
        closeAuthModal()
    }

    const renderForgotPassword = () => (
        <>
            <DialogHeader className="p-6 pb-4">
                <Button variant="ghost" size="sm" className="w-fit -ml-2 mb-2 text-foreground" onClick={() => setView("auth")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to sign in
                </Button>
                <DialogTitle className="text-2xl font-bold text-foreground">Forgot password?</DialogTitle>
                <DialogDescription className="text-foreground/70">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-0">
                {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-foreground">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                            <Input
                                id="forgot-email"
                                type="email"
                                placeholder="you@example.com"
                                className="pl-10 text-foreground placeholder:text-foreground/50"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
                        disabled={isLoading || !forgotEmail}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                </form>
            </div>
        </>
    )

    const renderResetSent = () => (
        <>
            <DialogHeader className="p-6 pb-4">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <DialogTitle className="text-2xl font-bold text-center text-foreground">Check your email</DialogTitle>
                <DialogDescription className="text-center text-foreground/70">
                    We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{forgotEmail}</span>
                </DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-0 space-y-4">
                <p className="text-sm text-foreground/60 text-center">
                    Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
                <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full bg-background text-foreground border-sidebar-border hover:bg-muted" onClick={() => setView("forgot")}>
                        Try again
                    </Button>
                    <Button
                        className="w-full bg-foreground text-background hover:bg-foreground/90"
                        onClick={() => {
                            setView("auth")
                            setActiveTab("login")
                        }}
                    >
                        Back to sign in
                    </Button>
                </div>
            </div>
        </>
    )

    const renderResetPassword = () => (
        <>
            <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-2xl font-bold text-foreground">Reset your password</DialogTitle>
                <DialogDescription className="text-foreground/70">Enter your new password below.</DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-0">
                {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-foreground">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                            <Input
                                id="new-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 text-foreground placeholder:text-foreground/50"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-foreground/50" />
                                ) : (
                                    <Eye className="h-4 w-4 text-foreground/50" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-foreground/60">Must be at least 8 characters</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-new-password" className="text-foreground">Confirm New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                            <Input
                                id="confirm-new-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 text-foreground placeholder:text-foreground/50"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
                        disabled={isLoading || !newPassword || !confirmNewPassword}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            </div>
        </>
    )

    const renderAuthView = () => (
        <>
            <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-2xl font-bold text-foreground">
                    {activeTab === "login" ? "Welcome back" : "Create an account"}
                </DialogTitle>
                <DialogDescription className="text-foreground/70">
                    {activeTab === "login"
                        ? "Sign in to access your cart, wishlist, and messages."
                        : "Join our marketplace to start buying and selling."}
                </DialogDescription>
            </DialogHeader>

            {/* Tab Selector */}
            <div className="flex px-6 gap-2">
                <Button
                    className={`flex-1 rounded-lg ${activeTab === "login"
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-background text-foreground border border-sidebar-border hover:bg-muted"}`}
                    onClick={() => setActiveTab("login")}
                >
                    Sign In
                </Button>
                <Button
                    className={`flex-1 rounded-lg ${activeTab === "register"
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "bg-background text-foreground border border-sidebar-border hover:bg-muted"}`}
                    onClick={() => setActiveTab("register")}
                >
                    Register
                </Button>
            </div>

            <div className="p-6 pt-4">
                {/* Social Login Buttons */}
                {/* <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-11 bg-background text-foreground border-sidebar-border hover:bg-muted"
                        onClick={() => handleSocialLogin("google")}
                        disabled={isLoading}
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google
                    </Button>
                    <Button
                        variant="outline"
                        className="h-11 bg-background text-foreground border-sidebar-border hover:bg-muted"
                        onClick={() => handleSocialLogin("apple")}
                        disabled={isLoading}
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Apple
                    </Button>
                </div> */}

                <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-foreground/60">
                        or continue with email
                    </span>
                </div>

                {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

                {activeTab === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-email" className="text-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10 text-foreground placeholder:text-foreground/50"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="login-password" className="text-foreground">Password</Label>
                                <Button
                                    type="button"
                                    variant="link"
                                    className="px-0 h-auto text-xs text-foreground/60 hover:text-foreground"
                                    onClick={() => {
                                        setError("")
                                        setForgotEmail(loginEmail)
                                        setView("forgot")
                                    }}
                                >
                                    Forgot password?
                                </Button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 text-foreground placeholder:text-foreground/50"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-foreground/50" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-foreground/50" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="register-name" className="text-foreground">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="register-name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="pl-10 text-foreground placeholder:text-foreground/50"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-email" className="text-foreground">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="register-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-10 text-foreground placeholder:text-foreground/50"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-password" className="text-foreground">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 text-foreground placeholder:text-foreground/50"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-foreground/50" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-foreground/50" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-foreground/60">Must be at least 8 characters</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-confirm-password" className="text-foreground">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                <Input
                                    id="register-confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 text-foreground placeholder:text-foreground/50"
                                    value={registerConfirmPassword}
                                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                        <p className="text-xs text-center text-foreground/60">
                            By creating an account, you agree to our{" "}
                            <a href="#" className="underline text-foreground/80 hover:text-foreground">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="underline text-foreground/80 hover:text-foreground">
                                Privacy Policy
                            </a>
                        </p>
                    </form>
                )}
            </div>
        </>
    )

    return (
        <Dialog open={showAuthModal} onOpenChange={(open) => !open && handleClose()} >
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden bg-sidebar border border-sidebar-border text-foreground">
                {view === "auth" && renderAuthView()}
                {view === "forgot" && renderForgotPassword()}
                {view === "reset-sent" && renderResetSent()}
                {view === "reset-password" && renderResetPassword()}
            </DialogContent>
        </Dialog>
    )
}
