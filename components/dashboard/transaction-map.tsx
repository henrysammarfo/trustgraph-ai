"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface TransactionLocation {
  lat: number
  lng: number
  count: number
  country: string
}

export function TransactionMap() {
  const [locations, setLocations] = useState<TransactionLocation[]>([])

  useEffect(() => {
    fetch("/api/stats/geolocation")
      .then((res) => res.json())
      .then((data) => setLocations(data.locations || []))
      .catch((err) => console.error("[v0] Failed to fetch geolocation data:", err))
  }, [])

  // Mock data for visualization
  const mockLocations = [
    { lat: 40.7128, lng: -74.006, count: 45, country: "United States" },
    { lat: 51.5074, lng: -0.1278, count: 32, country: "United Kingdom" },
    { lat: 35.6762, lng: 139.6503, count: 28, country: "Japan" },
    { lat: 1.3521, lng: 103.8198, count: 21, country: "Singapore" },
    { lat: -33.8688, lng: 151.2093, count: 15, country: "Australia" },
  ]

  const displayLocations = locations.length > 0 ? locations : mockLocations

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-900/50 border-slate-800/50 backdrop-blur">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">Transaction Geolocation</h2>
      </div>

      <div className="relative h-[400px] bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
        {/* World map visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
            <path
              d="M 100 250 Q 250 150, 400 250 T 700 250 Q 850 350, 900 250"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-cyan-400"
            />
            <path
              d="M 150 300 Q 300 200, 450 300 T 750 300"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-cyan-400"
            />
          </svg>
        </div>

        {/* Transaction markers */}
        <div className="absolute inset-0 p-8">
          {displayLocations.map((location, index) => {
            const x = ((location.lng + 180) / 360) * 100
            const y = ((90 - location.lat) / 180) * 100

            return (
              <div
                key={index}
                className="absolute group cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Pulsing marker */}
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75" />
                  <div
                    className="relative bg-cyan-400 rounded-full border-2 border-cyan-300 shadow-lg shadow-cyan-400/50"
                    style={{
                      width: `${Math.max(12, Math.min(32, location.count / 2))}px`,
                      height: `${Math.max(12, Math.min(32, location.count / 2))}px`,
                    }}
                  />
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-slate-900 border border-cyan-400/30 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                    <p className="text-white font-semibold text-sm">{location.country}</p>
                    <p className="text-cyan-400 text-xs">{location.count} transactions</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full" />
            <span className="text-slate-400">Transaction Origin</span>
          </div>
        </div>
        <span className="text-slate-500">Total: {displayLocations.reduce((sum, loc) => sum + loc.count, 0)} txs</span>
      </div>
    </Card>
  )
}
