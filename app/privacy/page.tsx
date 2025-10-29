import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-slate-400">Last updated: January 2025</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="text-slate-300">We collect the following types of information:</p>

            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Account Information</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Email address and name</li>
              <li>Company information (optional)</li>
              <li>Account preferences and settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Blockchain Data</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Wallet addresses you choose to monitor</li>
              <li>Transaction data from public blockchains</li>
              <li>Smart contract interactions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mt-4 mb-2">Usage Data</h3>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Dashboard interactions and feature usage</li>
              <li>Alert preferences and configurations</li>
              <li>Analytics and performance metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-300">We use collected information to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Provide and improve the TrustGraph service</li>
              <li>Monitor AI agents and analyze blockchain transactions</li>
              <li>Generate trust scores and risk assessments</li>
              <li>Send alerts and notifications</li>
              <li>Communicate service updates and security notices</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Storage and Security</h2>
            <p className="text-slate-300">We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Encrypted data transmission (TLS/SSL)</li>
              <li>Secure database storage with encryption at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Data backup and disaster recovery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing</h2>
            <p className="text-slate-300">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Service providers (hosting, analytics, blockchain APIs)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p className="text-slate-300">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
            <p className="text-slate-300">
              We use cookies and similar technologies for authentication, preferences, and analytics. You can control
              cookie settings through your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
            <p className="text-slate-300">
              We retain your data for as long as your account is active or as needed to provide services. Blockchain
              data may be retained longer for compliance and security purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. International Data Transfers</h2>
            <p className="text-slate-300">
              Your data may be transferred to and processed in countries outside your residence. We ensure appropriate
              safeguards are in place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Privacy Policy</h2>
            <p className="text-slate-300">
              We may update this policy periodically. We will notify you of significant changes via email or dashboard
              notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
            <p className="text-slate-300">
              For privacy questions or to exercise your rights, contact us at privacy@trustgraph.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
