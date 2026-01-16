import { motion } from "framer-motion";
import { DollarSign, PieChart, TrendingDown, ArrowRight } from "lucide-react";

export default function SummaryCards({ privateTotal, publicTotal }) {
  const savings = publicTotal - privateTotal;
  const isSaving = savings > 0;
  const percent = publicTotal > 0 ? (Math.abs(savings) / publicTotal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Private Cloud Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-finops-surface border border-white/10 p-6 rounded-xl hover:border-finops-secondary/50 transition-colors group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-finops-secondary/10 rounded-lg text-finops-secondary group-hover:bg-finops-secondary group-hover:text-white transition-colors">
            <ServerIcon />
          </div>
          <span className="text-xs text-finops-muted uppercase tracking-wider">
            Private DC
          </span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(privateTotal)}
        </div>
        <div className="text-xs text-finops-muted">Estimated Monthly TCO</div>
      </motion.div>

      {/* Public Cloud Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-finops-surface border border-white/10 p-6 rounded-xl hover:border-finops-primary/50 transition-colors group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-finops-primary/10 rounded-lg text-finops-primary group-hover:bg-finops-primary group-hover:text-white transition-colors">
            <CloudIcon />
          </div>
          <span className="text-xs text-finops-muted uppercase tracking-wider">
            Public Cloud
          </span>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(publicTotal)}
        </div>
        <div className="text-xs text-finops-muted">Ingested FOCUS Data</div>
      </motion.div>

      {/* Savings / Variance Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`
                    border p-6 rounded-xl flex flex-col justify-between overflow-hidden relative
                    ${
                      isSaving
                        ? "bg-finops-accent/10 border-finops-accent/30"
                        : "bg-finops-danger/10 border-finops-danger/30"
                    }
                `}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`p-3 rounded-lg ${isSaving ? "bg-finops-accent/20 text-finops-accent" : "bg-finops-danger/20 text-finops-danger"}`}
            >
              <DollarSign className="w-6 h-6" />
            </div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${isSaving ? "text-finops-accent" : "text-finops-danger"}`}
            >
              {isSaving ? "Potential Savings" : "Cost Overrun"}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(Math.abs(savings))}
          </div>
          <div className="flex items-center gap-2 text-xs opacity-80">
            <span>{percent.toFixed(1)}% variance</span>
            {isSaving && <TrendingDown className="w-3 h-3" />}
          </div>
        </div>

        {/* Decorative background blob */}
        <div
          className={`
                    absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20
                    ${isSaving ? "bg-finops-accent" : "bg-finops-danger"}
                 `}
        />
      </motion.div>
    </div>
  );
}

function ServerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19" />
      <path d="M4 19c0-5.523 4.477-10 10-10s10 4.477 10 10" />
      <path d="M12 9c0-3.866 3.134-7 7-7s7 3.134 7 7" />
    </svg>
  );
}
