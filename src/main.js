import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import router from "./router/index.js";
import store from "./store";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/iconfont/iconfont.css";
Vue.config.productionTip = false;
Vue.use(ElementUI);
import "@/assets/theme/normal.less";
import RequestUtil from "./utils/RequestUtil";



const vm = new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");

RequestUtil.httpStatusErrorListener((response) => {
    console.log("response", response);
    vm.$message.error(response.statusText)
    if (response.status === 403) {
        setTimeout(() => router.push("/login"));
    }
});

