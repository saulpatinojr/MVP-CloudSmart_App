/**
 * Simple Linear Regression Forecaster
 * Projects future costs based on historical data points.
 */

export const Forecaster = {
  /**
   * Forecasts the next N months
   * @param {Array} history - Array of { month: number, cost: number }
   * @param {number} monthsToProject - Number of future months
   */
  predict: (history, monthsToProject = 6) => {
    if (!history || history.length < 2) return [];

    // 1. Prepare Data
    const n = history.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;

    history.forEach((point, i) => {
      const x = i; // Time index
      const y = point.cost;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    // 2. Calculate Slope (m) and Intercept (b)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // 3. Generate Projections
    const projections = [];
    const lastMonthIndex = n - 1;

    for (let i = 1; i <= monthsToProject; i++) {
      const futureX = lastMonthIndex + i;
      const predictedCost = slope * futureX + intercept;

      // Ensure we don't predict negative cost (unless huge savings!)
      const safeCost = Math.max(0, predictedCost);

      // Add some "noise" or confidence interval in a real ML model
      // For simple linear, we just return the line
      projections.push({
        monthIndex: futureX,
        predictedCost: safeCost,
        trend: slope > 0 ? "increasing" : "decreasing",
      });
    }

    return {
      slope,
      intercept,
      projections,
    };
  },
};
