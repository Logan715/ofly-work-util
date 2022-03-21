import Vue from "vue";
import { Loading } from 'element-ui'
let loading = null;
let loading2 = null;
Vue.directive("nb-loading", {
    /**
     * 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
     */
    bind: function(el, binding, vnode, oldVnode) {
        console.log("bind", arguments);
        loading = Loading.service({
          target: el,
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });
        loading2 = Loading.service({
          target: el,
          lock: true,
          text: '加载中...',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });

        setTimeout(()=>{
          loading.close();
          setTimeout(()=>{
            loading2.close();
          },1000)
        },2000)
    },
    /**
     * 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
     */
    inserted: function(el, binding, vnode, oldVnode) {
        console.log("inserted", arguments);
    },
    /**
     * 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，
     * 也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
     */
    update: function(el, binding, vnode, oldVnode) {
        console.log("update", arguments);
    },
    /**
     * 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
     */
    componentUpdated: function(el, binding, vnode, oldVnode) {},
    /**
     * 只调用一次，指令与元素解绑时调用。
     */
    unbind: function(el, binding, vnode, oldVnode) {
      const a = loading;
    }
});
