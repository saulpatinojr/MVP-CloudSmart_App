import { motion } from "framer-motion";
import { Server, Battery, Wifi } from "lucide-react";

export default function RackBuilder({ rackCount, utilization }) {
  // Generate visual racks
  const racks = Array.from({ length: Math.min(rackCount, 12) }, (_, i) => ({
    id: i,
    status: i < rackCount * (utilization / 100) ? "active" : "idle",
  }));

  return (
    <div className="w-full h-full p-6 bg-finops-surface/50 rounded-xl border border-white/5 backdrop-blur-md overflow-hidden relative">
      <div className="absolute top-4 right-4 flex gap-2 text-xs text-finops-muted">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-finops-primary animate-pulse"></div>{" "}
          Active
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-finops-surface border border-white/20"></div>{" "}
          Idle
        </div>
      </div>

      <h3 className="text-finops-primary font-semibold mb-6 flex items-center gap-2">
        <Server className="w-4 h-4" /> Live Rack Topology
      </h3>

      <div className="grid grid-cols-4 gap-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {racks.map((rack, i) => (
          <motion.div
            key={rack.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`
              relative group cursor-pointer
              ${
                rack.status === "active"
                  ? "bg-finops-surface border-finops-primary/30 shadow-[0_0_15px_-5px_var(--color-finops-primary)]"
                  : "bg-finops-bg border-white/5 opacity-50"
              }
              border rounded-lg p-3 flex flex-col justify-between h-32 hover:border-finops-primary transition-all duration-300
            `}
          >
            {/* Rack Header */}
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-finops-muted">
                RACK-{String(i + 1).padStart(2, "0")}
              </span>
              {rack.status === "active" && (
                <Wifi className="w-3 h-3 text-finops-accent" />
              )}
            </div>

            {/* Simulated Unit LEDs */}
            <div className="space-y-1 my-2">
              {[1, 2, 3, 4].map((u) => (
                <div
                  key={u}
                  className="h-1 w-full bg-finops-bg rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-finops-primary"
                    initial={{ width: "0%" }}
                    animate={{
                      width:
                        rack.status === "active"
                          ? `${Math.random() * 60 + 40}%`
                          : "0%",
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: Math.random(),
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Footer Metrics */}
            <div className="flex justify-between items-end">
              <div className="text-[10px] text-finops-muted">
                {rack.status === "active" ? "2.4 kW" : "0.1 kW"}
              </div>
              <Battery
                className={`w-3 h-3 ${rack.status === "active" ? "text-finops-secondary" : "text-finops-muted"}`}
              />
            </div>

            {/* Hover Tooltip Effect */}
            <div className="absolute inset-0 bg-finops-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
          </motion.div>
        ))}

        {rackCount > 12 && (
          <div className="col-span-4 text-center py-4 text-xs text-finops-muted border-t border-white/5">
            + {rackCount - 12} additional racks active in cluster
          </div>
        )}
      </div>
    </div>
  );
}
