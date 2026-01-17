import { TrendingDown, TrendingUp, DollarSign, Activity } from "lucide-react";

// Simple Card Component
const KpiCard = ({ label, value, trend, trendUp, icon: Icon, delay }) => (
  <div
    className="bg-finops-surface border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-finops-primary/30 transition-all duration-500 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-24 h-24" />
    </div>

    <div className="relative z-10">
      <div className="text-finops-muted text-[10px] uppercase tracking-[0.2em] font-bold mb-3">
        {label}
      </div>
      <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
        {value}
      </div>

      <div
        className={`flex items-center gap-2 mt-4 text-sm font-medium ${trendUp ? "text-finops-danger" : "text-finops-secondary"}`}
      >
        {trendUp ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>{trend}</span>
        <span className="text-finops-muted/50 font-normal ml-1">
          vs last month
        </span>
      </div>
    </div>
  </div>
);

export default function SummaryCards({ privateTotal, publicTotal }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        label="Private DC Cost"
        value={`$${(privateTotal / 1000).toFixed(1)}k`}
        trend="2.4%"
        trendUp={true}
        icon={Activity}
        delay={0}
      />
      <KpiCard
        label="Public Cloud Equivalent"
        value={`$${(publicTotal / 1000).toFixed(1)}k`}
        trend="12.5%"
        trendUp={false}
        icon={DollarSign}
        delay={100}
      />
      <KpiCard
        label="projected Savings"
        value="$35.2k"
        trend="8.1%"
        trendUp={false} // Good thing (savings up? logic tricky, usually green is good)
        icon={TrendingDown}
        delay={200}
      />
      <KpiCard
        label="Efficiency Score"
        value="85/100"
        trend="5pts"
        trendUp={false} // Green (improve)
        icon={Activity}
        delay={300}
      />
    </div>
  );
}
