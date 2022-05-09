import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/kp2/",
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "/src") }],
    },
    plugins: [vue()],
    build: {
        rollupOptions: {
            external: ["_svg"],
        },
    },
    server: {
        proxy: {
            "/api": "http://localhost:8080",
        },
    },
});
