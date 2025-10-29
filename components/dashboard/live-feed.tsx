"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWebSocketContext } from "@/components/providers/websocket-provider"
import { useEffect, useState } from "react"
import { shortenAddress, formatWeiToEth } from "@/lib/blockchain/utils"

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

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
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
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
)

const ArrowDownRightIcon = ({ className }: { className?: string }) => (
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
    <path d="m7 7 10 10" />
    <path d="M17 7v10H7" />
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

interface FeedItem {
  id: string
  type: "transaction" | "trust_score"
  data: any
  timestamp: Date
}

const DEMO_FEED_ITEMS: FeedItem[] = [
  {
    id: "demo-1",
    type: "transaction",
    data: {
      agentName: "DeFi Trading Agent",
      hash: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      value: "1500000000000000000",
      status: "success",
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "demo-2",
    type: "trust_score",
    data: {
      agentName: "NFT Marketplace Bot",
      trustScore: 92.3,
      previousScore: 91.8,
    },
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: "demo-3",
    type: "transaction",
    data: {
      agentName: "Yield Optimizer",
      hash: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
      value: "2300000000000000000",
      status: "success",
    },
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
  },
]

export function LiveFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(DEMO_FEED_ITEMS)
  const { onNewTransaction, onTrustScoreUpdate, subscribeToGlobal } = useWebSocketContext()

  useEffect(() => {
    subscribeToGlobal()

    onNewTransaction((message) => {
      console.log("[v0] New transaction in feed:", message)
      setFeedItems((prev) => [
        {
          id: message.data.transactionId,
          type: "transaction",
          data: message.data,
          timestamp: new Date(message.timestamp),
        },
        ...prev.slice(0, 19),
      ])
    })

    onTrustScoreUpdate((message) => {
      console.log("[v0] Trust score update in feed:", message)
      setFeedItems((prev) => [
        {
          id: `score-${message.data.agentId}-${Date.now()}`,
          type: "trust_score",
          data: message.data,
          timestamp: new Date(message.timestamp),
        },
        ...prev.slice(0, 19),
      ])
    })
  }, [])

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-900/50 border-slate-800/50 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">Live Feed</h2>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {feedItems.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg border border-slate-800/50 bg-slate-950/30 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-200 text-sm"
          >
            {item.type === "transaction" ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                    Transaction
                  </Badge>
                  <span className="text-xs text-slate-400">{formatDistanceToNow(item.timestamp)}</span>
                </div>
                <p className="text-white font-medium">{item.data.agentName}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">{shortenAddress(item.data.hash, 8)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-300">{formatWeiToEth(item.data.value)} ETH</span>
                  <Badge
                    variant={item.data.status === "success" ? "default" : "destructive"}
                    className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  >
                    {item.data.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs border-violet-500/30 text-violet-400">
                    Trust Score
                  </Badge>
                  <span className="text-xs text-slate-400">{formatDistanceToNow(item.timestamp)}</span>
                </div>
                <p className="text-white font-medium">{item.data.agentName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-white">{item.data.trustScore.toFixed(0)}</span>
                  {item.data.previousScore && (
                    <div className="flex items-center gap-1">
                      {item.data.trustScore > item.data.previousScore ? (
                        <ArrowUpRightIcon className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRightIcon className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-xs text-slate-400">
                        {Math.abs(item.data.trustScore - item.data.previousScore).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
