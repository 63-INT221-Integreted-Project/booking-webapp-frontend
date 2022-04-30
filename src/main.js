import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import router from "./router/routes";
import { createPinia } from "pinia";

createApp(App).use(router).use(createPinia()).mount("#app");
