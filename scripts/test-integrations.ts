import { moralisService } from "@/lib/blockchain/moralis"
import { alchemyService } from "@/lib/blockchain/alchemy"

async function testIntegrations() {
  console.log("[v0] Testing external integrations...")

  // Test Moralis
  try {
    console.log("\n[v0] Testing Moralis API...")
    const testAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    const transactions = await moralisService.getWalletTransactions(testAddress)
    console.log(`✓ Moralis API works - fetched ${transactions.length} transactions`)
  } catch (error) {
    console.error("✗ Moralis API test failed:", error)
  }

  // Test Alchemy
  try {
    console.log("\n[v0] Testing Alchemy API...")
    const testAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    const transactions = await alchemyService.getWalletTransactions(testAddress)
    console.log(`✓ Alchemy API works - fetched ${transactions.length} transactions`)
  } catch (error) {
    console.error("✗ Alchemy API test failed:", error)
  }

  // Test OpenAI
  try {
    console.log("\n[v0] Testing OpenAI API...")
    const { generateText } = await import("ai")
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: "Say 'API test successful' in exactly 3 words.",
      maxTokens: 10,
    })
    console.log(`✓ OpenAI API works - response: ${text}`)
  } catch (error) {
    console.error("✗ OpenAI API test failed:", error)
  }

  console.log("\n[v0] Integration tests complete")
}

testIntegrations()
