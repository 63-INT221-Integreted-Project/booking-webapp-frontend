import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import EventCategories from "../views/EventCategories.vue";
const history = createWebHistory();
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/event-categories",
        name: "EventCategories",
        component: EventCategories,
    },
];
const router = createRouter({ history, routes });
export default router;
