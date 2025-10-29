import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { resolved } = body

    const alert = await prisma.alert.update({
      where: { id },
      data: {
        resolved,
        ...(resolved && { resolvedAt: new Date() }),
      },
    })

    return NextResponse.json({ alert })
  } catch (error) {
    console.error("[v0] Error updating alert:", error)
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}
