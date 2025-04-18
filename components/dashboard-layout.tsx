"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, BarChart3, CreditCard, Dumbbell, Home, LogOut, Settings, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "admin" | "staff" | "member"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define navigation items based on role
  const getNavItems = () => {
    if (role === "admin") {
      return [
        { href: "/admin", label: "Dashboard", icon: Home },
        { href: "/admin/staff", label: "Staff Management", icon: Users },
        { href: "/admin/payments", label: "Payment Settings", icon: CreditCard },
        { href: "/admin/reports", label: "Reports", icon: BarChart3 },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ]
    } else if (role === "staff") {
      return [
        { href: "/staff", label: "Dashboard", icon: Home },
        { href: "/staff/members", label: "Member Registration", icon: Users },
        { href: "/staff/payments", label: "Payment Verification", icon: CreditCard },
      ]
    } else {
      return [
        { href: "/member", label: "Dashboard", icon: Home },
        { href: "/member/profile", label: "My Profile", icon: Users },
        { href: "/member/subscription", label: "My Subscription", icon: Activity },
      ]
    }
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    // In a real app, you would clear auth state here
    window.location.href = "/"
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white">
        <div className="p-4 flex items-center gap-2 border-b border-gray-800">
          <Dumbbell className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg">Niel&apos;s Fitness</h2>
            <p className="text-xs text-gray-400 capitalize">{role} Portal</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200",
                pathname === item.href ? "bg-primary text-white font-medium" : "text-gray-300 hover:bg-gray-800",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center gap-2 border-b border-gray-800">
              <Dumbbell className="h-8 w-8 text-primary" />
              <div>
                <h2 className="font-bold text-lg">Niel&apos;s Fitness</h2>
                <p className="text-xs text-gray-400 capitalize">{role} Portal</p>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200",
                    pathname === item.href ? "bg-primary text-white font-medium" : "text-gray-300 hover:bg-gray-800",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-800">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
