import { prisma } from "@/lib/prisma"

async function testDatabase() {
  console.log("[v0] Testing database connection...")

  try {
    // Test connection
    await prisma.$connect()
    console.log("✓ Database connected successfully")

    // Test query
    const userCount = await prisma.user.count()
    console.log(`✓ Found ${userCount} users`)

    const agentCount = await prisma.aIAgent.count()
    console.log(`✓ Found ${agentCount} agents`)

    const txCount = await prisma.transaction.count()
    console.log(`✓ Found ${txCount} transactions`)

    console.log("\n[v0] Database test PASSED ✓")
  } catch (error) {
    console.error("[v0] Database test FAILED ✗")
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
