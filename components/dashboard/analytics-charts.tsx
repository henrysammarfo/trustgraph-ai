"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useEffect, useState } from "react"

const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function AnalyticsCharts() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-64 bg-muted rounded" />
          </Card>
        ))}
      </div>
    )
  }

  const trustDistribution = [
    { name: "Excellent (80-100)", value: stats.trustDistribution?.excellent || 0, color: "#10b981" },
    { name: "Good (60-79)", value: stats.trustDistribution?.good || 0, color: "#06b6d4" },
    { name: "Fair (40-59)", value: stats.trustDistribution?.fair || 0, color: "#f59e0b" },
    { name: "Poor (0-39)", value: stats.trustDistribution?.poor || 0, color: "#ef4444" },
  ]

  const transactionTrend = stats.transactionTrend || []
  const alertsBySeverity = stats.alertsBySeverity || []
  const topAgents = stats.topAgents || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trust Score Distribution */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-cyan-500/10">
        <h3 className="text-lg font-semibold text-white mb-4">Trust Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={trustDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {trustDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              labelStyle={{ color: "#94a3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Transaction Volume Trend */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-emerald-500/10">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction Volume (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactionTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Alerts by Severity */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-yellow-500/10">
        <h3 className="text-lg font-semibold text-white mb-4">Active Alerts by Severity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={alertsBySeverity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="severity" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Bar dataKey="count" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Performing Agents */}
      <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-emerald-500/10">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Agents</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topAgents} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Bar dataKey="trustScore" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
