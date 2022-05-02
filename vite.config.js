import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    alias: [{ find: "@", replacement: path.resolve(__dirname, "/src") }],
    plugins: [vue()],
    build: {
        rollupOptions: {
            external: ["/images/_svg/No%20data.svg"],
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
});
