import * as duckdb from "@duckdb/duckdb-wasm";

const BUNDLE_URLS = {
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
  if (db) return { db, conn };

  try {
    // Select bundle based on browser support
    const bundle = await duckdb.selectBundle(BUNDLE_URLS);

    const worker = new Worker(bundle.mainWorker);
    const logger = new duckdb.ConsoleLogger();
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule);
    conn = await db.connect();

    console.log("🦆 Real DuckDB-Wasm Initialized");
    return { db, conn };
  } catch (err) {
    console.error("DuckDB Init Failed:", err);
    throw err;
  }
};

export const getDbConnection = async () => {
  if (!conn) {
    await initDB();
  }
  return conn;
};

export const queryLake = async (sql) => {
  if (!conn) throw new Error("DB not connected");

  console.log("🦆 SQL:", sql);
  const result = await conn.query(sql);

  // Convert Arrow result to simple JSON array
  const rows = result.toArray().map((row) => row.toJSON());
  return rows;
};

export const ingestCSV = async (file) => {
  if (!db) throw new Error("DB not initialized");

  const tableName = "raw_public_cloud";

  try {
    // Register the file
    await db.registerFileHandle(
      file.name,
      file,
      duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
      true,
    );

    // Ingest
    await conn.query(
      `CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM read_csv_auto('${file.name}')`,
    );

    // Verify
    const countResult = await conn.query(
      `SELECT count(*) as count FROM ${tableName}`,
    );
    // duckdb-wasm counts often come back as BigInt, safely convert
    const count = Number(countResult.toArray()[0].count);

    console.log(`🦆 Ingested ${count} rows from ${file.name}`);
    return count;
  } catch (err) {
    console.error("CSV Ingest Failed:", err);
    throw err;
  }
};

export const normalizePublicData = async () => {
  if (!conn) throw new Error("DB not connected");

  try {
    // 1. Inspect Schema to find available columns
    const schemaResult = await conn.query(
      "PRAGMA table_info('raw_public_cloud')",
    );
    const columns = schemaResult.toArray().map((r) => r.toJSON().name);
    console.log("🦆 Detected Schema:", columns);

    // 2. Map Columns Dynamically (Resiliency)
    const colCost = columns.includes("EffectiveCost")
      ? "EffectiveCost"
      : columns.includes("Cost")
        ? "Cost"
        : "0";

    const colProvider = columns.includes("ProviderName")
      ? "ProviderName"
      : "'External Provider'";

    const colService = columns.includes("ServiceName")
      ? "ServiceName"
      : "'Unspecified Service'";

    const colCategory = columns.includes("ServiceCategory")
      ? "ServiceCategory"
      : "'Other'";

    // 3. Run Normalization Query
    const sql = `
        SELECT 
            ${colProvider} as ProviderName,
            ${colCategory} as ServiceCategory,
            ${colService} as ServiceName,
            CAST(${colCost} AS DOUBLE) as EffectiveCost
        FROM raw_public_cloud
        WHERE ${colCost} > 0
    `;

    return await queryLake(sql);
  } catch (err) {
    console.error("Normalization Failed:", err);
    return [];
  }
};
