import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldIcon, ZapIcon, UsersIcon, TargetIcon } from "@/components/icons"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            >
              TrustGraph
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-sm text-white/90 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                Sign in
              </Link>
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Building trust in the
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              age of AI agents
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-12 leading-relaxed">
            TrustGraph was founded in 2024 with a simple mission: make AI agents trustworthy and transparent. As
            autonomous agents handle billions in transactions, trust isn't optional—it's essential.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                We're building the infrastructure for AI agent trust. Every transaction, every decision, every
                interaction—monitored, analyzed, and scored in real-time.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                Our platform combines blockchain transparency with AI-powered analysis to give you complete visibility
                into your AI agents' behavior.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                <ShieldIcon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Trust First</h3>
                <p className="text-white/60 text-sm">Security and transparency in every feature</p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <ZapIcon className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Real-time</h3>
                <p className="text-white/60 text-sm">Instant monitoring and alerts</p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <UsersIcon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Community</h3>
                <p className="text-white/60 text-sm">Built with feedback from AI developers</p>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-cyan-500/10 border border-pink-500/20">
                <TargetIcon className="w-8 h-8 text-pink-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Focused</h3>
                <p className="text-white/60 text-sm">One goal: make AI agents trustworthy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                $2B+
              </div>
              <div className="text-white/60">Assets Monitored</div>
            </div>

            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-white/60">Transactions Analyzed</div>
            </div>

            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-white/60">Uptime</div>
            </div>

            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                &lt;100ms
              </div>
              <div className="text-white/60">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to build trust?</h2>
          <p className="text-xl text-white/60 mb-12">
            Join developers monitoring AI agents across multiple blockchains
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Link href="/signup">Start Monitoring Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
