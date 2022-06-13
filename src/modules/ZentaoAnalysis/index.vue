<template>
  <div>
    <div class="user">
      <div class="label">用户名：</div><el-input class="input" v-model="user.userName" />
      <div class="label">密码：</div><el-input class="input" type="password" v-model="user.password" />
    </div>
    <el-tabs tab-position="left" style="margin-top: 10px;padding-top: 10px;border-top: 1px solid rgb(220, 223, 230)">
      <el-tab-pane label="计划分析"><plan-analysis-panel :user="user" /></el-tab-pane>
      <el-tab-pane label="完成的任务"><task-panel :user="user" /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PlanAnalysisPanel from './views/PlanAnalysisPanel.vue'
import TaskPanel from './views/TaskPanel.vue'
export default {
  components: {
    PlanAnalysisPanel,
    TaskPanel
  },
  data() {
    return {
      user: {
        userName: 'chenmingzhi',
        password: 'cmingzhi1990',
      }
    }
  },
}
</script>
<style lang="less" scoped>
.user {
  display: flex;
  align-items: center;
}
.label {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: right;
}
.input {
  width: 200px
}
</style>