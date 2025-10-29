import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { config } from "@/lib/config"

export async function GET() {
  const checks = {
    database: false,
    openai: false,
    moralis: false,
    alchemy: false,
    timestamp: new Date().toISOString(),
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (error) {
    console.error("[v0] Database check failed:", error)
  }

  checks.openai = !!config.openai.apiKey
  checks.moralis = !!config.moralis.apiKey
  checks.alchemy = !!config.alchemy.apiKey

  const allHealthy = Object.values(checks).every((v) => v === true || typeof v === "string")

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      checks,
    },
    { status: allHealthy ? 200 : 503 },
  )
}
