<template>
    <div class="toggle" @click="toggle">
        <i :class="iconClass"></i>
    </div>
</template>
<script>
export default {
    props: {
        expanded: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        iconClass: function() {
            return this.expanded ? "el-icon-s-fold" : "el-icon-s-unfold";
        }
    },
    methods: {
        toggle() {
            this.$emit("onToggle", !this.expanded);
        }
    }
};
</script>
<style scoped>
.toggle {
    text-align: right;
    font-size: 24px;
    padding-right: 20px;
    cursor: pointer;
}
</style>
