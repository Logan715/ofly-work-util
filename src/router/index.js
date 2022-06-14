import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "index",
        redirect: "/home"
    },
    {
        path: "/test",
        name: "index",
        component: () => import("../__test/TestDemo.vue"),
    },
    {
        path: "/test2",
        name: "socket",
        component: () => import("../__test/TestSocket.vue"),
    },
    {
        path: "*",
        name: "home",
        component: () => import("../Layout/index.vue"),
       
    }
];
export default new VueRouter({
    routes
});
