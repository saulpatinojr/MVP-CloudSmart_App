import { AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AnomalyAlert({ anomalies }) {
  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="bg-finops-surface/30 p-4 rounded-xl border border-white/5 flex items-center gap-3">
        <CheckCircle2 className="text-finops-accent w-5 h-5" />
        <div>
          <h4 className="text-sm font-medium text-white">
            No Anomalies Detected
          </h4>
          <p className="text-xs text-finops-muted">
            System spending is within expected baselines.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly, i) => (
        <motion.div
          key={i}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`
                    p-4 rounded-xl border backdrop-blur-sm flex gap-3
                    ${
                      anomaly.severity === "high"
                        ? "bg-finops-danger/10 border-finops-danger/30"
                        : "bg-orange-500/10 border-orange-500/30"
                    }
                `}
        >
          {anomaly.severity === "high" ? (
            <AlertOctagon className="text-finops-danger w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="text-orange-400 w-5 h-5 shrink-0" />
          )}

          <div>
            <h4
              className={`text-sm font-medium ${anomaly.severity === "high" ? "text-finops-danger" : "text-orange-400"}`}
            >
              {anomaly.title}
            </h4>
            <p className="text-xs text-finops-muted mt-1 leading-relaxed">
              {anomaly.message}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
