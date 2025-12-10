import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                // eslint-disable-next-line
                target: "http://192.168.1.1:8080",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    plugins: [react(), visualizer({ template: "sunburst" })],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
