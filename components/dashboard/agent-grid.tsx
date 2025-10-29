"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWebSocketContext } from "@/components/providers/websocket-provider"
import { useEffect, useState } from "react"
import { shortenAddress } from "@/lib/blockchain/utils"
import Link from "next/link"
import { AddAgentDialog } from "./add-agent-dialog"

const SearchIcon = ({ className }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const ExternalLinkIcon = ({ className }: { className?: string }) => (
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
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
)

export function AgentGrid() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents?limit=20")
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err)
    }
  }

  const { onTrustScoreUpdate, subscribeToGlobal } = useWebSocketContext()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAgents()
    const interval = setInterval(fetchAgents, 15000)

    subscribeToGlobal()

    onTrustScoreUpdate((message) => {
      console.log("[v0] Trust score update received:", message)
      fetchAgents()
    })

    return () => clearInterval(interval)
  }, [])

  const agents = data?.agents || []

  const filteredAgents = agents.filter(
    (agent: any) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getTrustScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400"
    if (score >= 70) return "text-cyan-400"
    if (score >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getTrustScoreBg = (score: number) => {
    if (score >= 85) return "bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20"
    if (score >= 70) return "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20"
    if (score >= 50) return "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20"
    return "bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20"
  }

  return (
    <Card className="p-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Monitored Agents</h2>
        <AddAgentDialog />
      </div>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search agents by name, address, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800/50 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-slate-500"
        />
      </div>

      {!data && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/10 bg-slate-800/30 animate-pulse">
              <div className="h-16 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {filteredAgents.map((agent: any) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-4 rounded-xl border ${getTrustScoreBg(agent.trustScore)}`}>
                  <div className={`text-2xl font-bold ${getTrustScoreColor(agent.trustScore)}`}>
                    {agent.trustScore.toFixed(0)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
                      {agent.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 font-mono mt-1">{shortenAddress(agent.address, 6)}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{agent._count.transactions} transactions</span>
                    {agent._count.alerts > 0 && <span className="text-red-400">{agent._count.alerts} alerts</span>}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <Link href={`/dashboard/agents/${agent.address}`}>
                  <ExternalLinkIcon className="w-4 h-4 text-cyan-400" />
                </Link>
              </Button>
            </div>
          ))}

          {filteredAgents.length === 0 && agents.length > 0 && (
            <div className="text-center py-12 text-slate-400">No agents found matching "{searchQuery}"</div>
          )}

          {agents.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No agents registered yet. Add your first agent to start monitoring.
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
