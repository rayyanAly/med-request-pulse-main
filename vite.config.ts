import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "development" ? "/" : "/panel_v2/",
  server: {
    host: "::",
    port: 8080,
    // Proxy only in dev mode
    proxy: mode === "development" ? {
      '/api/api_panel/v2': {
        target: 'https://800pharmacy.ae',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/api_panel\/v2/, '/api_panel/v2'),
        headers: {
          'Origin': 'https://800pharmacy.ae',
          'X-Forwarded-Host': '800pharmacy.ae',
        },
      },
    } : undefined,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
