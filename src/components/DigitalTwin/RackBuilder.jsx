import { Server, Database, BrainCircuit, HardDrive } from "lucide-react";

// Rack Unit Component
const RackUnit = ({ type, utilization, index }) => {
  // Dynamic color based on type
  const colorClass =
    type === "ai"
      ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
      : type === "storage"
        ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
        : "bg-finops-primary shadow-[0_0_15px_rgba(45,212,191,0.4)]";

  // Animation delay style
  const style = { animationDelay: `${index * 50}ms` };

  return (
    <div
      style={style}
      className={`
                relative h-32 w-full bg-black/60 rounded border border-white/10 
                flex flex-col justify-between p-1 overflow-hidden group hover:border-white/30 transition-all duration-300
                animate-fade-in-up hover:scale-[1.02]
            `}
    >
      {/* Status LEDs */}
      <div className="flex gap-1 justify-end px-1 pt-1">
        <div className={`w-1 h-1 rounded-full ${colorClass} animate-pulse`} />
        <div className="w-1 h-1 rounded-full bg-green-500/50" />
      </div>

      {/* Servers (Visual Stack) */}
      <div className="flex flex-col gap-[2px] h-full justify-center px-1 py-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-2 w-full bg-white/5 rounded-[1px] flex items-center px-[2px]"
          >
            {/* Blinking lights on servers */}
            <div
              className={`w-0.5 h-0.5 rounded-full ${Math.random() > 0.5 ? "bg-white/40" : "bg-transparent"} ${Math.random() > 0.7 ? "animate-ping" : ""}`}
            />
          </div>
        ))}
      </div>

      {/* Base Glow */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${colorClass.split(" ")[0]} opacity-50`}
      />
    </div>
  );
};

export default function RackBuilder({ clusters, count, utilization }) {
  // Backwards compat if clusters not passed
  const activeClusters = clusters || [
    {
      id: "defs",
      name: "Main Cluster",
      type: "compute",
      rackCount: count || 6,
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-6 pb-32 custom-scrollbar space-y-8">
      {activeClusters.map((cluster) => (
        <div key={cluster.id} className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-2">
            {cluster.type === "ai" ? (
              <BrainCircuit className="text-purple-400" />
            ) : cluster.type === "storage" ? (
              <HardDrive className="text-amber-400" />
            ) : (
              <Server className="text-finops-primary" />
            )}
            <h3 className="text-white text-sm font-medium">{cluster.name}</h3>
            <span className="text-xs text-finops-muted bg-white/5 px-2 py-0.5 rounded-full">
              {cluster.rackCount} Racks
            </span>
          </div>

          {/* Rack Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 px-2">
            {[...Array(Math.min(cluster.rackCount, 50))].map((_, i) => (
              <RackUnit
                key={i}
                type={cluster.type}
                utilization={utilization}
                index={i}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
