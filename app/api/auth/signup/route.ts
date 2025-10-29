import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = signupSchema.parse(body)

    console.log("[v0] Creating demo account for:", email)
    const session = await createSession(`demo-${Date.now()}`, email, name || "Demo User", "user")

    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
