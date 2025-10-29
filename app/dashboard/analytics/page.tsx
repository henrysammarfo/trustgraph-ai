import { DashboardHeader } from "@/components/dashboard/header"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { TransactionMap } from "@/components/dashboard/transaction-map"
import { AgentComparison } from "@/components/dashboard/agent-comparison"
import { Card } from "@/components/ui/card"
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardHeader />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-slate-400 mt-1">Comprehensive insights into agent trust metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Trust Score</p>
                <p className="text-3xl font-bold text-cyan-400 mt-1">78.5</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-xs text-emerald-400 mt-2">↑ 5.2% from last week</p>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Transactions</p>
                <p className="text-3xl font-bold text-white mt-1">12,847</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xs text-emerald-400 mt-2">↑ 12.3% from last week</p>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Alerts</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">23</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xs text-red-400 mt-2">↑ 3 new alerts today</p>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Success Rate</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">94.2%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-400 mt-2">↑ 1.8% from last week</p>
          </Card>
        </div>

        <AnalyticsCharts />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionMap />
          <AgentComparison />
        </div>
      </main>
    </div>
  )
}
