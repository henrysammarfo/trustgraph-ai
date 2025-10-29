import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Terms of Service
        </h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-slate-400">Last updated: January 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300">
              By accessing and using TrustGraph ("Service"), you accept and agree to be bound by the terms and provision
              of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
            <p className="text-slate-300">
              Permission is granted to temporarily access the Service for personal, non-commercial transitory viewing
              only. This is the grant of a license, not a transfer of title.
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Monitor AI agents and blockchain transactions</li>
              <li>Access analytics and trust scores</li>
              <li>Receive real-time alerts and notifications</li>
              <li>Export data for compliance purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Service Description</h2>
            <p className="text-slate-300">
              TrustGraph provides AI-powered monitoring and trust analysis for blockchain-based AI agents. The Service
              includes:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Real-time transaction monitoring across multiple blockchains</li>
              <li>AI-powered behavioral analysis and anomaly detection</li>
              <li>Trust scoring and risk assessment</li>
              <li>Alert system for suspicious activities</li>
              <li>Analytics dashboard and reporting tools</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. User Responsibilities</h2>
            <p className="text-slate-300">You agree to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Provide accurate information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the Service in compliance with all applicable laws</li>
              <li>Not attempt to circumvent security measures</li>
              <li>Not use the Service for illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data and Privacy</h2>
            <p className="text-slate-300">
              We collect and process blockchain data, transaction information, and usage analytics. All data handling
              complies with our Privacy Policy and applicable data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer</h2>
            <p className="text-slate-300">
              The Service is provided "as is" without warranties of any kind. TrustGraph does not guarantee the
              accuracy, completeness, or reliability of trust scores and analysis. Users should conduct their own due
              diligence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-300">
              TrustGraph shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Modifications</h2>
            <p className="text-slate-300">
              We reserve the right to modify these terms at any time. Continued use of the Service after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
            <p className="text-slate-300">For questions about these Terms, contact us at legal@trustgraph.ai</p>
          </section>
        </div>
      </div>
    </div>
  )
}
