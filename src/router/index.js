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
        path: "*",
        name: "home",
        component: () => import("../Layout/index.vue"),
        children: [
            {
                path: "/base64",
                name: "base64",
                component: () => import("@/modules/Base64/index.vue")
            }
        ]
    }
];
export default new VueRouter({
    routes
});
