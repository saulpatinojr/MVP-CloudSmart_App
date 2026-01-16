import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-finops-surface border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-white font-medium mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-finops-muted capitalize">{p.name}:</span>
            <span className="text-white font-mono">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastChart({ historicalData, projectionData }) {
  // Merge data for visual continuity
  const data = [
    ...historicalData.map((d) => ({ ...d, type: "actual" })),
    ...projectionData.map((d) => ({ ...d, type: "projected" })),
  ];

  const latest = historicalData[historicalData.length - 1]?.cost || 0;
  const projected =
    projectionData[projectionData.length - 1]?.predictedCost || 0;
  const trend = projected > latest ? "up" : "down";

  return (
    <div className="w-full h-full p-6 bg-finops-surface/30 rounded-xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-semibold flex items-center gap-2">
            AI Cost Projection
            <span className="text-[10px] bg-finops-primary/20 text-finops-primary px-2 py-0.5 rounded-full border border-finops-primary/20">
              BETA
            </span>
          </h3>
          <p className="text-xs text-finops-muted">
            6-Month Linear Regression Forecast
          </p>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-bold ${trend === "up" ? "text-finops-danger" : "text-finops-accent"}`}
        >
          {trend === "up" ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          {Math.abs(((projected - latest) / latest) * 100).toFixed(1)}%
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff10"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={(val) => `$${val / 1000}k`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActual)"
              name="Actual Spend"
            />
            <Area
              type="monotone"
              dataKey="predictedCost"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorProjected)"
              name="Forecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
