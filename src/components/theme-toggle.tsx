"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <SidebarMenuButton size="sm" className="cursor-pointer">
                <Sun className="h-4 w-4" />
                <span>Theme</span>
            </SidebarMenuButton>
        )
    }

    const getCurrentIcon = () => {
        switch (theme) {
            case "dark":
                return <Moon className="h-4 w-4" />
            case "light":
                return <Sun className="h-4 w-4" />
            default:
                return <Monitor className="h-4 w-4" />
        }
    }

    const getCurrentLabel = () => {
        switch (theme) {
            case "dark":
                return "Dark"
            case "light":
                return "Light"
            default:
                return "System"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="sm" className="cursor-pointer">
                    {getCurrentIcon()}
                    <span>Theme: {getCurrentLabel()}</span>
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-40 border-sidebar-border border bg-sidebar">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                // className={theme === "light" ? "bg-accent" : ""}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                // className={theme === "dark" ? "bg-accent" : ""}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                // className={theme === "system" ? "bg-accent" : ""}
                >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}