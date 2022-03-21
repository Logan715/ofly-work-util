<template>
    <div class="content-main">
        <template v-if="showTab">
            <el-tabs
                :value="activeName"
                type="border-card"
                @tab-click="handleClick"
                @tab-remove="handleRemove"
            >
                <el-tab-pane
                    v-for="tab in tabs"
                    closable
                    :key="tab.id"
                    :label="tab.name"
                    :name="tab.id"
                >
                    <component :is="tab.component"></component>
                </el-tab-pane>
            </el-tabs>
        </template>
        <div v-else class="content-welcome">
            欢迎使用<span class="content-welcome-primary">Ofly</span>平台
        </div>
    </div>
</template>
<script>
export default {
    model: {
        prop: "activeName",
        event: "onActiveNameChange"
    },
    props: {
        tabs: {
            type: Array,
            default: () => {
                return [];
            }
        },
        activeName: {
            type: String,
            default: ""
        }
    },
    computed: {
        showTab() {
            return !!this.tabs.length;
        }
    },
    methods: {
        handleClick(tab, event) {
            this.$emit("onActiveNameChange", tab.name);
        },
        handleRemove(tabName) {
            this.$emit("tab-remove", tabName);
        }
    }
};
</script>
<style scoped>
.content-main {
    margin: 10px;
    width: 100%;
}

.content-welcome {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    font-family: cursive;
    font-style: italic;
}
.content-welcome-primary {
    color: #bd9663;
    font-family: fantasy;
}
</style>
