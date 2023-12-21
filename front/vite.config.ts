import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
        base: "./",
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        esbuild: {
            drop: mode === "prod" ? ["console", "debugger"] : [],
        },
    };
});
