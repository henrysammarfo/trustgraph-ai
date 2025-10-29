"use client"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { AgentGrid } from "@/components/dashboard/agent-grid"
import { LiveFeed } from "@/components/dashboard/live-feed"
import { AlertPanel } from "@/components/dashboard/alert-panel"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        <StatsOverview />

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveFeed />
            <AlertPanel />
          </div>

          <AgentGrid />
        </div>
      </main>
    </div>
  )
}
