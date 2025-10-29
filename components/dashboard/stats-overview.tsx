"use client"
import { Card } from "@/components/ui/card"
import React from "react"

import { useEffect, useState } from "react"

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
)

const ActivityIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

export function StatsOverview() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
            <div className="h-20 bg-gradient-to-r from-slate-800 to-slate-700 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    )
  }

  const stats = data?.stats

  const statCards = [
    {
      title: "Active Agents",
      value: stats?.activeAgents || 0,
      total: stats?.totalAgents || 0,
      icon: UsersIcon,
      color: "text-cyan-400",
      bgColor: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Avg Trust Score",
      value: stats?.avgTrustScore?.toFixed(1) || "0.0",
      suffix: "/100",
      icon: TrendingUpIcon,
      color: "text-emerald-400",
      bgColor: "bg-gradient-to-br from-emerald-500/10 to-green-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Active Alerts",
      value: stats?.activeAlerts || 0,
      icon: AlertTriangleIcon,
      color: "text-red-400",
      bgColor: "bg-gradient-to-br from-red-500/10 to-orange-500/10",
      borderColor: "border-red-500/20",
    },
    {
      title: "24h Transactions",
      value: stats?.recentTransactions || 0,
      icon: ActivityIcon,
      color: "text-violet-400",
      bgColor: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
      borderColor: "border-violet-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card
          key={stat.title}
          className={`p-6 bg-slate-900/50 border backdrop-blur-sm hover:bg-slate-900/70 transition-all ${stat.borderColor}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
              <div className="flex items-baseline gap-1 mt-3">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                {stat.suffix && <span className="text-sm text-slate-400 ml-1">{stat.suffix}</span>}
                {stat.total && <span className="text-sm text-slate-400 ml-1">/ {stat.total}</span>}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
              {React.createElement(stat.icon, { className: `${stat.color}` })}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
