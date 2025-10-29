import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "trustgraph-secret-key-change-in-production-2024")

export interface SessionPayload {
  userId: string
  email: string
  name?: string
  role?: string
}

export async function createSession(userId: string, email: string, name?: string, role?: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const token = await new SignJWT({ userId, email, name, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return {
    user: {
      id: userId,
      email,
      name: name || null,
      role: role || "user",
    },
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)

    return {
      user: {
        id: payload.userId as string,
        email: payload.email as string,
        name: (payload.name as string) || null,
        role: (payload.role as string) || "user",
      },
    }
  } catch (error) {
    console.error("[v0] Session verification error:", error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function verifySession(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as SessionPayload
}
