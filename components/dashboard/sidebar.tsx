"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  TrendingUp,
  Settings,
  Menu,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Rutinas", href: "/rutinas", icon: Dumbbell },
  { name: "Calendario", href: "/calendario", icon: Calendar },
  // { name: "Progreso", href: "/progreso", icon: TrendingUp },
  { name: "Configuracion", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}

{/* Mobile menu button */}
<Button
  variant="default"
  size="icon"
  className="
    fixed
    top-4
    left-4
    z-[1100]
    lg:hidden
    h-12
    w-12
    rounded-2xl
    bg-green-500
    hover:bg-green-500
    active:bg-green-600
    text-white
    shadow-xl
    border-0
  "
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
  {mobileMenuOpen ? (
    <X className="h-6 w-6" />
  ) : (
    <Menu className="h-6 w-6" />
  )}
</Button>

{/* Mobile overlay */}
{mobileMenuOpen && (
  <div
    className="fixed inset-0 z-[1050] bg-black/60 lg:hidden"
    onClick={() => setMobileMenuOpen(false)}
  />
)}

{/* Sidebar */}
{/* Sidebar */}
<aside
  className={cn(
    `
    fixed inset-y-0 left-0
    z-[1000]
    flex w-64 flex-col
    bg-sidebar
    border-r border-sidebar-border
    transition-transform duration-300
    lg:translate-x-0
    `,
    
    mobileMenuOpen
      ? "translate-x-0 pointer-events-auto"
      : "-translate-x-full pointer-events-none lg:pointer-events-auto"
  )}
>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">FitControl</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <span className="text-sm font-medium">EP</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Entrenador Pro
              </p>
              <p className="text-xs text-muted-foreground truncate">
                entrenador@fitcontrol.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card lg:hidden">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only lg:not-sr-only">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
