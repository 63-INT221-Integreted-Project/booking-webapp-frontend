import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import router from "./router/routes";
import { createPinia } from "pinia";
import "./utils/axios.interceptor";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { CustomNavigationClient } from "./router/NavigationClient";
import { msalPlugin } from "./plugins/msalPlugin";
import { msalInstance } from "./authConfig"



createApp(App).use(router).use(VueSweetalert2).use(createPinia()).use(msalPlugin, msalInstance).mount("#app");

const navigationClient = new CustomNavigationClient(router);
msalInstance.setNavigationClient(navigationClient);
