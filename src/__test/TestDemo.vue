<template>
  <div>
    <el-button type="primary" @click="getData">请求</el-button>
    <br />
    {{ data }}
    </div>
</template>
<script>
import RequestUtil from '@/utils/RequestUtil'
export default {
  data() {
    return {
      data: {}
    }
  },
  methods: {
    async getData() {
      const data = await RequestUtil.get("/oflywork/test/helloworld")
      this.data = data
    }
  }
}
</script>