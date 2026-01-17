import CostComparisonChart from "./CostComparisonChart";
import SummaryCards from "./SummaryCards";
import CsvUpload from "../Ingestion/CsvUpload";

export default function Dashboard({
  publicCloudData,
  privateDcTotal,
  privateDcRows,
  onUploadComplete,
}) {
  const hasData = publicCloudData.length > 0;

  // Dynamic Aggregation (No more hardcoded 2.1M)
  const publicTotal = publicCloudData.reduce(
    (acc, r) => acc + (r.EffectiveCost || 0),
    0,
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Top Level Metrics */}
      <section>
        <SummaryCards privateTotal={privateDcTotal} publicTotal={publicTotal} />
      </section>

      {/* 2. Main Visualization Grid */}
      <section className="grid grid-cols-12 gap-6">
        {/* Left: Input/Upload */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-white font-medium text-lg mb-6 tracking-tight flex items-center gap-2">
              <span className="w-1 h-6 bg-finops-primary rounded-full" />
              Data Source
            </h3>
            <CsvUpload onUploadComplete={onUploadComplete} />
          </div>
        </div>

        {/* Right: Charts */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 h-[500px] backdrop-blur-sm relative">
            {!hasData && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <p className="text-finops-muted mb-2">Awaiting Data</p>
                  <div className="text-xs text-finops-muted/50">
                    Upload a FOCUS CSV to compare
                  </div>
                </div>
              </div>
            )}
            <h3 className="text-white font-light text-lg mb-6">
              Cost Comparison Model
            </h3>
            <CostComparisonChart
              privateData={privateDcRows}
              publicData={publicCloudData}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
