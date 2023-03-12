<template>
  <div v-if="visible" class="toolbar" :style="`top: ${position.y}px; left: ${position.x}px`">
    <el-button class="item" @click="command(`copyLink`)">复制链接</el-button>
    <el-button class="item" @click="command(`copyContentAndLink`)">复制内容与链接</el-button>
  </div>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    position: {
      type: Object,
      default() {return {}}
    }
  },
  methods: {
    command(command) {
      this.$emit('command', command)
    }
  }
}
</script>
<style lang="less" scoped>
.toolbar {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.item {
  border: none;
  margin-left: 0px;
  width: 100%;
  &:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
}
</style>