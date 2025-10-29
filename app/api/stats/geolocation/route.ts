import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // In a real implementation, this would use IP geolocation or blockchain node data
    // For now, return mock data based on transaction patterns

    const transactions = await prisma.transaction.findMany({
      take: 100,
      orderBy: { timestamp: "desc" },
      include: {
        agent: true,
      },
    })

    // Mock geolocation distribution
    const locations = [
      { lat: 40.7128, lng: -74.006, count: 0, country: "United States" },
      { lat: 51.5074, lng: -0.1278, count: 0, country: "United Kingdom" },
      { lat: 35.6762, lng: 139.6503, count: 0, country: "Japan" },
      { lat: 1.3521, lng: 103.8198, count: 0, country: "Singapore" },
      { lat: -33.8688, lng: 151.2093, count: 0, country: "Australia" },
      { lat: 52.52, lng: 13.405, count: 0, country: "Germany" },
      { lat: 48.8566, lng: 2.3522, count: 0, country: "France" },
    ]

    // Distribute transactions across locations
    transactions.forEach((_, index) => {
      const locationIndex = index % locations.length
      locations[locationIndex].count++
    })

    return NextResponse.json({
      locations: locations.filter((loc) => loc.count > 0),
      total: transactions.length,
    })
  } catch (error) {
    console.error("[v0] Geolocation API error:", error)
    return NextResponse.json({ error: "Failed to fetch geolocation data" }, { status: 500 })
  }
}
