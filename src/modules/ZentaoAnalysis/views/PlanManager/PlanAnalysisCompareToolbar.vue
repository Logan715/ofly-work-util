<template>
  <div v-if="visible" class="toolbar" :style="`top: ${position.y}px; left: ${position.x}px`">
    <el-button :disabled="!canCopy" class="item" @click="command(`copyLink`)">复制链接</el-button>
    <el-button :disabled="!canCopy" class="item" @click="command(`copyContentAndLink`)">复制内容与链接</el-button>
  </div>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    selectedRows: {
      type: Array,
      default() {
        return []
      }
    },
    position: {
      type: Object,
      default() {return {}}
    }
  },
  computed: {
    canCopy() {
      return this.selectedRows.length > 0
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