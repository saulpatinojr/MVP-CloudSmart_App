import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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

export default function CostComparisonChart({ privateData, publicData }) {
  // Aggregation Logic (Simple grouping by Service Category)
  // We assume data is already normalized to have 'ServiceCategory' and 'EffectiveCost'

  // 1. Get unique categories
  const categories = Array.from(
    new Set([
      ...privateData.map((d) => d.ServiceCategory),
      ...publicData.map((d) => d.ServiceCategory),
    ]),
  );

  // 2. Build Chart Data
  const data = categories
    .map((cat) => {
      const privateCost = privateData
        .filter((d) => d.ServiceCategory === cat)
        .reduce((a, b) => a + b.EffectiveCost, 0);
      const publicCost = publicData
        .filter((d) => d.ServiceCategory === cat)
        .reduce((a, b) => a + b.EffectiveCost, 0);
      return {
        category: cat,
        Private: privateCost,
        Public: publicCost,
      };
    })
    .sort((a, b) => b.Private + b.Public - (a.Private + a.Public)); // Sort by total spend

  return (
    <div className="w-full h-full p-6 bg-finops-surface/30 rounded-xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
      <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
        Infrastructure Cost Comparison
      </h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff10"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={(val) => `$${val / 1000}k`}
            />
            <YAxis
              dataKey="category"
              type="category"
              stroke="#94a3b8"
              fontSize={11}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Bar
              dataKey="Private"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              barSize={20}
              name="Private DC"
            />
            <Bar
              dataKey="Public"
              fill="#06b6d4"
              radius={[0, 4, 4, 0]}
              barSize={20}
              name="Public Cloud"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
