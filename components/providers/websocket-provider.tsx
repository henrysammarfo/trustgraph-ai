"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useWebSocket as useWebSocketClient } from "@/lib/websocket/client"

interface WebSocketContextType {
  isConnected: boolean
  subscribeToAgent: (agentAddress: string) => void
  unsubscribeFromAgent: (agentAddress: string) => void
  subscribeToGlobal: () => void
  onTrustScoreUpdate: (callback: (message: any) => void) => void
  onNewTransaction: (callback: (message: any) => void) => void
  onAlert: (callback: (message: any) => void) => void
  onAgentStatus: (callback: (message: any) => void) => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const websocket = useWebSocketClient()

  return <WebSocketContext.Provider value={websocket}>{children}</WebSocketContext.Provider>
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocketContext must be used within WebSocketProvider")
  }
  return context
}

export { useWebSocketContext as useWebSocket }
