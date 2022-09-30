import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import router from "./router/routes";
import { createPinia } from "pinia";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

createApp(App).use(router).use(VueSweetalert2).use(createPinia()).mount("#app");
