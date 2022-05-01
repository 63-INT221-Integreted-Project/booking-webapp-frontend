import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
            external: ["_svg"],
        },
    },
    server: {
        port: 3000,
        proxy: {
            "/api": "http://oasip-backend:8080",
        },
    },
});
