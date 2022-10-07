<template>
  <div class="plan-cascader">
    <el-cascader
      v-loading="loading"
      :value="planId"
      :options="data"
      :props="{ expandTrigger: 'hover', leaf: true,emitPath: false }"
      :show-all-levels="false"
      @change="handleChange"
    />
    <div class="icon"><i class="el-icon-refresh"></i></div>
  </div>
</template>
<script>
import { getFocusPlanTree } from '../../api'
export default {
  model: {
    prop: 'planId',
    event: 'change'
  },
  props: {
    planId: Number
  },
  data () {
    return {
      loading: false,
      data: [],
      value: undefined
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const { records } = await getFocusPlanTree();
        let data = [];
        records.forEach(({children, productionName, productionId})=> {
          data.push({
            label: productionName,
            value: productionId,
            children: children.map((plan)=>({
              label: plan.remark? `${plan.name}(${plan.remark})`:plan.name,
              value: plan.id,
              ...plan,
            }))
          })
        })
        this.data = data;
      } catch(e) {console.error(e);}
      this.loading = false;
    },
    handleChange(planId) {
      let plan = undefined;
      for (let i = 0; i < this.data.length; i++) {
        const { children } = this.data[i];
        const finder = children.find(p=>p.id ===planId);
        if(finder) {
          plan = finder;
          break;
        }
      }
      this.$emit('change', planId, plan)
    }
  }
}
</script>
<style lang="less" scoped>
  .plan-cascader {
    display: flex;
    .icon {
      background-color: #f5f7fa;
      color: #909399;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0 10px;
    }
    :deep(.el-input__inner) {
      border-radius: 0px;
      // border-bottom-right-radius: 0;
      // border-top-right-radius: 0;
    }
  }

</style>