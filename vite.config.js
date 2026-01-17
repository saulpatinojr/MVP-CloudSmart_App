import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm",
          dest: "wasm",
        },
        {
          src: "node_modules/@duckdb/duckdb-wasm/dist/duckdb-eh.wasm",
          dest: "wasm",
        },
        {
          src: "node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js",
          dest: "wasm",
        },
        {
          src: "node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js",
          dest: "wasm",
        },
      ],
    }),
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
