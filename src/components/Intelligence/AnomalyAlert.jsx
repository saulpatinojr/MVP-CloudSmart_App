import { AlertTriangle } from "lucide-react";

export default function AnomalyAlert({ anomaly }) {
  const isHigh = anomaly.impact === "high";

  return (
    <div
      className={`
            bg-finops-surface border-l-2 p-3 rounded-r-lg flex items-center justify-between text-sm
            hover:bg-white/5 transition-colors cursor-pointer group animate-fade-in
            ${isHigh ? "border-finops-danger" : "border-finops-warning"}
        `}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle
          className={`w-4 h-4 ${isHigh ? "text-finops-danger" : "text-finops-warning"}`}
        />
        <div>
          <div className="text-white font-medium">{anomaly.resource}</div>
          <div className="text-xs text-finops-muted">
            Unexpected Usage Spike
          </div>
        </div>
      </div>

      <div
        className={`font-mono font-bold ${isHigh ? "text-finops-danger" : "text-finops-warning"}`}
      >
        {anomaly.delta}
      </div>
    </div>
  );
}
