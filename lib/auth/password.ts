let bcrypt: typeof import("bcryptjs") | null = null

// Only import bcryptjs on the server
if (typeof window === "undefined") {
  try {
    bcrypt = require("bcryptjs")
  } catch (e) {
    console.warn("[v0] bcryptjs not available, using demo mode")
  }
}

export async function hashPassword(password: string): Promise<string> {
  if (!bcrypt) {
    // Simple demo hash (NOT secure, only for demo)
    return `demo_hash_${password}`
  }
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!bcrypt) {
    // Simple demo verification (NOT secure, only for demo)
    return hashedPassword === `demo_hash_${password}`
  }
  return bcrypt.compare(password, hashedPassword)
}
