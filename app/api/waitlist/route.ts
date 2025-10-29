import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const waitlistSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  company: z.string().optional(),
  useCase: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = waitlistSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.waitlistEntry.findUnique({
      where: { email: data.email },
    })

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create waitlist entry
    const entry = await prisma.waitlistEntry.create({
      data: {
        email: data.email,
        name: data.name,
        company: data.company,
        useCase: data.useCase,
        source: data.source || "landing_page",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Successfully joined waitlist",
      id: entry.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    console.error("[v0] Waitlist error:", error)
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = await prisma.waitlistEntry.aggregate({
      _count: true,
    })

    const recentEntries = await prisma.waitlistEntry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        email: true,
        company: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      total: stats._count,
      recent: recentEntries,
    })
  } catch (error) {
    console.error("[v0] Waitlist stats error:", error)
    return NextResponse.json({ error: "Failed to fetch waitlist stats" }, { status: 500 })
  }
}
