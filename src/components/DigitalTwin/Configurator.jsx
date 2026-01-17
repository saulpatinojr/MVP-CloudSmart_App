import { Zap, DollarSign, Calendar, Sliders, Box } from "lucide-react";
import ClusterManager from "./ClusterManager";

export default function Configurator({ data, onChange }) {
  // Backwards compatibility layer: if data is old style, convert to clusters
  const clusters = data.clusters || [
    {
      id: "default",
      name: "Legacy Racks",
      type: "compute",
      rackCount: data.rackCount || 10,
      hardwareCostPerRack: data.hardwareCost / (data.rackCount || 10) || 100000,
      powerKwPerRack: data.powerKwh / 24 / 30 / (data.rackCount || 10) || 8, // Rough reverse calc
    },
  ];

  const handleClusterChange = (newClusters) => {
    // Aggregate back to "flat" structure for App.jsx compatibility for now
    const totalHardware = newClusters.reduce(
      (acc, c) => acc + c.rackCount * c.hardwareCostPerRack,
      0,
    );
    const totalPowerKwh =
      newClusters.reduce((acc, c) => acc + c.rackCount * c.powerKwPerRack, 0) *
      24 *
      30; // kW * 24h * 30d
    const totalRacks = newClusters.reduce((acc, c) => acc + c.rackCount, 0);

    onChange({
      ...data,
      clusters: newClusters,
      hardwareCost: totalHardware,
      powerKwh: totalPowerKwh,
      rackCount: totalRacks,
    });
  };

  // Calc aggregation for display
  const amortizationMonthly = data.hardwareCost / data.usefulLife;
  const powerCostMonthly = data.powerKwh * 0.12 * data.pue; // Assuming $0.12/kWh

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-light text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-finops-primary" />
          Datacenter Configuration
        </h2>
        <p className="text-sm text-finops-muted mt-1">
          Define your physical infrastructure topology.
        </p>
      </div>

      {/* Cluster Manager (The "Devil's Upgrade") */}
      <ClusterManager clusters={clusters} onChange={handleClusterChange} />

      {/* Global Params */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <h3 className="text-sm font-medium text-white uppercase tracking-wider">
          Global Parameters
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-finops-muted flex items-center gap-2">
              <Zap className="w-4 h-4" /> PUE (Efficiency)
            </span>
            <span className="text-white font-mono">{data.pue}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.05"
            value={data.pue}
            onChange={(e) => onChange({ ...data, pue: Number(e.target.value) })}
            className="w-full accent-finops-accent bg-black/20 h-2 rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-finops-muted flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Depreciation Period
            </span>
            <span className="text-white font-mono">
              {data.usefulLife} months
            </span>
          </div>
          <input
            type="range"
            min="12"
            max="60"
            step="6"
            value={data.usefulLife}
            onChange={(e) =>
              onChange({ ...data, usefulLife: Number(e.target.value) })
            }
            className="w-full accent-finops-primary bg-black/20 h-2 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Real-time Validation / Normalization Output */}
      <div className="bg-black/40 rounded-lg p-4 border-l-2 border-finops-accent">
        <h4 className="text-finops-accent text-xs font-bold uppercase tracking-widest mb-2">
          FOCUS 1.3 Normalization (Preview)
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-finops-muted text-xs">AmortizedCost</div>
            <div className="text-white font-mono">
              ${Math.round(amortizationMonthly).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-finops-muted text-xs">ServiceCategory</div>
            <div className="text-white font-mono">Compute</div>
          </div>
          <div>
            <div className="text-finops-muted text-xs">Allocated Overhead</div>
            <div className="text-white font-mono">
              ${Math.round(powerCostMonthly).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
