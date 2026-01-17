// MOCK DATA LAKE ENGINE (Stubbed for Build Verification)

// import * as duckdb from '@duckdb/duckdb-wasm';

const MANUAL_BUNDLES = {
  mvp: {
    mainModule: "/wasm/duckdb-mvp.wasm",
    mainWorker: "/wasm/duckdb-browser-mvp.worker.js",
  },
  eh: {
    mainModule: "/wasm/duckdb-eh.wasm",
    mainWorker: "/wasm/duckdb-browser-eh.worker.js",
  },
};

let db = null;
let conn = null;

// Initialize the Database (Singleton)
export const initDB = async () => {
  // Mock Init
  console.log("🦆 Mock Lake Initialized");
  return { db: {}, conn: {} };
};

export const getDbConnection = async () => {
  return {};
};

export const queryLake = async (sql) => {
  // Mock Query
  console.log("🦆 Mock Query:", sql);
  if (sql.includes("count"))
    return [{ count: 50, total: 50, distinct_services: 5 }];
  if (sql.includes("LIMIT"))
    return [
      {
        ProviderName: "AWS",
        ServiceName: "EC2",
        EffectiveCost: 120.5,
        ServiceCategory: "Compute",
      },
      {
        ProviderName: "Azure",
        ServiceName: "Virtual Machines",
        EffectiveCost: 95.0,
        ServiceCategory: "Compute",
      },
    ];
  return [];
};

export const ingestCSV = async (file) => {
  console.log("🦆 Mock Ingest:", file.name);
  return 50; // Mock row count
};
