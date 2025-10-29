"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [useCase, setUseCase] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, company, useCase }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist")
      }

      setSuccess(true)
      setEmail("")
      setName("")
      setCompany("")
      setUseCase("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 p-8 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
        <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">You're on the list!</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          We'll notify you when TrustGraph is ready for early access.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 rounded-xl border-neutral-300 dark:border-neutral-700"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-xl border-neutral-300 dark:border-neutral-700"
        />
        <Input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="h-12 rounded-xl border-neutral-300 dark:border-neutral-700"
        />
      </div>
      <Textarea
        placeholder="What's your use case? (optional)"
        value={useCase}
        onChange={(e) => setUseCase(e.target.value)}
        className="min-h-[100px] rounded-xl border-neutral-300 dark:border-neutral-700"
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-medium"
      >
        {loading ? "Joining..." : "Join Waitlist"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
