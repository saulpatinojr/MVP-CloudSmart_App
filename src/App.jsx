import { useState, useMemo, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Server,
  BrainCircuit,
  Settings,
  Menu,
  Database,
} from "lucide-react";
import { initDB } from "./engine/DataLake";
import { normalizePrivateDcToFocus } from "./engine/FocusSchema";

// Modular Views
import Dashboard from "./components/Dashboard/Dashboard";
import DigitalTwin from "./components/DigitalTwin/DigitalTwin";
import Intelligence from "./components/Intelligence/Intelligence";

// Navigation Tab Component
const NavTab = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`
      flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative
      ${active ? "text-white" : "text-finops-muted hover:text-white"}
    `}
  >
    <Icon className={`w-4 h-4 ${active ? "text-finops-accent" : ""}`} />
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-finops-accent shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
    )}
  </button>
);

function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, digitaltwin, intelligence
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  // Initialize Data Lake
  useEffect(() => {
    initDB()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error("Failed to init Data Lake", err);
        setDbError(err.message);
      });
  }, []);

  // State
  const [privateDcData, setPrivateDcData] = useState({
    hardwareCost: 1900000, // Derived from default clusters
    usefulLife: 36, // Months
    powerKwh: 129600, // Derived
    pue: 1.5,
    rackCount: 12, // Derived
    clusters: [
      {
        id: "c1",
        name: "General Compute",
        type: "compute",
        rackCount: 10,
        hardwareCostPerRack: 120000,
        powerKwPerRack: 10,
      },
      {
        id: "c2",
        name: "AI Training Pod",
        type: "ai",
        rackCount: 2,
        hardwareCostPerRack: 350000,
        powerKwPerRack: 40,
      },
    ],
  });
  const [publicCloudData, setPublicCloudData] = useState([]); // Normalized FOCUS data (from DB sample)

  // Global Derived Metric
  // Global Derived Metric
  const { privateTotal, privateDcRows } = useMemo(() => {
    // 1. Map App State to Normalizer Inputs
    const inputs = {
      totalHardwareCost: privateDcData.hardwareCost,
      usefulLifeYears: privateDcData.usefulLife / 12,
      monthlyPowerCost: privateDcData.powerKwh * 0.12, // Assumed $0.12/kWh
    };

    // 2. Generate Rows
    const rows = normalizePrivateDcToFocus(inputs);

    // 3. Calculate Total Effective Cost
    const total = rows.reduce((acc, r) => acc + r.EffectiveCost, 0);

    return { privateTotal: total, privateDcRows: rows };
  }, [privateDcData]);

  if (!dbReady && !dbError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-finops-bg text-white">
        <div>
          <Database className="w-12 h-12 text-finops-primary animate-spin" />
        </div>
        <h2 className="mt-4 font-light text-finops-muted">
          Initializing CloudSmart Data Lake...
        </h2>
        <p className="text-xs text-finops-muted/50 mt-2">
          Loading WASM Engines
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-finops-bg text-finops-text font-sans selection:bg-finops-accent/30 selection:text-finops-accent">
      {/* 1. Global Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-finops-surface/80 backdrop-blur-lg border-b border-white/5 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-finops-primary to-finops-accent flex items-center justify-center shadow-lg shadow-finops-primary/20">
            <span className="font-bold text-white text-lg">C</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              CloudSmart{" "}
              <span className="font-light text-finops-muted">Enterprise</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <NavTab
            id="dashboard"
            label="Command Center"
            icon={LayoutDashboard}
            active={activeTab === "dashboard"}
            onClick={setActiveTab}
          />
          <NavTab
            id="digitaltwin"
            label="Infrastructure Model"
            icon={Server}
            active={activeTab === "digitaltwin"}
            onClick={setActiveTab}
          />
          <NavTab
            id="intelligence"
            label="Intelligence"
            icon={BrainCircuit}
            active={activeTab === "intelligence"}
            onClick={setActiveTab}
          />
        </div>

        <div className="flex items-center gap-4">
          {dbError && (
            <span className="text-xs text-red-400 border border-red-500/20 px-2 py-1 rounded">
              DB Error: {dbError}
            </span>
          )}
          <div className="w-px h-6 bg-white/10" />
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-finops-muted" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-finops-muted" />
          </button>
        </div>
      </nav>

      {/* 2. Main Content Area */}
      <main className="pt-28 pb-12 px-6 max-w-[1600px] mx-auto min-h-screen">
        <div>
          {activeTab === "dashboard" && (
            <Dashboard
              key="dashboard"
              publicCloudData={publicCloudData}
              privateDcRows={privateDcRows}
              privateDcTotal={privateTotal}
              onUploadComplete={setPublicCloudData}
            />
          )}

          {activeTab === "digitaltwin" && (
            <DigitalTwin
              key="digitaltwin"
              privateDcData={privateDcData}
              setPrivateDcData={setPrivateDcData}
            />
          )}

          {activeTab === "intelligence" && (
            <Intelligence
              key="intelligence"
              publicCloudData={publicCloudData}
              privateDcData={privateDcData}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
