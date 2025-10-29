// Beta program application page
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle2Icon,
  RocketIcon,
  UsersIcon,
  ZapIcon,
  ArrowRightIcon,
  ShieldIcon,
} from "@/components/icons"

export default function BetaPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // In production, this would send to API
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
          >
            TrustGraph
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/customers" className="text-sm text-gray-400 hover:text-white transition-colors">
              Customers
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                  <RocketIcon className="w-4 h-4" />
                  Limited Beta Access
                </div>
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Join the TrustGraph Beta
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Get early access to the most advanced AI agent monitoring platform. Help shape the future while
                  protecting your agents.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
                  <ZapIcon className="w-10 h-10 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Early Access</h3>
                  <p className="text-gray-400 text-sm">Be among the first to use TrustGraph and get priority support</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                  <UsersIcon className="w-10 h-10 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Shape the Product</h3>
                  <p className="text-gray-400 text-sm">Direct influence on features and roadmap development</p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
                  <ShieldIcon className="w-10 h-10 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Exclusive Pricing</h3>
                  <p className="text-gray-400 text-sm">Lock in beta pricing for life when we launch</p>
                </div>
              </div>

              {/* Application Form */}
              <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6">Beta Application</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Work Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Company *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Role *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors"
                        placeholder="CTO, Engineer, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Number of AI Agents *</label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select range</option>
                      <option value="1-5">1-5 agents</option>
                      <option value="6-20">6-20 agents</option>
                      <option value="21-50">21-50 agents</option>
                      <option value="50+">50+ agents</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Use Case *</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your AI agents and what you're trying to monitor..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Blockchain Networks (select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Ethereum", "Polygon", "BSC", "Arbitrum", "Optimism", "Solana", "Avalanche", "Other"].map(
                        (chain) => (
                          <label
                            key={chain}
                            className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:border-cyan-500/50 transition-colors"
                          >
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{chain}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    Submit Application
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2Icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">Application Received!</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Thank you for your interest in TrustGraph. We'll review your application and get back to you within 48
                hours.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
