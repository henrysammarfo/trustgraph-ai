"use client"

import { useEffect, useRef, useState } from "react"
import type { WebSocketMessage } from "@/lib/types"

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(true) // Always connected in polling mode
  const callbacksRef = useRef<{
    trustScoreUpdate: ((message: WebSocketMessage) => void)[]
    newTransaction: ((message: WebSocketMessage) => void)[]
    alert: ((message: WebSocketMessage) => void)[]
    agentStatus: ((message: WebSocketMessage) => void)[]
  }>({
    trustScoreUpdate: [],
    newTransaction: [],
    alert: [],
    agentStatus: [],
  })

  useEffect(() => {
    console.log("[v0] WebSocket client initialized (polling mode)")
    setIsConnected(true)
  }, [])

  const subscribeToAgent = (agentAddress: string) => {
    console.log("[v0] Subscribed to agent:", agentAddress)
  }

  const unsubscribeFromAgent = (agentAddress: string) => {
    console.log("[v0] Unsubscribed from agent:", agentAddress)
  }

  const subscribeToGlobal = () => {
    console.log("[v0] Subscribed to global updates")
  }

  const onTrustScoreUpdate = (callback: (message: WebSocketMessage) => void) => {
    callbacksRef.current.trustScoreUpdate.push(callback)
  }

  const onNewTransaction = (callback: (message: WebSocketMessage) => void) => {
    callbacksRef.current.newTransaction.push(callback)
  }

  const onAlert = (callback: (message: WebSocketMessage) => void) => {
    callbacksRef.current.alert.push(callback)
  }

  const onAgentStatus = (callback: (message: WebSocketMessage) => void) => {
    callbacksRef.current.agentStatus.push(callback)
  }

  return {
    isConnected,
    subscribeToAgent,
    unsubscribeFromAgent,
    subscribeToGlobal,
    onTrustScoreUpdate,
    onNewTransaction,
    onAlert,
    onAgentStatus,
  }
}
