import { config } from "@/lib/config"

console.log("=".repeat(60))
console.log("TRUSTGRAPH - SETUP VERIFICATION")
console.log("=".repeat(60))

const checks = {
  "Database URL": !!process.env.NEON_DATABASE_URL,
  "OpenAI API Key": !!config.openai.apiKey,
  "Moralis API Key": !!config.moralis.apiKey,
  "Alchemy API Key": !!config.alchemy.apiKey,
  "JWT Secret": !!process.env.JWT_SECRET,
}

console.log("\nEnvironment Variables:")
console.log("-".repeat(60))

let allPassed = true
for (const [key, value] of Object.entries(checks)) {
  const status = value ? "✓" : "✗"
  const color = value ? "\x1b[32m" : "\x1b[31m"
  console.log(`${color}${status}\x1b[0m ${key}`)
  if (!value) allPassed = false
}

console.log("\n" + "=".repeat(60))
if (allPassed) {
  console.log("\x1b[32m✓ All environment variables configured!\x1b[0m")
  console.log("\nNext steps:")
  console.log("1. Run: npm run db:init")
  console.log("2. Run: npm run dev")
  console.log("3. Visit: http://localhost:3000")
} else {
  console.log("\x1b[31m✗ Missing required environment variables\x1b[0m")
  console.log("\nPlease check .env.local and add missing variables")
  process.exit(1)
}
console.log("=".repeat(60))
