<template>
  <div class="header">
    <div class="header-logo">
      <layout-menu-toggle
        :expanded="expanded"
        @onToggle="onToggle"
      />
      <i class="el-icon-ofly-mouse iconfont logo"></i>
      <span>OFLY MOUSE</span>
    </div>
    <div class="header-logo-extras">
      <!-- <i
                class="el-icon-ofly-exit iconfont exit"
                @click="$emit('onExit')"
            ></i> -->
    </div>
  </div>
</template>

<script>
import LayoutMenuToggle from "./LayoutMenuToggle";
export default {
    components: {
        "layout-menu-toggle": LayoutMenuToggle
    },
    props: {
        expanded: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        onToggle() {
            this.$emit("update:expanded", !this.expanded);
        }
    }
    // methods: {
    //   exit() {
    //     this.$emit('onExit')
    //   }
    // }
};
</script>

<style scoped>
.header {
    display: flex;
    width: 100%;
    align-items: center;
}
.header-logo {
    width: 200px;
    display: flex;
    align-items: center;
}
.logo {
    font-size: 40px;
    margin-right: 8px;
    color: #b4c7ce;
}
.header-logo-extras {
    flex: 1;
    text-align: right;
}
.exit {
    font-size: 20px;
    cursor: pointer;
}
</style>
