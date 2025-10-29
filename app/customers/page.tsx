// Customer case studies and testimonials page
"use client"

import { Shield, TrendingUp, AlertTriangle, ArrowRight, Building2, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
          >
            TrustGraph
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/customers" className="text-sm text-white font-medium">
              Customers
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Trusted by Forward-Thinking Teams
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See how organizations are using TrustGraph to monitor AI agents and prevent fraud in real-time
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
              <DollarSign className="w-12 h-12 text-cyan-400 mb-4" />
              <div className="text-4xl font-bold mb-2">$2.3B+</div>
              <div className="text-gray-400">Assets Protected</div>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
              <AlertTriangle className="w-12 h-12 text-emerald-400 mb-4" />
              <div className="text-4xl font-bold mb-2">847</div>
              <div className="text-gray-400">Threats Detected</div>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
              <Users className="w-12 h-12 text-cyan-400 mb-4" />
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-gray-400">Beta Partners</div>
            </div>
          </div>

          {/* Case Studies */}
          <div className="space-y-12 mb-20">
            {/* Case Study 1 */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">DeFi Protocol</h3>
                  <p className="text-gray-400">Automated Market Maker with $500M TVL</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-cyan-400">Challenge</h4>
                <p className="text-gray-300 leading-relaxed">
                  Managing 15+ AI trading agents across multiple chains with no unified monitoring. Experienced a $2.3M
                  loss from a compromised agent before implementing TrustGraph.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-emerald-400">Solution</h4>
                <p className="text-gray-300 leading-relaxed">
                  Deployed TrustGraph to monitor all agents in real-time with AI-powered anomaly detection. Set up
                  custom alerts for unusual transaction patterns and behavioral changes.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-cyan-400">Results</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">100%</div>
                    <div className="text-sm text-gray-400">Threat Detection Rate</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">$8.5M</div>
                    <div className="text-sm text-gray-400">Fraud Prevented</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">45s</div>
                    <div className="text-sm text-gray-400">Avg. Alert Time</div>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-cyan-500 pl-6 py-2 italic text-gray-300">
                "TrustGraph gave us the confidence to scale our AI agent operations. We now monitor $500M in assets with
                complete visibility and peace of mind."
                <footer className="text-sm text-gray-400 mt-2 not-italic">— CTO, Leading DeFi Protocol</footer>
              </blockquote>
            </div>

            {/* Case Study 2 */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">AI Trading Firm</h3>
                  <p className="text-gray-400">Quantitative hedge fund managing $1.2B AUM</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-cyan-400">Challenge</h4>
                <p className="text-gray-300 leading-relaxed">
                  Operating 50+ autonomous trading agents with limited oversight. Needed real-time behavioral analysis
                  to detect model drift and potential exploits.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-emerald-400">Solution</h4>
                <p className="text-gray-300 leading-relaxed">
                  Integrated TrustGraph's AI trust scoring system to continuously evaluate agent behavior. Implemented
                  automated circuit breakers for anomalous activity.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-cyan-400">Results</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">99.8%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">12</div>
                    <div className="text-sm text-gray-400">Exploits Prevented</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">3x</div>
                    <div className="text-sm text-gray-400">Faster Response</div>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 italic text-gray-300">
                "The AI-powered trust scoring is a game-changer. We can now identify behavioral anomalies before they
                become costly problems."
                <footer className="text-sm text-gray-400 mt-2 not-italic">
                  — Head of Risk, Quantitative Trading Firm
                </footer>
              </blockquote>
            </div>

            {/* Case Study 3 */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Web3 Gaming Platform</h3>
                  <p className="text-gray-400">NFT marketplace with 2M+ users</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-cyan-400">Challenge</h4>
                <p className="text-gray-300 leading-relaxed">
                  Deploying AI agents for automated NFT pricing and market making. Needed to ensure agents weren't
                  manipulated or exploited by bad actors.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-emerald-400">Solution</h4>
                <p className="text-gray-300 leading-relaxed">
                  Used TrustGraph's multi-chain monitoring to track agent transactions across Ethereum, Polygon, and
                  Solana. Enabled real-time alerts for suspicious patterns.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-cyan-400">Results</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">95%</div>
                    <div className="text-sm text-gray-400">Fraud Reduction</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">$3.2M</div>
                    <div className="text-sm text-gray-400">Assets Secured</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">24/7</div>
                    <div className="text-sm text-gray-400">Monitoring</div>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-cyan-500 pl-6 py-2 italic text-gray-300">
                "TrustGraph's multi-chain support was exactly what we needed. We can now monitor all our agents from a
                single dashboard."
                <footer className="text-sm text-gray-400 mt-2 not-italic">
                  — VP Engineering, Web3 Gaming Platform
                </footer>
              </blockquote>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20">
            <h2 className="text-4xl font-bold mb-4">Join Our Beta Program</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Get early access to TrustGraph and help shape the future of AI agent monitoring
            </p>
            <Link
              href="/beta"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all"
            >
              Apply for Beta Access
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
