"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me")

      // Check if response is ok before parsing JSON
      if (!res.ok) {
        console.error("[v0] Failed to fetch user: HTTP", res.status)
        setUser(null)
        return
      }

      // Check content type to ensure it's JSON
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Failed to fetch user: Response is not JSON")
        setUser(null)
        return
      }

      const data = await res.json()
      setUser(data.user)
    } catch (error) {
      console.error("[v0] Failed to fetch user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to login")
    }

    const data = await res.json()
    setUser(data.user)
    router.push("/dashboard")
    router.refresh()
  }

  const signup = async (email: string, password: string, name?: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to signup")
    }

    const data = await res.json()
    setUser(data.user)
    router.push("/dashboard")
    router.refresh()
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return { user, loading, login, signup, logout }
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  return { user, loading }
}
