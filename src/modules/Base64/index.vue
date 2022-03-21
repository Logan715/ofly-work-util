<template>
  <el-row :gutter="24">
    <el-col :span="24" class="mb">
      <el-input
        type="textarea"
        :rows="5"
        v-model="source"
      >
      </el-input>
    </el-col>
    <el-col :span="24" class="mb">
      <el-button-group>
        <el-button type="primary" @click="encode" :disabled="!canCover">加密</el-button>
        <el-button type="primary" @click="decode" :disabled="!canCover">解密</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24">
      <el-input
        type="textarea"
        class="target"
        :rows="5"
        v-model="target"
        readonly
        @click.native="copy"
      >
      </el-input>
    </el-col>
  </el-row>
</template>
<script>
import Base64 from 'base64-js'
import copy from 'clipboard-copy'
export default {
  data() {
    return {
      source: "",
      target: "",
      messageInstance: undefined
    }
  },
  computed: {
    canCover() {
      return this.source?.length > 1
    }
  },
  methods: {
    encode() {
      const uint8 = this.source.split('').map(char=> char.charCodeAt(0));
      this.target = Base64.fromByteArray(uint8)
    },
    decode() {
      const uint8 = Base64.toByteArray(this.source);
      this.target = uint8.map(charCode=> String.fromCharCode(charCode)).join('');
    },
    async copy() {
      if(this.target) {
        await copy(this.target);
        if(this.messageInstance) {
          this.messageInstance.close();
        }
        this.messageInstance = this.$message.success('复制完成')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.target {
  /deep/ .el-textarea__inner {
    cursor: pointer;
  }
}
</style>