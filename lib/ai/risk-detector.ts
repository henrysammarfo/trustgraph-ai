import type { TrustScoreFactors } from "@/lib/types"

export class RiskDetector {
  detectAnomalies(
    currentFactors: TrustScoreFactors,
    historicalFactors: TrustScoreFactors[],
  ): Array<{
    type: string
    severity: string
    message: string
    confidence: number
  }> {
    const anomalies: Array<{
      type: string
      severity: string
      message: string
      confidence: number
    }> = []

    if (historicalFactors.length === 0) {
      return anomalies
    }

    // Calculate historical averages
    const avgFactors = this.calculateAverageFactors(historicalFactors)

    // Check for sudden drops in success rate
    if (currentFactors.successRate < avgFactors.successRate - 20) {
      anomalies.push({
        type: "success_rate_drop",
        severity: "high",
        message: `Success rate dropped significantly: ${currentFactors.successRate}% (avg: ${avgFactors.successRate}%)`,
        confidence: 0.85,
      })
    }

    // Check for unusual transaction volume
    const volumeDeviation = Math.abs(currentFactors.transactionVolume - avgFactors.transactionVolume)
    if (volumeDeviation > 30) {
      anomalies.push({
        type: "volume_anomaly",
        severity: "medium",
        message: `Unusual transaction volume detected: ${currentFactors.transactionVolume} (avg: ${avgFactors.transactionVolume})`,
        confidence: 0.75,
      })
    }

    // Check for behavioral inconsistency
    if (currentFactors.behavioralConsistency < 40) {
      anomalies.push({
        type: "behavioral_anomaly",
        severity: "medium",
        message: `Highly inconsistent behavior pattern detected`,
        confidence: 0.8,
      })
    }

    // Check for increased risk level
    if (currentFactors.riskLevel > avgFactors.riskLevel + 25) {
      anomalies.push({
        type: "risk_increase",
        severity: "high",
        message: `Risk level increased significantly: ${currentFactors.riskLevel} (avg: ${avgFactors.riskLevel})`,
        confidence: 0.9,
      })
    }

    // Check for gas efficiency issues
    if (currentFactors.gasEfficiency < avgFactors.gasEfficiency - 20) {
      anomalies.push({
        type: "gas_inefficiency",
        severity: "low",
        message: `Gas efficiency decreased: ${currentFactors.gasEfficiency}% (avg: ${avgFactors.gasEfficiency}%)`,
        confidence: 0.7,
      })
    }

    return anomalies
  }

  private calculateAverageFactors(factors: TrustScoreFactors[]): TrustScoreFactors {
    const sum = factors.reduce(
      (acc, f) => ({
        transactionVolume: acc.transactionVolume + f.transactionVolume,
        transactionFrequency: acc.transactionFrequency + f.transactionFrequency,
        gasEfficiency: acc.gasEfficiency + f.gasEfficiency,
        successRate: acc.successRate + f.successRate,
        behavioralConsistency: acc.behavioralConsistency + f.behavioralConsistency,
        riskLevel: acc.riskLevel + f.riskLevel,
      }),
      {
        transactionVolume: 0,
        transactionFrequency: 0,
        gasEfficiency: 0,
        successRate: 0,
        behavioralConsistency: 0,
        riskLevel: 0,
      },
    )

    const count = factors.length

    return {
      transactionVolume: Math.round(sum.transactionVolume / count),
      transactionFrequency: Math.round(sum.transactionFrequency / count),
      gasEfficiency: Math.round(sum.gasEfficiency / count),
      successRate: Math.round(sum.successRate / count),
      behavioralConsistency: Math.round(sum.behavioralConsistency / count),
      riskLevel: Math.round(sum.riskLevel / count),
    }
  }

  assessThreatLevel(
    score: number,
    factors: TrustScoreFactors,
  ): {
    level: "low" | "medium" | "high" | "critical"
    description: string
  } {
    if (score < 30 || factors.riskLevel > 70) {
      return {
        level: "critical",
        description: "Immediate attention required. High risk of malicious activity.",
      }
    }

    if (score < 50 || factors.riskLevel > 50 || factors.successRate < 60) {
      return {
        level: "high",
        description: "Elevated risk detected. Close monitoring recommended.",
      }
    }

    if (score < 70 || factors.behavioralConsistency < 50) {
      return {
        level: "medium",
        description: "Moderate risk. Regular monitoring advised.",
      }
    }

    return {
      level: "low",
      description: "Low risk. Agent behavior appears normal.",
    }
  }
}

export const riskDetector = new RiskDetector()
