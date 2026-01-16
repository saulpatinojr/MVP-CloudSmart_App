import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import { validateFocusRow } from "../../engine/FocusSchema";

export default function CsvUpload({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, parsing, success, error
  const [stats, setStats] = useState({ rows: 0, distinctServices: 0 });
  const [validationErrors, setValidationErrors] = useState([]);

  const processFile = useCallback(
    (file) => {
      setStatus("parsing");
      setValidationErrors([]);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          // 1. Validate Schema
          const errors = [];
          const validRows = [];
          const services = new Set();

          // Sample check first 100 rows for speed, or all?
          // Let's check first 50 for immediate feedback to avoid freezing UI on huge files
          const rowsToCheck = results.data.slice(0, 50);

          rowsToCheck.forEach((row, i) => {
            const rowErrors = validateFocusRow(row);
            if (rowErrors.length > 0) {
              errors.push(`Row ${i + 1}: ${rowErrors.join(", ")}`);
            }
          });

          if (errors.length > 0) {
            setStatus("error");
            setValidationErrors(errors);
            return;
          }

          // 2. Process Data if Valid
          results.data.forEach((row) => {
            if (row.ServiceName) services.add(row.ServiceName);
            validRows.push(row);
          });

          setStats({
            rows: results.data.length,
            distinctServices: services.size,
          });

          setStatus("success");
          if (onUploadComplete) onUploadComplete(validRows);
        },
        error: (err) => {
          setStatus("error");
          setValidationErrors([err.message]);
        },
      });
    },
    [onUploadComplete],
  );

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (
            (file && file.type === "text/csv") ||
            file.name.endsWith(".csv")
          ) {
            processFile(file);
          } else {
            setStatus("error");
            setValidationErrors(["Only .csv files are supported"]);
          }
        }}
        className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
            ${isDragging ? "border-finops-primary bg-finops-primary/5 scale-[1.02]" : "border-white/10 hover:border-finops-primary/50 hover:bg-finops-surface/50"}
            ${status === "success" ? "border-finops-accent/50 bg-finops-accent/5" : ""}
            ${status === "error" ? "border-finops-danger/50 bg-finops-danger/5" : ""}
        `}
      >
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-finops-surface rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-finops-muted group-hover:text-finops-primary transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Upload FOCUS Dataset
                </h3>
                <p className="text-sm text-finops-muted mt-1">
                  Drag & drop your FOCUS 1.3 CSV here
                </p>
              </div>
              <div className="text-xs text-finops-muted/50 pt-4">
                Supported: Standard Cost & Usage Reports
              </div>
            </motion.div>
          )}

          {status === "parsing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-10 h-10 text-finops-primary animate-spin" />
              <span className="text-finops-muted">
                Parsing and Validating Schema...
              </span>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-finops-accent/20 rounded-full flex items-center justify-center mx-auto text-finops-accent">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Validation Successful
                </h3>
                <p className="text-sm text-finops-muted">
                  Ready for Intelligence Analysis
                </p>
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-white">
                    {stats.rows.toLocaleString()}
                  </span>
                  <span className="text-finops-muted text-xs">Total Rows</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">
                    {stats.distinctServices}
                  </span>
                  <span className="text-finops-muted text-xs">Services</span>
                </div>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-finops-danger/20 rounded-full flex items-center justify-center mx-auto text-finops-danger">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">
                  Validation Failed
                </h3>
                <p className="text-sm text-finops-muted">
                  The file does not meet FOCUS 1.3 standards
                </p>
              </div>
              <div className="text-left bg-black/20 p-4 rounded-lg text-xs text-finops-danger font-mono max-h-32 overflow-y-auto">
                {validationErrors.map((err, i) => (
                  <div key={i}>• {err}</div>
                ))}
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="text-xs text-finops-muted hover:text-white underline"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files?.[0]) processFile(e.target.files[0]);
          }}
          disabled={status !== "idle" && status !== "error"}
        />
      </div>
    </div>
  );
}
