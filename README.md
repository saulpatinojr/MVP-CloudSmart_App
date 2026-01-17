# CloudSmart Enterprise ☁️

> **The "Devil's Architect" Financial Operations Platform**  
> _Optimize, Visualize, and Normalize your Hybrid Cloud Infrastructure._

CloudSmart Enterprise is a next-generation FinOps platform designed to bridge the gap between on-premise datacenter reality and public cloud potential. It leverages the **FOCUS 1.3** open standard to normalize cost data, providing apples-to-apples comparisons that empower executives to make data-driven migration decisions.

---

## 🚀 Key Capabilities

### 1. Command Center (Dashboard)

The central nervous system of your FinOps strategy.

- **Cost Comparison Model**: Real-time bar charts comparing your normalized Private Cloud TCO against Public Cloud equivalents.
- **Executive KPI Cards**: Instant visibility into "Efficiency Scores", "Projected Savings", and total monthly amortization.
- **CSV Ingestion**: Drag-and-drop support for generic CSV exports, automatically parsed and mapped to the FOCUS schema.

### 2. Infrastructure Model 🏗️

_Formerly "Digital Twin" - A living, breathing model of your physical hardware._

- **Cluster Management**: Define distinct hardware groups (e.g., "AI Training Pods", "Cold Storage", "General Compute") with unique power and cost profiles.
- **Visual Rack Builder**: A reactive, animated diagram showing your active rack utilization, status LEDs, and heat generation.
- **Live Configuration**: Tweak PUE (Power Usage Effectiveness), depreciation periods (12-60 months), and hardware costs to see an instant impact on your bottom line.

### 3. Intelligence Hub 🧠

AI-driven insights for the boardroom.

- **Anomaly Detection**: Simulated real-time alerts for cost spikes (e.g., "High Egress Traffic", "Provisioning Errors").
- **FinOps Health Score**: A dynamic, gamified metric (0-100) indicating the efficiency of your current architecture.
- **Executive Briefing Generator**: One-click generation of a branded, print-ready HTML/PDF report summarizing TCO, efficiency, and strategic recommendations.

---

## 🛠️ Technology Stack

- **M** - **Mock Data Engine** (Transitioning to DuckDB-Wasm)
- **V** - **Vite** (Build Tool)
- **P** - **React** (Frontend Framework)
- **Styles**: **TailwindCSS** with a custom "Midnight Slate" & "Neon" theme.
- **Icons**: `lucide-react`
- **Charts**: `recharts`

---

## 📦 Installation & Setup

### Prerequisites

- Node.js v18+
- npm v9+

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production (Preview)
npm run build
npm run preview
```

### Deployment (Firebase)

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize (if not already done)
firebase init hosting

# 3. Deploy
npm run build
firebase deploy --only hosting
```

---

## 🎨 Theme System

The application features a bespoke **"Midnight Slate"** theme designed for long-session usability in enterprise environments.

- **Primary**: `Cyan-400` (#22d3ee)
- **Secondary**: `Indigo-400` (#818cf8)
- **Background**: `Slate-900` (#0f172a) - _Softened from pure black for reduced eye strain._

---

## 🔮 Roadmap (CloudSmart v2.1)

- [ ] **DuckDB-Wasm Full Integration**: Replace mock data engine with real in-browser SQL processing.
- [ ] **Persistent Scenarios**: Save/Load multiple architectural "What-If" scenarios via Firestore.
- [ ] **Auth Strategy**: Role-based access control (RBAC) for "Viewer" vs "Architect" personas.

---

_Verified & Polished by Antigravity Agents._
