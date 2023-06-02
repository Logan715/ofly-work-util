<template>
  <el-row :gutter="24">
    <el-col :span="24" class="mb">
      <el-radio-group v-model="type" size="medium">
        <el-radio-button label="url">URL编码解码</el-radio-button>
        <el-radio-button label="base64">Base64</el-radio-button>
      </el-radio-group>
    </el-col>
    <el-col :span="24" class="mb">
      <el-input
        v-model="source"
        type="textarea"
        :rows="5"
      />
    </el-col>
    <el-col :span="24" class="mb">
      <el-button-group>
        <el-button type="primary" :disabled="!canCover" @click="encode">+++++</el-button>
        <el-button type="primary" :disabled="!canCover" @click="decode">-----</el-button>
      </el-button-group>
    </el-col>
    <el-col :span="24">
      <el-input
        v-model="target"
        type="textarea"
        class="target"
        :rows="5"
        readonly
        @click.native="copy"
      />
    </el-col>
  </el-row>
</template>
<script>
import Convert from './convert'
import copy from 'clipboard-copy'
export default {
  data() {
    return {
      source: "",
      target: "",
      messageInstance: undefined,
      type: `url`
    }
  },
  computed: {
    canCover() {
      return this.source?.length > 1
    }
  },
  methods: {
    encode() {
      this.target = Convert.encode(this.type, this.source)
    },
    decode() {
      this.target = Convert.decode(this.type, this.source)
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