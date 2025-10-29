import { neon } from "@neondatabase/serverless"
import { readFileSync } from "fs"
import { join } from "path"

async function initDatabase() {
  const sql = neon(process.env.NEON_DATABASE_URL!)

  console.log("[v0] Starting database initialization...")

  try {
    // Read and execute init script
    const initScript = readFileSync(join(process.cwd(), "scripts", "001-init-database.sql"), "utf-8")
    console.log("[v0] Creating tables...")
    await sql(initScript)
    console.log("[v0] ✓ Tables created successfully")

    // Read and execute seed script
    const seedScript = readFileSync(join(process.cwd(), "scripts", "002-seed-demo-data.sql"), "utf-8")
    console.log("[v0] Seeding demo data...")
    await sql(seedScript)
    console.log("[v0] ✓ Demo data seeded successfully")

    // Verify data
    const agentCount = await sql`SELECT COUNT(*) as count FROM "AIAgent"`
    const txCount = await sql`SELECT COUNT(*) as count FROM "Transaction"`
    const scoreCount = await sql`SELECT COUNT(*) as count FROM "TrustScore"`
    const alertCount = await sql`SELECT COUNT(*) as count FROM "Alert"`

    console.log("\n[v0] Database initialized successfully!")
    console.log(`[v0] - Agents: ${agentCount[0].count}`)
    console.log(`[v0] - Transactions: ${txCount[0].count}`)
    console.log(`[v0] - Trust Scores: ${scoreCount[0].count}`)
    console.log(`[v0] - Alerts: ${alertCount[0].count}`)
  } catch (error) {
    console.error("[v0] Database initialization failed:", error)
    throw error
  }
}

initDatabase()
