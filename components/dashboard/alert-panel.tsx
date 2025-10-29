"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWebSocketContext } from "@/components/providers/websocket-provider"
import { useEffect, useState } from "react"

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

function formatDistanceToNow(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function AlertPanel() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [resolvingAlerts, setResolvingAlerts] = useState<Set<string>>(new Set())

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/alerts?resolved=false&limit=10")
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err)
    }
  }

  const { onAlert, subscribeToGlobal } = useWebSocketContext()

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000)

    subscribeToGlobal()

    onAlert((message) => {
      console.log("[v0] Alert received:", message)
      fetchAlerts()
    })

    return () => clearInterval(interval)
  }, [])

  const alerts = data?.alerts || []

  const handleResolve = async (alertId: string) => {
    setResolvingAlerts((prev) => new Set(prev).add(alertId))

    try {
      const response = await fetch(`/api/alerts/${alertId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resolved: true }),
      })

      if (response.ok) {
        fetchAlerts()
      } else {
        console.error("[v0] Failed to resolve alert:", await response.text())
      }
    } catch (error) {
      console.error("[v0] Error resolving alert:", error)
    } finally {
      setResolvingAlerts((prev) => {
        const next = new Set(prev)
        next.delete(alertId)
        return next
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20"
      case "high":
        return "text-orange-400 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20"
      case "medium":
        return "text-yellow-400 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20"
      default:
        return "text-cyan-400 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return AlertTriangleIcon
      case "medium":
        return AlertCircleIcon
      default:
        return InfoIcon
    }
  }

  return (
    <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Active Alerts</h2>
        <Badge variant="outline" className="border-white/20 text-slate-300">
          {alerts.length}
        </Badge>
      </div>

      {!data && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-xl border border-white/10 bg-slate-800/30 animate-pulse">
              <div className="h-16 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {alerts.map((alert: any) => {
            const Icon = getSeverityIcon(alert.severity)
            const isResolving = resolvingAlerts.has(alert.id)

            return (
              <div
                key={alert.id}
                className="p-3 rounded-xl border border-white/10 bg-slate-800/30 hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(alert.createdAt))}</span>
                    </div>
                    <p className="text-sm text-white font-medium">{alert.agent.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleResolve(alert.id)}
                    disabled={isResolving}
                    className="shrink-0 h-8 px-3 text-xs hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20 border border-transparent transition-all"
                  >
                    <CheckIcon className="w-3 h-3 mr-1" />
                    {isResolving ? "Resolving..." : "Resolve"}
                  </Button>
                </div>
              </div>
            )
          })}

          {alerts.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">No active alerts</div>}
        </div>
      )}
    </Card>
  )
}
