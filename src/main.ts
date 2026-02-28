import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import "animate.css";
import { useHeartbeatDirective } from "@/directives/Heartbeat.ts";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.config.globalProperties.number = 123;
// 自定义指令
app.directive("heartbeat", useHeartbeatDirective());
app.mount("#app");
