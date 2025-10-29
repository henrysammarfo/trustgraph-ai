"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftIcon, ActivityIcon, TrendingUpIcon, AlertTriangleIcon, ExternalLinkIcon } from "@/components/icons"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useWebSocket } from "@/components/providers/websocket-provider"

interface AgentDetailPageProps {
  params: Promise<{ address: string }>
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { address } = use(params)
  const router = useRouter()
  const { socket } = useWebSocket()
  const [agent, setAgent] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [trustScores, setTrustScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgentData()
  }, [address])

  useEffect(() => {
    if (!socket) return

    socket.on("trustScoreUpdate", (data: any) => {
      if (data.agentAddress === address) {
        setAgent((prev: any) => (prev ? { ...prev, trustScore: data.score } : null))
        setTrustScores((prev) => [data, ...prev].slice(0, 20))
      }
    })

    socket.on("newTransaction", (data: any) => {
      if (data.agentAddress === address) {
        setTransactions((prev) => [data.transaction, ...prev])
      }
    })

    return () => {
      socket.off("trustScoreUpdate")
      socket.off("newTransaction")
    }
  }, [socket, address])

  const fetchAgentData = async () => {
    try {
      setLoading(true)
      const [agentRes, txRes, scoresRes] = await Promise.all([
        fetch(`/api/agents/${address}`),
        fetch(`/api/agents/${address}/transactions?limit=50`),
        fetch(`/api/agents/${address}/trust-scores?limit=20`),
      ])

      if (agentRes.ok) setAgent(await agentRes.json())
      if (txRes.ok) setTransactions(await txRes.json())
      if (scoresRes.ok) setTrustScores(await scoresRes.json())
    } catch (error) {
      console.error("[v0] Failed to fetch agent data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrustColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-cyan-400"
    if (score >= 40) return "text-yellow-400"
    return "text-red-400"
  }

  const getTrustBadge = (score: number) => {
    if (score >= 80)
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Good</Badge>
    if (score >= 40) return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Fair</Badge>
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Poor</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading agent data...</div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-slate-400 mb-4">Agent not found</h2>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const chartData = trustScores
    .map((score) => ({
      timestamp: new Date(score.timestamp).toLocaleDateString(),
      score: score.score,
    }))
    .reverse()

  const factorsData = agent.trustScores?.[0]?.factors
    ? [
        { name: "Volume", value: agent.trustScores[0].factors.transactionVolume },
        { name: "Frequency", value: agent.trustScores[0].factors.transactionFrequency },
        { name: "Gas Efficiency", value: agent.trustScores[0].factors.gasEfficiency },
        { name: "Success Rate", value: agent.trustScores[0].factors.successRate },
        { name: "Consistency", value: agent.trustScores[0].factors.behavioralConsistency },
        { name: "Risk Level", value: 100 - agent.trustScores[0].factors.riskLevel },
      ]
    : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto p-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{agent.name}</h1>
              <p className="text-slate-400 font-mono text-sm mb-4">{agent.address}</p>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-slate-300">
                  {agent.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={agent.status === "active" ? "text-emerald-400 border-emerald-500/30" : "text-slate-400"}
                >
                  {agent.status}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Trust Score</div>
              <div className={`text-5xl font-bold ${getTrustColor(agent.trustScore)}`}>{agent.trustScore}</div>
              <div className="mt-2">{getTrustBadge(agent.trustScore)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-cyan-500/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-cyan-400" />
            Trust Score Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="timestamp" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Area type="monotone" dataKey="score" stroke="#06b6d4" fill="url(#scoreGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {factorsData.length > 0 && (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-emerald-500/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-cyan-400" />
              Trust Factors Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={factorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {agent.trustScores?.[0]?.analysis && (
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-yellow-500/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />
              AI Analysis
            </h2>
            <p className="text-slate-300 leading-relaxed">{agent.trustScores[0].analysis}</p>
            <div className="mt-4 text-sm text-slate-400">
              Confidence: {Math.round((agent.trustScores[0].confidence || 0) * 100)}%
            </div>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 border border-slate-700/50 shadow-2xl shadow-cyan-500/10 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Transaction History</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-slate-800/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-2 mt-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-mono text-sm text-slate-300 mb-1">{tx.hash.slice(0, 20)}...</div>
                    <div className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-sm text-slate-300">{(Number.parseFloat(tx.value) / 1e18).toFixed(4)} ETH</div>
                    <div className="text-xs text-slate-500">Gas: {tx.gasUsed}</div>
                  </div>
                  <Badge variant={tx.status === "success" ? "default" : "destructive"} className="mr-2">
                    {tx.status}
                  </Badge>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="success" className="space-y-2 mt-4">
              {transactions
                .filter((tx) => tx.status === "success")
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex-1">
                      <div className="font-mono text-sm text-slate-300 mb-1">{tx.hash.slice(0, 20)}...</div>
                      <div className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-slate-300">{(Number.parseFloat(tx.value) / 1e18).toFixed(4)} ETH</div>
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="failed" className="space-y-2 mt-4">
              {transactions
                .filter((tx) => tx.status === "failed")
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex-1">
                      <div className="font-mono text-sm text-slate-300 mb-1">{tx.hash.slice(0, 20)}...</div>
                      <div className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-red-400">Failed</div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
