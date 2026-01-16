/**
 * FOCUS 1.3 Strict Schema Definition
 * Based on FinOps Open Cost & Usage Specification
 */

// Mandatory Columns for 1.3 Compliance (Mental Model)
// We use a simple JS object validation approach for maximum portability (lightweight)

export const FOCUS_SCHEMA = {
  // Dimensions
  ProviderName: { required: true, type: "string" }, // e.g., 'AWS', 'PrivateDC'
  RegionName: { required: true, type: "string" },
  ServiceCategory: { required: true, type: "string" }, // 'Compute', 'Storage'
  ServiceName: { required: true, type: "string" },
  ResourceName: { required: false, type: "string" },

  // Billing
  BillingPeriodStart: { required: true, type: "datetime" },
  BillingPeriodEnd: { required: true, type: "datetime" },
  ChargeCategory: { required: true, type: "string" }, // 'Usage', 'Purchase'

  // Metrics (The "Spot On" Logic)
  BilledCost: { required: true, type: "number" },
  EffectiveCost: { required: true, type: "number" }, // Key for Comparison (Amortized)
  PricingQuantity: { required: true, type: "number" },
  PricingUnit: { required: true, type: "string" }, // 'Hours', 'GB-Mo'

  // 1.3 Specifics
  AllocatedMethodDetails: { required: false, type: "string" }, // For Split Costs
  ContractCommitmentId: { required: false, type: "string" }, // New in 1.3
};

/**
 * Validates a single row object against FOCUS 1.3 Spec
 * @param {Object} row - The data row to validate
 * @returns {Array} errors - List of validation errors, empty if valid
 */
export function validateFocusRow(row) {
  const errors = [];

  // Standard Checks
  if (!row.ProviderName) errors.push("Missing ProviderName");
  if (!row.BillingPeriodStart) errors.push("Missing BillingPeriodStart");

  // Numeric Checks
  const effectiveCost = parseFloat(row.EffectiveCost);
  if (isNaN(effectiveCost)) errors.push("EffectiveCost must be a valid number");

  // Logic Validations
  if (row.BillingPeriodEnd < row.BillingPeriodStart) {
    errors.push("BillingPeriodEnd cannot be before BillingPeriodStart");
  }

  return errors;
}

/**
 * Normalizes Private Datacenter Metrics into FOCUS Format
 * @param {Object} inputs - Private DC Inputs (Hardware Cost, Power, etc.)
 * @returns {Array} rows - Array of FOCUS-compliant objects
 */
export function normalizePrivateDcToFocus(inputs) {
  const rows = [];
  const billingStart = new Date().toISOString(); // Simulation for now

  // Logic: Amortize Hardware over 3-5 Years (Straight Line)
  // Input: totalHardwareCost, usefulLifeYears
  const monthlyHardwareCost =
    inputs.totalHardwareCost / (inputs.usefulLifeYears * 12);

  rows.push({
    ProviderName: "PrivateDC",
    RegionName: "On-Prem",
    ServiceCategory: "Compute",
    ServiceName: "Dedicated Hardware",
    ChargeCategory: "Usage", // Treated as usage of owned asset
    PricingUnit: "Month",
    PricingQuantity: 1,
    BilledCost: 0, // Already paid (Capex), so Billed is 0 in Opex view? Or we map Capex?
    // FinOps Standard: We usually compare Amortized (Effective) Cost for fairness.
    EffectiveCost: monthlyHardwareCost,
    BillingPeriodStart: billingStart,
    description: "Hardware Depreciation (Amortized)",
  });

  // Power & Cooling
  // Input: monthlyPowerCost
  rows.push({
    ProviderName: "PrivateDC",
    RegionName: "On-Prem",
    ServiceCategory: "Support", // Or 'Overhead'
    ServiceName: "Power & Cooling",
    ChargeCategory: "Usage",
    PricingUnit: "Month",
    PricingQuantity: 1,
    BilledCost: inputs.monthlyPowerCost,
    EffectiveCost: inputs.monthlyPowerCost,
    BillingPeriodStart: billingStart,
  });

  return rows;
}
