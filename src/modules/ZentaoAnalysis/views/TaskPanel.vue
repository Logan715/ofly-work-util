<template>
  <div>
    <el-button type="primary" @click="handleTask" style="margin-bottom: 20px">获取完成的任务</el-button>
    <el-input type="textarea" :value="finishTaskTitles" :autosize="{maxRows: 10, minRows: 10}"></el-input>
  </div>
</template>
<script>
import { getFinishedTaskList } from '../api'
export default {
  props: {
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data() {
    return {
      loading: false,
      result: undefined
    }
  },
  computed: {
    finishTaskTitles() {
      return this.result?.map(({taskTitle})=>taskTitle).join("\r\n")
    }
  },
  methods: {
    async getFinishedTaskList() {
     this.loaidng = true;
     try {
       const { records } = await getFinishedTaskList({...this.user})
       this.result = records;
     } catch(e) {console.log(e)}
     this.loaidng = false;
    },
    handleTask() {
      this.getFinishedTaskList()
    }
  }
}
</script>