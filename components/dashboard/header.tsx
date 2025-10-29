"use client"

import { useWebSocketContext } from "@/components/providers/websocket-provider"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/hooks"
import {
  ActivityIcon,
  ShieldIcon,
  BarChartIcon,
  HomeIcon,
  LogOutIcon,
  UserIcon,
} from "@/components/icons"

export function DashboardHeader() {
  const { isConnected } = useWebSocketContext()
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                <ShieldIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  TrustGraph
                </h1>
                <p className="text-xs text-slate-400">AI Agent Monitoring</p>
              </div>
            </Link>

            <nav className="flex items-center gap-1 bg-slate-900/50 rounded-full p-1">
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
                className={pathname === "/dashboard" ? "rounded-full" : "rounded-full hover:bg-slate-800"}
                asChild
              >
                <Link href="/dashboard">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant={pathname === "/dashboard/analytics" ? "secondary" : "ghost"}
                size="sm"
                className={pathname === "/dashboard/analytics" ? "rounded-full" : "rounded-full hover:bg-slate-800"}
                asChild
              >
                <Link href="/dashboard/analytics">
                  <BarChartIcon className="w-4 h-4 mr-2" />
                  Analytics
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                isConnected
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              <div className="relative">
                <ActivityIcon className="w-4 h-4" />
                {isConnected && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </div>
              <span>{isConnected ? "Live" : "Offline"}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
