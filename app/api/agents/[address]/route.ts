import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params

    const agent = await prisma.aIAgent.findUnique({
      where: { address },
      include: {
        trustScores: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
        transactions: {
          orderBy: { timestamp: "desc" },
          take: 20,
        },
        alerts: {
          where: { resolved: false },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            transactions: true,
            alerts: true,
          },
        },
      },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error("[v0] Error fetching agent:", error)
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params
    const body = await request.json()
    const { status, name, type } = body

    const agent = await prisma.aIAgent.update({
      where: { address },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(type && { type }),
      },
    })

    return NextResponse.json({ agent })
  } catch (error) {
    console.error("[v0] Error updating agent:", error)
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params

    await prisma.aIAgent.delete({
      where: { address },
    })

    return NextResponse.json({ message: "Agent deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting agent:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
