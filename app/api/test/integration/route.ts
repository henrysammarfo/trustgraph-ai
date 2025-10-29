import { NextResponse } from "next/server"
import { moralisService } from "@/lib/blockchain/moralis"
import { alchemyService } from "@/lib/blockchain/alchemy"
import { openai } from "@/lib/ai/analyzer"

export async function POST(request: Request) {
  const { testType, address } = await request.json()

  try {
    if (testType === "moralis") {
      const testAddress = address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
      const transactions = await moralisService.getWalletTransactions(testAddress, "eth")

      return NextResponse.json({
        success: true,
        service: "Moralis",
        transactionCount: transactions.length,
        sample: transactions.slice(0, 3),
      })
    }

    if (testType === "alchemy") {
      const testAddress = address || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
      const balance = await alchemyService.getBalance(testAddress, 1)

      return NextResponse.json({
        success: true,
        service: "Alchemy",
        balance,
      })
    }

    if (testType === "openai") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Say 'API test successful' if you can read this." }],
        max_tokens: 20,
      })

      return NextResponse.json({
        success: true,
        service: "OpenAI",
        response: completion.choices[0].message.content,
      })
    }

    return NextResponse.json({ error: "Invalid test type" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        service: testType,
      },
      { status: 500 },
    )
  }
}
