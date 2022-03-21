import Vue from "vue"
import Vuex from "vuex"
import modulesStore from "../modules/store"

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== "production"

export default new Vuex.Store({
    modules: {
        ...modulesStore
    },
    strict: debug
})
