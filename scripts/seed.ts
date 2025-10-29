import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo AI agents
  const agents = await Promise.all([
    prisma.aIAgent.upsert({
      where: { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
      update: {},
      create: {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        name: 'DeFi Optimizer Pro',
        type: 'DeFi',
        trustScore: 87.5,
        status: 'active',
        metadata: { version: '2.1.0', deployedAt: '2024-01-15' },
      },
    }),
    prisma.aIAgent.upsert({
      where: { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' },
      update: {},
      create: {
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        name: 'Trading Bot Alpha',
        type: 'Trading',
        trustScore: 72.3,
        status: 'active',
        metadata: { version: '1.5.2', deployedAt: '2024-02-01' },
      },
    }),
    prisma.aIAgent.upsert({
      where: { address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6' },
      update: {},
      create: {
        address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
        name: 'Governance Delegate',
        type: 'Governance',
        trustScore: 94.8,
        status: 'active',
        metadata: { version: '3.0.1', deployedAt: '2023-12-10' },
      },
    }),
    prisma.aIAgent.upsert({
      where: { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' },
      update: {},
      create: {
        address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        name: 'Yield Farmer X',
        type: 'DeFi',
        trustScore: 45.2,
        status: 'flagged',
        metadata: { version: '1.0.0', deployedAt: '2024-03-01' },
      },
    }),
    prisma.aIAgent.upsert({
      where: { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' },
      update: {},
      create: {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        name: 'Arbitrage Hunter',
        type: 'Trading',
        trustScore: 81.7,
        status: 'active',
        metadata: { version: '2.3.0', deployedAt: '2024-01-20' },
      },
    }),
  ])

  console.log(`✅ Created ${agents.length} agents`)

  // Create sample transactions for the first agent
  const agent1 = agents[0]
  const transactions = []
  for (let i = 0; i < 10; i++) {
    const tx = await prisma.transaction.create({
      data: {
        hash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        agentId: agent1.id,
        from: agent1.address,
        to: `0x${Math.random().toString(36).substring(2, 15)}`,
        value: `${Math.floor(Math.random() * 10)}000000000000000000`,
        gasUsed: `${21000 + Math.floor(Math.random() * 50000)}`,
        gasPrice: `${Math.floor(Math.random() * 100)}000000000`,
        status: Math.random() > 0.95 ? 'failed' : 'success',
        chainId: 1,
        blockNumber: 18000000 + i,
        timestamp: new Date(Date.now() - i * 3600000),
        analyzed: true,
      },
    })
    transactions.push(tx)
  }

  console.log(`✅ Created ${transactions.length} transactions`)

  // Create trust scores
  for (const agent of agents) {
    await prisma.trustScore.create({
      data: {
        agentId: agent.id,
        score: agent.trustScore,
        factors: {
          transactionVolume: Math.random() * 100,
          successRate: 85 + Math.random() * 15,
          gasEfficiency: 70 + Math.random() * 30,
          behaviorConsistency: 80 + Math.random() * 20,
        },
        analysis: `AI analysis for ${agent.name}: ${
          agent.trustScore > 80
            ? 'Excellent performance with consistent behavior patterns.'
            : agent.trustScore > 60
            ? 'Good performance with minor anomalies detected.'
            : 'Concerning patterns detected. Recommend monitoring.'
        }`,
        confidence: 0.75 + Math.random() * 0.2,
      },
    })
  }

  console.log('✅ Created trust scores')

  // Create alerts for flagged agent
  const flaggedAgent = agents.find((a) => a.status === 'flagged')
  if (flaggedAgent) {
    await prisma.alert.createMany({
      data: [
        {
          agentId: flaggedAgent.id,
          type: 'anomaly',
          severity: 'high',
          message: 'Unusual transaction pattern detected',
          details: { pattern: 'high_frequency', threshold_exceeded: true },
          resolved: false,
        },
        {
          agentId: flaggedAgent.id,
          type: 'risk',
          severity: 'critical',
          message: 'Trust score dropped below 50',
          details: { previous_score: 52.1, current_score: 45.2 },
          resolved: false,
        },
      ],
    })

    console.log('✅ Created alerts')
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
