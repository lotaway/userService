import Vue from 'vue';
import App from "./App.vue";
import {createRouter} from "./router";
import {createStore} from './store';
import {sync} from 'vuex-router-sync';

export function createApp() {
    const router = createRouter();
    const store = createStore();

    // 同步路由状态(route state)到 store
    sync(store, router);

    /* 此策略将客户端数据预取逻辑，放在视图组件的 beforeMount 函数中。当路由导航被触发时，可以立即切换视图，因此应用程序具有更快的响应速度。然而，传入视图在渲染时不会有完整的可用数据。因此，对于使用此策略的每个视图组件，都需要具有条件加载状态。
 这可以通过纯客户端(client-only)的全局 mixin 来实现：*/
    Vue.mixin({
        beforeMount() {
            const {asyncData} = this.$options;

            if (asyncData) {
                // 将获取数据操作分配给 promise
                // 以便在组件中，我们可以在数据准备就绪后
                // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
                this.dataPromise = asyncData({
                    store: this.$store,
                    route: this.$route
                });
            }
        }
    });
    // 当路由组件重用（同一路由，但是 params 或 query 已更改，例如，从 user/1 到 user/2）时，也应该调用 asyncData 函数。我们也可以通过纯客户端(client-only)的全局 mixin 来处理这个问题：
    Vue.mixin({
        beforeRouteUpdate(to, from, next) {
            const {asyncData} = this.$options;

            if (asyncData) {
                asyncData({
                    store: this.$store,
                    route: to
                }).then(next).catch(next)
            } else {
                next()
            }
        }
    });

    const app = new Vue({
        // 注入 router 和 store 到根 Vue 实例
        router,
        store,
        render: h => h(App)
    });

    return {app, router, store};
}