import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { createSession, verifySession } from "@/lib/auth/session"

async function testAuth() {
  console.log("[v0] Testing authentication system...")

  try {
    // Test password hashing
    const password = "TestPassword123!"
    const hashed = await hashPassword(password)
    console.log("✓ Password hashed successfully")

    const isValid = await verifyPassword(password, hashed)
    if (!isValid) throw new Error("Password verification failed")
    console.log("✓ Password verification works")

    // Test session creation
    const session = await createSession({ userId: "test-user-id", email: "test@example.com" })
    console.log("✓ Session created successfully")

    // Test session verification
    const payload = await verifySession(session)
    if (payload.userId !== "test-user-id") throw new Error("Session verification failed")
    console.log("✓ Session verification works")

    console.log("\n[v0] Authentication test PASSED ✓")
  } catch (error) {
    console.error("[v0] Authentication test FAILED ✗")
    console.error(error)
    process.exit(1)
  }
}

testAuth()
