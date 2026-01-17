import { useState } from "react";
import {
  Plus,
  Trash2,
  Cpu,
  Database,
  Save,
  Server,
  BrainCircuit,
} from "lucide-react";

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function ClusterManager({ clusters, onChange }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCluster, setNewCluster] = useState({
    name: "New Cluster",
    type: "compute", // compute, storage, ai
    rackCount: 1,
    hardwareCostPerRack: 100000,
    powerKwPerRack: 8,
  });

  const handleAdd = () => {
    onChange([...clusters, { ...newCluster, id: generateId() }]);
    setIsAdding(false);
    setNewCluster({
      name: "New Cluster",
      type: "compute",
      rackCount: 1,
      hardwareCostPerRack: 100000,
      powerKwPerRack: 8,
    });
  };

  const handleRemove = (id) => {
    onChange(clusters.filter((c) => c.id !== id));
  };

  const updateCluster = (id, field, value) => {
    onChange(clusters.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const totalCost = clusters.reduce(
    (acc, c) => acc + c.rackCount * c.hardwareCostPerRack,
    0,
  );
  const totalPower = clusters.reduce(
    (acc, c) => acc + c.rackCount * c.powerKwPerRack,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
        <div>
          <div className="text-xs text-finops-muted uppercase tracking-wider">
            Total CapEx
          </div>
          <div className="text-xl font-bold text-white">
            ${totalCost.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-xs text-finops-muted uppercase tracking-wider">
            Total Power Load
          </div>
          <div className="text-xl font-bold text-finops-accent">
            {totalPower.toLocaleString()} kW
          </div>
        </div>
      </div>

      {/* Cluster List */}
      <div className="space-y-3">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="bg-finops-surface border border-white/10 rounded-lg p-4 group hover:border-finops-primary/50 transition-all duration-300 animate-fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${cluster.type === "ai" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}
                >
                  {cluster.type === "ai" ? (
                    <BrainIcon />
                  ) : (
                    <Cpu className="w-4 h-4" />
                  )}
                </div>
                <input
                  type="text"
                  value={cluster.name}
                  onChange={(e) =>
                    updateCluster(cluster.id, "name", e.target.value)
                  }
                  className="bg-transparent border-b border-white/10 focus:border-finops-primary outline-none text-white font-medium text-sm w-32"
                />
              </div>
              <button
                onClick={() => handleRemove(cluster.id)}
                className="text-finops-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-finops-muted/50 mb-1">Racks</label>
                <input
                  type="number"
                  value={cluster.rackCount}
                  onChange={(e) =>
                    updateCluster(
                      cluster.id,
                      "rackCount",
                      Number(e.target.value),
                    )
                  }
                  className="bg-black/20 w-full p-2 rounded text-white border border-white/5 focus:border-finops-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-finops-muted/50 mb-1">
                  Cost/Rack ($)
                </label>
                <input
                  type="number"
                  value={cluster.hardwareCostPerRack}
                  onChange={(e) =>
                    updateCluster(
                      cluster.id,
                      "hardwareCostPerRack",
                      Number(e.target.value),
                    )
                  }
                  className="bg-black/20 w-full p-2 rounded text-white border border-white/5 focus:border-finops-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-finops-muted/50 mb-1">
                  Power/Rack (kW)
                </label>
                <input
                  type="number"
                  value={cluster.powerKwPerRack}
                  onChange={(e) =>
                    updateCluster(
                      cluster.id,
                      "powerKwPerRack",
                      Number(e.target.value),
                    )
                  }
                  className="bg-black/20 w-full p-2 rounded text-white border border-white/5 focus:border-finops-primary outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="w-full py-3 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-finops-muted hover:text-white hover:border-finops-primary hover:bg-finops-primary/5 transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        Add Enterprise Cluster
      </button>
    </div>
  );
}

function BrainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}
