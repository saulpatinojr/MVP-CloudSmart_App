/**
 * CloudSmart Insight Generator
 * Generates natural language explanations and detects anomalies in FinOps data.
 */

export const InsightGenerator = {
  /**
   * Scans for cost spikes > 2 standard deviations
   * @param {Array} data - Array of cost objects
   * @returns {Array} anomalies - List of detected issues
   */
  detectAnomalies: (data) => {
    if (!data || data.length < 2) return [];

    // Calculate Stats
    const costs = data.map((d) => d.EffectiveCost);
    const mean = costs.reduce((a, b) => a + b, 0) / costs.length;
    const stdDev = Math.sqrt(
      costs.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
        costs.length,
    );

    const anomalies = [];

    data.forEach((row, i) => {
      if (row.EffectiveCost > mean + stdDev * 1.5) {
        anomalies.push({
          id: i,
          severity: row.EffectiveCost > mean + stdDev * 2.5 ? "high" : "medium",
          title: `Cost Spike Detected: ${row.ServiceName || "Unknown Service"}`,
          message: `${row.ServiceName} cost ($${row.EffectiveCost.toFixed(0)}) is significantly higher than the average ($${mean.toFixed(0)}).`,
          service: row.ServiceName,
          cost: row.EffectiveCost,
        });
      }
    });

    return anomalies;
  },

  /**
   * Generates an "Executive Summary" text block
   * @param {Object} privateDc - Normalized Private DC metrics
   * @param {Object} publicCloud - (Optional) Public cloud comparison metrics
   */
  generateExecutiveSummary: (privateDcRows, publicCloudRows = []) => {
    const totalPrivate = privateDcRows.reduce(
      (acc, r) => acc + r.EffectiveCost,
      0,
    );
    const computeCost = privateDcRows
      .filter((r) => r.ServiceCategory === "Compute")
      .reduce((acc, r) => acc + r.EffectiveCost, 0);

    const insights = [
      `Current Private Datacenter spend is projected at $${totalPrivate.toLocaleString()}/month.`,
      `Compute infrastructure accounts for ${Math.round((computeCost / totalPrivate) * 100)}% of total OPEX.`,
    ];

    // Efficiency Insight
    const overhead =
      privateDcRows.find((r) => r.ServiceCategory === "Support")
        ?.EffectiveCost || 0;
    if (overhead > computeCost * 0.4) {
      insights.push(
        `⚠️ Overhead costs (Power/Cooling) are high (${Math.round((overhead / totalPrivate) * 100)}%). Improving PUE could save estimated $${Math.round(overhead * 0.1).toLocaleString()}/mo.`,
      );
    } else {
      insights.push(
        `✅ Efficiency is healthy. Overhead is effectively managed.`,
      );
    }

    return insights;
  },
};
