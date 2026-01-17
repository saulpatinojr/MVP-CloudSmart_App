import { useState, useEffect } from "react";
import { FileText, Zap, TrendingDown, AlertTriangle } from "lucide-react";
import { generateReport } from "../../engine/ReportGenerator";

export default function Intelligence({ publicCloudData, privateDcData }) {
  const [auditScore, setAuditScore] = useState(85);

  // Mock "Live" Analysis
  useEffect(() => {
    // In real app, this would queryLake() for anomalies
    const timer = setInterval(() => {
      setAuditScore((prev) =>
        Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)),
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white">Intelligence Hub</h2>
          <p className="text-finops-muted">
            AI-driven insights and executive reporting.
          </p>
        </div>
        <button
          onClick={() => generateReport(privateDcData)}
          className="flex items-center gap-2 px-4 py-2 bg-finops-primary text-finops-bg font-bold rounded-lg hover:bg-finops-primary/90 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Export Executive Brief
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* KPI: Optimization Score */}
        <div className="col-span-12 md:col-span-4 bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-finops-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <h3 className="text-white font-medium text-lg mb-6 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-finops-primary rounded-full" />
            FinOps Health Score
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">
              {Math.round(auditScore)}
            </span>
            <span className="text-sm text-green-400">/ 100</span>
          </div>
          <p className="text-xs text-finops-muted mt-2">
            Your infrastructure is performing in the top 15% of peers.
          </p>
        </div>

        {/* Anomaly Detection */}
        <div className="col-span-12 md:col-span-8 bg-black/40 border border-white/5 rounded-2xl p-6">
          <h3 className="text-white font-medium text-lg mb-6 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-amber-500 rounded-full" />
            Active Anomalies (24h)
          </h3>

          <div className="space-y-3">
            {[
              {
                service: "EC2-P3dn.24xlarge",
                cost: "$4,200",
                reason: "Unexpected spike in AI Training cluster",
              },
              {
                service: "NAT Gateway",
                cost: "$850",
                reason: "High egress traffic detected outside business hours",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white/5 p-3 rounded-lg border-l-2 border-amber-500 animate-fade-in-up"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div>
                  <div className="text-white font-medium text-sm">
                    {item.service}
                  </div>
                  <div className="text-xs text-finops-muted">{item.reason}</div>
                </div>
                <div className="text-white font-mono text-sm">{item.cost}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
