<template>
  <el-dialog 
    :visible="visible"
    title="计划维护"
    append-to-body
    :before-close="close"
  >
    <div class="plan-table">
      <div class="mb">
        <el-select 
          v-model="productionId" 
          placeholder="请选择产品"
          filterable
          :filter-method="filterSelect"
          @change="handleLoadData"
        >
          <el-option
            v-for="production in focusProductionOptions"
            :key="production.id"
            :label="production.name"
            :value="production.id" 
          />
        </el-select>
      </div>
      <PlanManagerList :user="user" :production-id="productionId" @handle-finished="loadData" />
    </div>
  </el-dialog>
</template>
<script>
import { 
  getFocusProductionList,
  reloadAllPlanByProductionId, 
  getPlanList ,
  toggleFocusPlan,
} from '../../api'
import PlanManagerList from '../PlanManager/PlanManagerList.vue'
import pinyin from 'js-pinyin'

export default {
  components: {
    PlanManagerList
  },
  props: {
    visible: Boolean,
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data () {
    return {
      searchStr: undefined,
      productionId: undefined,
      focusProductionList: [],
      list: [],
    }
  },
  computed: {
    focusProductionOptions() {
      if(this.searchStr) {
        return this.focusProductionList.filter(row=> {
          const fullName = pinyin.getFullChars(row.name).toLowerCase();
					const camelChars = pinyin.getCamelChars(row.name).toLowerCase();

          return row.name.includes(this.searchStr) || 
          fullName.includes(this.searchStr.toLowerCase()) ||
					camelChars.includes(this.searchStr.toLowerCase())
        })
      }
      return this.focusProductionList
    }
  },
  watch: {
    visible(val) {
      if(val) {
        this.getFocusProductionList()
      }
    }
  },
  methods: {
    async getFocusProductionList() {
      const loading = this.$loading()
      try {
        const {records} = await getFocusProductionList();
        this.focusProductionList = records
      } catch(e) {
        console.error(e);
      }
      loading.close()
    },
    async toggleFocus(id) {
      const loading = this.$loading()
      try {
        await toggleFocusPlan(id);
        this.$message.success('操作成功')
        setTimeout(this.loadData, 50)
      } catch(e) {
        console.error(e);
      }
      loading.close()
    },
    async loadData(productionId=this.productionId) {
      const loading = this.$loading()
      try {
        this.searchStr = undefined;
        const { records } = await getPlanList(productionId);
        this.list = records
      } catch(e) {
        console.error(e);
      }
      loading.close()
      
    },
    async reloadPlan(productionId=this.productionId) {
      const loading = this.$loading()
      try {
        const { note } = await reloadAllPlanByProductionId({...this.user, productionId});
        this.$message.success(note)
      } catch(e) {
        console.error(e);
      }
      loading.close()
    },
    filterSelect(searchStr) {
      this.searchStr = searchStr
    },
    handleLoadData(productionId) {
      this.loadData(productionId)
    },
    handleShow() {
      setTimeout(this.$refs.filterInput?.focus, 100);
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.plan-table {
  height: calc(85vh - 234px);
  overflow-y: auto;
}
</style>