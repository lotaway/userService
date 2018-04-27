import Vue from 'vue';
import App from "./App.vue";
import {createRouter} from "./router";

export function createApp() {
    const router = createRouter();
    const app = new Vue({
        // 注入 router 到根 Vue 实例
        router,
        render: h => h(App)
    });

    return {app, router};
}