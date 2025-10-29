import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import type { WebSocketMessage } from "@/lib/types"

export class WebSocketServer {
  private io: SocketIOServer | null = null
  private connectedClients: Map<string, Set<string>> = new Map()

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "*",
        methods: ["GET", "POST"],
      },
      path: "/api/socket",
    })

    this.setupEventHandlers()
    console.log("[v0] WebSocket server initialized")
  }

  private setupEventHandlers() {
    if (!this.io) return

    this.io.on("connection", (socket) => {
      console.log(`[v0] Client connected: ${socket.id}`)

      // Handle agent subscription
      socket.on("subscribe_agent", (agentAddress: string) => {
        console.log(`[v0] Client ${socket.id} subscribed to agent: ${agentAddress}`)
        socket.join(`agent:${agentAddress}`)

        // Track subscription
        if (!this.connectedClients.has(agentAddress)) {
          this.connectedClients.set(agentAddress, new Set())
        }
        this.connectedClients.get(agentAddress)?.add(socket.id)
      })

      // Handle agent unsubscription
      socket.on("unsubscribe_agent", (agentAddress: string) => {
        console.log(`[v0] Client ${socket.id} unsubscribed from agent: ${agentAddress}`)
        socket.leave(`agent:${agentAddress}`)

        // Remove from tracking
        this.connectedClients.get(agentAddress)?.delete(socket.id)
      })

      // Handle global subscription
      socket.on("subscribe_global", () => {
        console.log(`[v0] Client ${socket.id} subscribed to global updates`)
        socket.join("global")
      })

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`[v0] Client disconnected: ${socket.id}`)

        // Clean up subscriptions
        this.connectedClients.forEach((clients, agentAddress) => {
          clients.delete(socket.id)
          if (clients.size === 0) {
            this.connectedClients.delete(agentAddress)
          }
        })
      })

      // Send connection confirmation
      socket.emit("connected", {
        message: "Connected to TrustGraph WebSocket server",
        timestamp: new Date(),
      })
    })
  }

  // Broadcast trust score update to specific agent subscribers
  broadcastTrustScoreUpdate(agentAddress: string, data: any) {
    if (!this.io) return

    const message: WebSocketMessage = {
      type: "trust_score_update",
      data,
      timestamp: new Date(),
    }

    this.io.to(`agent:${agentAddress}`).emit("trust_score_update", message)
    console.log(`[v0] Broadcasted trust score update for agent: ${agentAddress}`)
  }

  // Broadcast new transaction to specific agent subscribers
  broadcastNewTransaction(agentAddress: string, data: any) {
    if (!this.io) return

    const message: WebSocketMessage = {
      type: "new_transaction",
      data,
      timestamp: new Date(),
    }

    this.io.to(`agent:${agentAddress}`).emit("new_transaction", message)
    this.io.to("global").emit("new_transaction", message)
    console.log(`[v0] Broadcasted new transaction for agent: ${agentAddress}`)
  }

  // Broadcast alert to specific agent subscribers
  broadcastAlert(agentAddress: string, data: any) {
    if (!this.io) return

    const message: WebSocketMessage = {
      type: "alert",
      data,
      timestamp: new Date(),
    }

    this.io.to(`agent:${agentAddress}`).emit("alert", message)
    this.io.to("global").emit("alert", message)
    console.log(`[v0] Broadcasted alert for agent: ${agentAddress}`)
  }

  // Broadcast agent status change
  broadcastAgentStatus(agentAddress: string, data: any) {
    if (!this.io) return

    const message: WebSocketMessage = {
      type: "agent_status",
      data,
      timestamp: new Date(),
    }

    this.io.to(`agent:${agentAddress}`).emit("agent_status", message)
    this.io.to("global").emit("agent_status", message)
    console.log(`[v0] Broadcasted agent status for: ${agentAddress}`)
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.io?.sockets.sockets.size || 0
  }

  // Get subscribers for specific agent
  getAgentSubscribers(agentAddress: string): number {
    return this.connectedClients.get(agentAddress)?.size || 0
  }
}

export const wsServer = new WebSocketServer()
