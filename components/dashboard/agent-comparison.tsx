"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitCompareIcon, TrendingUpIcon, TrendingDownIcon } from "@/components/icons"
import { useState, useEffect } from "react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

interface Agent {
  id: string
  name: string
  trustScore: number
  factors?: {
    transactionVolume?: number
    transactionFrequency?: number
    gasEfficiency?: number
    successRate?: number
    behavioralConsistency?: number
    riskLevel?: number
  }
}

export function AgentComparison() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents || [])
        if (data.agents?.length >= 2) {
          setSelectedAgents([data.agents[0].id, data.agents[1].id])
        }
      })
      .catch((err) => console.error("[v0] Failed to fetch agents:", err))
  }, [])

  const agent1 = agents.find((a) => a.id === selectedAgents[0])
  const agent2 = agents.find((a) => a.id === selectedAgents[1])

  const defaultFactors = {
    transactionVolume: 0,
    transactionFrequency: 0,
    gasEfficiency: 0,
    successRate: 0,
    behavioralConsistency: 0,
    riskLevel: 0,
  }

  const agent1Factors = agent1?.factors ?? defaultFactors
  const agent2Factors = agent2?.factors ?? defaultFactors

  const comparisonData =
    selectedAgents.length === 2 && agent1 && agent2
      ? [
          {
            metric: "Volume",
            [agent1.name]: agent1Factors.transactionVolume ?? 0,
            [agent2.name]: agent2Factors.transactionVolume ?? 0,
          },
          {
            metric: "Frequency",
            [agent1.name]: agent1Factors.transactionFrequency ?? 0,
            [agent2.name]: agent2Factors.transactionFrequency ?? 0,
          },
          {
            metric: "Gas Efficiency",
            [agent1.name]: agent1Factors.gasEfficiency ?? 0,
            [agent2.name]: agent2Factors.gasEfficiency ?? 0,
          },
          {
            metric: "Success Rate",
            [agent1.name]: agent1Factors.successRate ?? 0,
            [agent2.name]: agent2Factors.successRate ?? 0,
          },
          {
            metric: "Consistency",
            [agent1.name]: agent1Factors.behavioralConsistency ?? 0,
            [agent2.name]: agent2Factors.behavioralConsistency ?? 0,
          },
        ]
      : []

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-900/50 border-slate-800/50 backdrop-blur">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GitCompareIcon className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Agent Comparison</h2>
        </div>
        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 bg-transparent">
          Select Agents
        </Button>
      </div>

      {selectedAgents.length === 2 && agent1 && agent2 ? (
        <div className="space-y-6">
          {/* Comparison header */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/50 rounded-lg border border-cyan-500/30">
              <p className="text-sm text-slate-400 mb-1">Agent 1</p>
              <p className="text-lg font-bold text-white">{agent1.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-cyan-400">{agent1.trustScore}</span>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                  Trust Score
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-lg border border-blue-500/30">
              <p className="text-sm text-slate-400 mb-1">Agent 2</p>
              <p className="text-lg font-bold text-white">{agent2.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-blue-400">{agent2.trustScore}</span>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  Trust Score
                </Badge>
              </div>
            </div>
          </div>

          {/* Radar chart */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparisonData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b" }} />
                <Radar
                  name={agent1.name}
                  dataKey={agent1.name}
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name={agent2.name}
                  dataKey={agent2.name}
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed comparison */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(agent1Factors).map(([key, value]) => {
              const agent2Value = agent2Factors[key as keyof typeof agent2Factors] ?? 0
              const diff = value - agent2Value
              const isDifferent = Math.abs(diff) > 5

              return (
                <div key={key} className="p-3 bg-slate-950/30 rounded-lg border border-slate-800/50">
                  <p className="text-xs text-slate-400 mb-2 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-semibold">{value}</span>
                    {isDifferent && (
                      <div className="flex items-center gap-1">
                        {diff > 0 ? (
                          <TrendingUpIcon className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <TrendingDownIcon className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-xs text-slate-400">{Math.abs(diff).toFixed(0)}</span>
                      </div>
                    )}
                    <span className="text-blue-400 font-semibold">{agent2Value}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <GitCompareIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Select two agents to compare their trust metrics</p>
        </div>
      )}
    </Card>
  )
}
