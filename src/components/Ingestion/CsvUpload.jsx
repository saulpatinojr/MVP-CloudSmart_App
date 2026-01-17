import { useState, useCallback } from "react";
import { Upload, FileType, CheckCircle, AlertCircle, X } from "lucide-react";
// import { normalizeToFocus13 } from '../../engine/FocusSchema'

// Mock Data Lake interaction for now
const ingestCsvToLake = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        rowCount: 12500,
        schema: "FOCUS 1.3",
        sample: [{ ServiceCategory: "Compute", Cost: 100 }],
      });
    }, 1500);
  });
};

export default function CsvUpload({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (file) => {
    setUploadStatus("uploading");
    setFileName(file.name);

    try {
      if (!file.name.endsWith(".csv"))
        throw new Error("Only CSV files are supported");

      // 1. Ingest to Data Lake (Simulated)
      const result = await ingestCsvToLake(file);

      // 2. Normalize Data (Simulated for this specific CSV)
      // In real app, we'd query the Lake for summary stats here
      const publicCloudTotal = result.rowCount * 168; // Mock logic

      setUploadStatus("success");
      if (onUploadComplete) onUploadComplete(publicCloudTotal);
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
      setErrorMsg(err.message);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      {uploadStatus === "idle" && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${
                  isDragging
                    ? "border-finops-accent bg-finops-accent/10 scale-[1.02]"
                    : "border-white/10 hover:border-white/30 hover:bg-white/5"
                }
            `}
        >
          <input
            type="file"
            id="csvInput"
            className="hidden"
            accept=".csv"
            onChange={handleChange}
          />
          <label
            htmlFor="csvInput"
            className="cursor-pointer flex flex-col items-center gap-3"
          >
            <div
              className={`p-4 rounded-full bg-white/5 ${isDragging ? "animate-bounce" : ""}`}
            >
              <Upload className="w-6 h-6 text-finops-primary" />
            </div>
            <div>
              <p className="text-white font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-finops-muted mt-1">
                Supports AWS CUR, Azure Cost Export, FOCUS 1.3
              </p>
            </div>
          </label>
        </div>
      )}

      {uploadStatus === "uploading" && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center animate-pulse">
          <div className="w-12 h-12 border-4 border-finops-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-medium">Ingesting to Data Lake...</p>
          <p className="text-xs text-finops-muted mt-1">{fileName}</p>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 flex items-center gap-4 animate-fade-in">
          <div className="p-2 bg-green-500/20 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-medium">Ingestion Complete</p>
            <p className="text-xs text-finops-muted">
              Data normalized to FOCUS 1.3
            </p>
          </div>
          <button
            onClick={() => setUploadStatus("idle")}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 flex items-center gap-4 animate-shake">
          <div className="p-2 bg-red-500/20 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-medium">Ingestion Failed</p>
            <p className="text-xs text-red-200/70">{errorMsg}</p>
          </div>
          <button
            onClick={() => setUploadStatus("idle")}
            className="p-1 hover:bg-white/10 rounded"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>
      )}
    </div>
  );
}
