import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// import Components from "unplugin-vue-components/vite";
// import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/kp2/",

    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "/src") }],
    },
    plugins: [
        vue(),
        // Components({
        //     resolvers: [AntDesignVueResolver()],
        // }),
    ],
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
        open: true,
        proxy: {
            "/api": "http://oasip-backend:8080",
        },
    },
});
