import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckIcon, ZapIcon, BuildingIcon, SparklesIcon } from "@/components/icons"

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for testing and small projects",
      features: [
        "Monitor up to 3 AI agents",
        "Real-time trust scoring",
        "7-day transaction history",
        "Basic alerts",
        "Community support",
      ],
      cta: "Start Free",
      href: "/signup",
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "For teams building production AI agents",
      features: [
        "Monitor up to 25 AI agents",
        "Advanced AI analysis",
        "90-day transaction history",
        "Priority alerts & notifications",
        "Multi-chain support",
        "API access",
        "Email support",
      ],
      cta: "Start Free Trial",
      href: "/signup",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations at scale",
      features: [
        "Unlimited AI agents",
        "Custom AI models",
        "Unlimited history",
        "Advanced security features",
        "Dedicated infrastructure",
        "SLA guarantees",
        "24/7 priority support",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ]

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
              <Link href="/pricing" className="text-sm text-white/90 hover:text-white transition-colors">
                Pricing
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-8">
            <SparklesIcon className="w-4 h-4" />
            <span>Beta Pricing - Lock in early rates</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Simple, transparent
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              pricing for everyone
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-b from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.name === "Starter" && <ZapIcon className="w-5 h-5 text-cyan-400" />}
                    {plan.name === "Professional" && <SparklesIcon className="w-5 h-5 text-blue-400" />}
                    {plan.name === "Enterprise" && <BuildingIcon className="w-5 h-5 text-purple-400" />}
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-white/60">{plan.period}</span>}
                  </div>

                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-32 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Frequently asked questions</h2>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-white/60">
                  Yes! The Starter plan is completely free forever. Professional plan includes a 14-day free trial with
                  no credit card required.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-2">Can I change plans later?</h3>
                <p className="text-white/60">
                  Absolutely. Upgrade or downgrade anytime. Changes take effect immediately.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-white/60">
                  We accept all major credit cards, debit cards, and wire transfers for Enterprise plans.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-semibold mb-2">What happens if I exceed my plan limits?</h3>
                <p className="text-white/60">
                  We'll notify you before you hit your limits. You can upgrade anytime to continue monitoring without
                  interruption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
