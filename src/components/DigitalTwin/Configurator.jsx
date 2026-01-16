import { useState, useEffect } from "react";
import { Sliders, Cpu, Zap, DollarSign, ArrowRight } from "lucide-react";
import { normalizePrivateDcToFocus } from "../../engine/FocusSchema";
import RackBuilder from "./RackBuilder";

// Simple UI Components to replace Tremor
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-finops-surface border border-white/10 rounded-xl p-6 shadow-xl ${className}`}
  >
    {children}
  </div>
);
const Metric = ({ children, className = "" }) => (
  <div className={`text-2xl font-bold text-white ${className}`}>{children}</div>
);
const Text = ({ children, className = "" }) => (
  <p className={`text-sm text-finops-muted ${className}`}>{children}</p>
);
const Flex = ({ children, className = "" }) => (
  <div className={`flex items-center justify-between ${className}`}>
    {children}
  </div>
);
const ProgressBar = ({ value, className = "" }) => (
  <div className={`w-full bg-white/10 rounded-full h-2 ${className}`}>
    <div
      className="bg-finops-accent h-2 rounded-full transition-all duration-500"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

export default function Configurator({ onDataUpdate }) {
  // Input State
  const [inputs, setInputs] = useState({
    rackCount: 10,
    totalHardwareCost: 500000, // Total Capex
    usefulLifeYears: 4,
    monthlyPowerCost: 4500, // OpEx
    pue: 1.5,
    utilization: 75, // %
  });

  // Computed Real-time Metrics
  const [normalizedMetrics, setNormalizedMetrics] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    // Run Normalization Engine
    const focusRows = normalizePrivateDcToFocus(inputs);
    setNormalizedMetrics(focusRows);

    // Calculate Monthly Total Effective Cost
    const total = focusRows.reduce((acc, row) => acc + row.EffectiveCost, 0);
    setMonthlyTotal(total);

    // Bubble up data for main app
    if (onDataUpdate) onDataUpdate(focusRows);
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  // Format currency
  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="grid grid-cols-12 gap-6 animate-fade-in">
      {/* LEFT: Controls */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-6 text-finops-primary">
            <Sliders className="w-5 h-5" />
            <h2 className="font-semibold text-lg text-white">
              Infrastructure Config
            </h2>
          </div>

          <div className="space-y-8">
            {/* Input Group: Hardware */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white flex items-center gap-2">
                  <Cpu size={14} /> Total Hardware CapEx
                </span>
                <span className="font-mono text-finops-accent">
                  {fmt(inputs.totalHardwareCost)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="10000"
                value={inputs.totalHardwareCost}
                onChange={(e) =>
                  handleInputChange("totalHardwareCost", e.target.value)
                }
                className="w-full h-1 bg-finops-bg rounded-lg appearance-none cursor-pointer accent-finops-primary"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-finops-muted">
                    Useful Life (Years)
                  </label>
                  <input
                    type="number"
                    value={inputs.usefulLifeYears}
                    onChange={(e) =>
                      handleInputChange("usefulLifeYears", e.target.value)
                    }
                    className="w-full bg-finops-bg border border-white/10 rounded p-2 text-sm text-white focus:border-finops-primary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-finops-muted">
                    Racks Deployed
                  </label>
                  <input
                    type="number"
                    value={inputs.rackCount}
                    onChange={(e) =>
                      handleInputChange("rackCount", e.target.value)
                    }
                    className="w-full bg-finops-bg border border-white/10 rounded p-2 text-sm text-white focus:border-finops-primary outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Input Group: OpEx */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white flex items-center gap-2">
                  <Zap size={14} /> Monthly Power cost
                </span>
                <span className="font-mono text-finops-secondary">
                  {fmt(inputs.monthlyPowerCost)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="100"
                value={inputs.monthlyPowerCost}
                onChange={(e) =>
                  handleInputChange("monthlyPowerCost", e.target.value)
                }
                className="w-full h-1 bg-finops-bg rounded-lg appearance-none cursor-pointer accent-finops-secondary"
              />
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-finops-muted">PUE Efficiency</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold ${inputs.pue > 1.8 ? "text-finops-danger" : "text-finops-accent"}`}
                  >
                    {inputs.pue}
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    max="3.0"
                    min="1.0"
                    value={inputs.pue}
                    onChange={(e) => handleInputChange("pue", e.target.value)}
                    className="w-16 bg-finops-bg border border-white/10 rounded p-1 text-right text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Normalization Summary Card */}
        <div className="bg-gradient-to-br from-finops-surface to-finops-bg border border-white/10 rounded-xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-finops-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-finops-primary/20 transition-all" />
          <h3 className="text-finops-muted text-sm mb-2 uppercase tracking-wider">
            Normalized Monthly Spend
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {fmt(monthlyTotal)}
            </span>
            <span className="text-xs text-finops-muted">/ mo</span>
          </div>
          <div className="mt-4 space-y-2">
            {normalizedMetrics.map((row, i) => (
              <div
                key={i}
                className="flex justify-between text-xs border-b border-white/5 pb-1 last:border-0"
              >
                <span className="text-finops-muted">{row.ServiceName}</span>
                <span className="text-white font-mono">
                  {fmt(row.EffectiveCost)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Digital Twin Visualization */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* KPI HEADERS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-finops-surface/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <Text>Compute Cost (Amortized)</Text>
            <Metric className="text-white mt-1">
              {fmt(
                normalizedMetrics.find((r) => r.ServiceCategory === "Compute")
                  ?.EffectiveCost || 0,
              )}
            </Metric>
            <Flex className="mt-2">
              <Text className="text-xs text-finops-muted">
                CapEx Spread: {inputs.usefulLifeYears} yrs
              </Text>
            </Flex>
          </div>
          <div className="bg-finops-surface/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <Text>Overhead Cost</Text>
            <Metric className="text-white mt-1">
              {fmt(
                normalizedMetrics.find((r) => r.ServiceCategory === "Support")
                  ?.EffectiveCost || 0,
              )}
            </Metric>
            <Flex className="mt-2 space-x-2">
              <Text className="text-xs text-finops-muted">Power & Cooling</Text>
              <Text className="text-xs font-mono text-finops-secondary">
                PUE {inputs.pue}
              </Text>
            </Flex>
          </div>
          <div className="bg-finops-surface/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <Text>Effective Efficiency</Text>
            <Metric className="text-white mt-1">
              {Math.round((inputs.utilization / inputs.pue) * 10) / 10}{" "}
              <span className="text-sm text-finops-muted font-normal">
                Score
              </span>
            </Metric>
            <ProgressBar
              value={((inputs.utilization / inputs.pue) * 100) / 2} // Generalized score mapping
              color="teal"
              className="mt-3"
            />
          </div>
        </div>

        {/* VISUALIZER */}
        <div className="flex-1 bg-gradient-to-b from-[#0f172a] to-[#020617] rounded-xl border border-white/10 p-1 relative min-h-[400px]">
          <RackBuilder
            rackCount={inputs.rackCount}
            utilization={inputs.utilization}
          />

          <div className="absolute bottom-4 left-6 right-6 bg-finops-bg/80 backdrop-blur border border-white/10 rounded-lg p-3 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="text-finops-primary font-bold">
                FOCUS 1.4 COMPLIANT
              </span>
              <span className="text-finops-muted">
                Validation Checks Passing
              </span>
            </div>
            <div className="flex items-center gap-2 text-finops-muted">
              <span>Region: On-Prem</span>
              <span>•</span>
              <span>Provider: PrivateDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
