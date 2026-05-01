import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { imagetools } from "vite-imagetools";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [
      react(),
      imagetools(),
      viteCompression({ algorithm: "gzip", ext: ".gz", deleteOriginFile: false }),
      viteCompression({ algorithm: "brotliCompress", ext: ".br", deleteOriginFile: false }),
    ],
    build: {
      target: "es2015",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
                return "vendor-react";
              }
              if (id.includes("@tanstack/react-query")) return "vendor-query";
              if (id.includes("lucide-react")) return "vendor-ui";
              if (id.includes("recharts") || id.includes("chart.js")) return "vendor-charts";
              if (id.includes("axios") || id.includes("date-fns") || id.includes("lodash-es")) return "vendor-utils";
            }
            if (id.includes("/src/pages/admin/")) return "admin";
            if (id.includes("/src/pages/teacher/")) return "faculty";
            if (id.includes("/src/pages/student/")) return "student";
            return undefined;
          },
        },
      },
    },
  };
});
