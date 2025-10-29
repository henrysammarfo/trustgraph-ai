export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4",
  },

  // Moralis Configuration
  moralis: {
    apiKey: process.env.MORALIS_API_KEY || "",
    baseUrl: "https://deep-index.moralis.io/api/v2",
    nodeUrl: process.env.MORALIS_NODE_URL || "https://site1.moralis-nodes.com/eth/5437e99e8d30460e90f04f664dfc64cf",
  },

  // Alchemy Configuration
  alchemy: {
    apiKey: process.env.ALCHEMY_API_KEY || "",
    httpsUrl: process.env.ALCHEMY_HTTPS_URL || "",
    networks: {
      ethereum: process.env.ALCHEMY_HTTPS_URL || `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      polygon: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
  },

  // Redis Configuration (Upstash)
  redis: {
    url: process.env.KV_REST_API_URL || "",
    token: process.env.KV_REST_API_TOKEN || "",
  },

  // WebSocket Configuration
  websocket: {
    port: Number.parseInt(process.env.WS_PORT || "3001"),
  },

  // Supported Chains
  chains: {
    1: { name: "Ethereum", rpc: "ethereum" },
    137: { name: "Polygon", rpc: "polygon" },
    42161: { name: "Arbitrum", rpc: "arbitrum" },
    56: { name: "BSC", rpc: "bsc" },
  },

  // Trust Score Thresholds
  trustScore: {
    critical: 30,
    warning: 50,
    good: 70,
    excellent: 85,
  },

  // Analysis Configuration
  analysis: {
    minTransactionsForAnalysis: 5,
    analysisInterval: 300000, // 5 minutes
    alertThreshold: 0.7,
  },
}
