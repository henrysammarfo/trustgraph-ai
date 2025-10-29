import { execSync } from "child_process"

async function runAllTests() {
  console.log("=".repeat(60))
  console.log("TRUSTGRAPH - COMPREHENSIVE TEST SUITE")
  console.log("=".repeat(60))

  const tests = [
    { name: "Database", script: "test-database" },
    { name: "Authentication", script: "test-auth" },
    { name: "Integrations", script: "test-integrations" },
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    console.log(`\n${"=".repeat(60)}`)
    console.log(`Running ${test.name} Tests...`)
    console.log("=".repeat(60))

    try {
      execSync(`tsx scripts/${test.script}.ts`, { stdio: "inherit" })
      passed++
    } catch (error) {
      failed++
      console.error(`\n✗ ${test.name} tests failed`)
    }
  }

  console.log("\n" + "=".repeat(60))
  console.log("TEST SUMMARY")
  console.log("=".repeat(60))
  console.log(`Passed: ${passed}/${tests.length}`)
  console.log(`Failed: ${failed}/${tests.length}`)
  console.log("=".repeat(60))

  if (failed > 0) {
    process.exit(1)
  }
}

runAllTests()
