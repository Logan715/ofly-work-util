<template>
  <div>
    <div class="user">
      <div style="flex: 1;display: flex;">
        <div class="label">用户名：</div><el-input v-model="user.userName" class="input" @change="userNameChange" />
        <div class="label">密码：</div><el-input v-model="user.password" class="input" type="password" @change="passwordChange " />
      </div>
      <div>
        <ProductionManagerButton :user="user" />
        <PlanManagerButton :user="user" />
        
      </div>
    </div>
    <el-tabs tab-position="left" style="margin-top: 10px;padding-top: 10px;border-top: 1px solid rgb(220, 223, 230)">
      <el-tab-pane label="项目进度"><production-Panel :user="user" /></el-tab-pane>
      <el-tab-pane label="计划分析"><plan-analysis-panel :user="user" /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PlanAnalysisPanel from './views/PlanAnalysisPanel.vue'
import ProductionManagerButton from './views/ProductionManager/ProductionManagerButton.vue'
import PlanManagerButton from './views/PlanManager/PlanManagerButton.vue'
import ProductionPanel from './views/ProductionPanel/index.vue'
export default {
  components: {
    ProductionManagerButton,
    PlanManagerButton,
    PlanAnalysisPanel,
    ProductionPanel
  },
  data() {
    const userName= localStorage.getItem(`userName`)
    const password= localStorage.getItem(`password`)
    return {
      visible: false,
      user: {
        userName,
        password,
      }
    }
  },
  methods: {
    userNameChange(val) {
      localStorage.setItem(`userName`, val)
    },
    passwordChange(val) {
      localStorage.setItem(`password`, val)
    },
  }
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