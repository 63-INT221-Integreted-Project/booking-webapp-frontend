import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
const history = createWebHistory();
const routes = [
    {
        path: "/",
        name: "Dashboard",
        component: Dashboard,
    },
];
const router = createRouter({ history, routes });
export default router;
