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
    preview: {
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
        open: false,
    },
    build: {
        rollupOptions: {
            external: ["_svg"],
        },
    },
    server: {
        proxy: {
            "/api": "http://oasip-backend:8080",
        },
    },
});