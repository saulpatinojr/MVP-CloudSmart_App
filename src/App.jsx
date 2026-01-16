import { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Server,
  BarChart3,
  Settings,
  Database,
  Github,
} from "lucide-react";
import Configurator from "./components/DigitalTwin/Configurator";
import CsvUpload from "./components/Ingestion/CsvUpload";
import ForecastChart from "./components/Intelligence/ForecastChart";
import AnomalyAlert from "./components/Intelligence/AnomalyAlert";
import CostComparisonChart from "./components/Dashboard/CostComparisonChart";
import SummaryCards from "./components/Dashboard/SummaryCards";
import { InsightGenerator } from "./engine/InsightGenerator";
import { Forecaster } from "./engine/Forecaster";

// Helper to sum costs
const sumCost = (data) =>
  data.reduce((acc, curr) => acc + (curr.EffectiveCost || 0), 0);

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data State
  const [privateDcData, setPrivateDcData] = useState([]);
  const [publicCloudData, setPublicCloudData] = useState([]);

  // Derived Metrics (Memoized for performance)
  const privateTotal = useMemo(() => sumCost(privateDcData), [privateDcData]);
  const publicTotal = useMemo(
    () => sumCost(publicCloudData),
    [publicCloudData],
  );

  // AI Insights
  const anomalies = useMemo(
    () => InsightGenerator.detectAnomalies(publicCloudData),
    [publicCloudData],
  );
  const executiveSummary = useMemo(
    () =>
      InsightGenerator.generateExecutiveSummary(privateDcData, publicCloudData),
    [privateDcData, publicCloudData],
  );

  // Forecast (Last 6 months simulated from Public Data -> Next 6 months predicted)
  const forecast = useMemo(() => {
    if (publicCloudData.length === 0) return { history: [], projection: [] };

    // Simulate monthly aggregation from raw rows (assuming raw rows might be line items)
    // For demo, we'll group by month if available, or simulate purely based on row index for now if date missing
    // Real impl would group by BillingPeriodStart

    // Mocking history for visualization if just one month uploaded
    const history = [
      { month: "Jan", cost: publicTotal * 0.9 },
      { month: "Feb", cost: publicTotal * 0.95 },
      { month: "Mar", cost: publicTotal * 0.92 },
      { month: "Apr", cost: publicTotal * 1.05 }, // Spike
      { month: "May", cost: publicTotal * 0.98 },
      { month: "Jun", cost: publicTotal }, // Current
    ];

    const prediction = Forecaster.predict(history, 6);

    return {
      history,
      projection: prediction.projections.map((p) => ({
        month: `Month +${p.monthIndex - 5}`, // relative
        predictedCost: p.predictedCost,
      })),
    };
  }, [publicTotal, publicCloudData]);

  return (
    <div className="min-h-screen bg-finops-bg text-finops-text font-sans selection:bg-finops-primary/30">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-finops-surface/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-finops-primary to-finops-secondary rounded-lg flex items-center justify-center shadow-lg shadow-finops-primary/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            CloudSmart{" "}
            <span className="font-light text-finops-primary">Intelligence</span>
          </span>
        </div>

        <div className="ml-auto flex items-center gap-6 text-sm font-medium text-finops-muted">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 transition-colors hover:text-white ${activeTab === "dashboard" ? "text-finops-primary" : ""}`}
          >
            <LayoutDashboard size={18} />
            Command Center
          </button>
          <button
            onClick={() => setActiveTab("digitaltwin")}
            className={`flex items-center gap-2 transition-colors hover:text-white ${activeTab === "digitaltwin" ? "text-finops-primary" : ""}`}
          >
            <Server size={18} />
            Digital Twin
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 transition-colors hover:text-white ${activeTab === "analytics" ? "text-finops-primary" : ""}`}
          >
            <BarChart3 size={18} />
            Forecasting
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 px-6 pb-12 max-w-[1600px] mx-auto">
        <div className="min-h-[600px]">
          {/* TAB: DASHBOARD (Command Center) */}
          {activeTab === "dashboard" && (
            <div className="animate-slide-up space-y-8">
              <SummaryCards
                privateTotal={privateTotal}
                publicTotal={publicTotal}
              />

              <div className="grid grid-cols-12 gap-6">
                {/* Main Chart */}
                <div className="col-span-12 lg:col-span-8">
                  <CostComparisonChart
                    privateData={privateDcData}
                    publicData={publicCloudData}
                  />
                </div>

                {/* Upload & Ingestion */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-finops-surface/30 border border-white/5 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">
                      Data Sources
                    </h3>
                    <CsvUpload onUploadComplete={setPublicCloudData} />

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-finops-muted">
                          Private DC Stream
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${privateDcData.length > 0 ? "bg-finops-accent/20 text-finops-accent" : "bg-white/5 text-finops-muted"}`}
                        >
                          {privateDcData.length > 0 ? "Active" : "Offline"}
                        </span>
                      </div>
                      <div className="text-xs text-finops-muted">
                        {privateDcData.length > 0
                          ? `Streaming ${privateDcData.length} utilization metrics via Digital Twin.`
                          : "Configure in Digital Twin tab to enable comparison."}
                      </div>
                    </div>
                  </div>

                  {/* Quick Insights (Mini) */}
                  <div className="bg-finops-surface/30 border border-white/5 rounded-xl p-6 flex-1">
                    <h3 className="text-white font-semibold mb-3">
                      Executive Summary
                    </h3>
                    <div className="space-y-2">
                      {executiveSummary.map((line, i) => (
                        <div
                          key={i}
                          className="flex gap-2 text-sm text-finops-muted"
                        >
                          <div className="w-1 h-1 rounded-full bg-finops-primary mt-2" />
                          <p>{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DIGITAL TWIN */}
          {activeTab === "digitaltwin" && (
            <div key="dt" className="animate-slide-up">
              <Configurator onDataUpdate={setPrivateDcData} />
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="animate-slide-up grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-8">
                <ForecastChart
                  historicalData={forecast.history}
                  projectionData={forecast.projection}
                />
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-finops-surface/30 border border-white/5 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-finops-danger opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-finops-danger"></span>
                    </span>
                    Anomaly Detection
                  </h3>
                  <AnomalyAlert anomalies={anomalies} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
