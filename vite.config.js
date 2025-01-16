import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";

// https://vite.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://192.168.1.1:8080",
                changeOrigin: true,
                secure: false
            }
        }
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [fixReactVirtualized],
        }
    },
    plugins: [react()],
});
