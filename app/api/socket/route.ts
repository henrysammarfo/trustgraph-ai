import { type NextRequest, NextResponse } from "next/server"

// This route is used to initialize the WebSocket server
// The actual WebSocket server is initialized in a custom server setup

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "WebSocket server endpoint",
    status: "active",
  })
}
