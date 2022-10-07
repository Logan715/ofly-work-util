<template>
  <el-dialog 
    :visible="visible"
    title="计划维护"
    append-to-body
    :before-close="close"
  >
    <div class="production-table">
      <div class="mb">
        <el-select 
          v-model="productionId" 
          placeholder="请选择产品"
          @change="handleLoadData"
        >
          <el-option
            v-for="production in focusProductionList"
            :key="production.id"
            :label="production.name"
            :value="production.id" 
          />
        </el-select>
      </div>
      <el-table 
        :data="list" 
        border 
        stripe 
        header-row-class-name="ofly-table-head"
        height="100%"
      >
        <el-table-column prop="id" label="产品编号" :width="80" align="center" />
        <el-table-column prop="name" label="产品名称" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="devFinishedDate" label="开发完成日期" :width="120" align="center" />
        <el-table-column prop="checkFinishedDate" label="更新验收日期" :width="120" align="center" />
        
        <el-table-column prop="focus" label="是否被关注" :width="100" align="center">
          <template #default="{ row }">
            <i v-if="row.focus" class="el-icon-check" style="font-size: 18px;color: green;font-weight: bold;"></i>
            <span v-else>-</span>
          </template>
          
        </el-table-column>
        <el-table-column prop="handle" label="操作" :width="80" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="toggleFocus(row.id)">{{ row.focus?"取消关注": "关注" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="reloadPlan()">刷新产品</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { 
  getFocusProductionList,
  reloadAllPlanByProductionId, 
  getPlanList ,
  toggleFocusPlan,
} from '../../api'
import WebSockeUtil from '@/utils/WebSockeUtil'

export default {
  props: {
    visible: Boolean,
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data () {
    return {
      productionId: undefined,
      focusProductionList: [],
      list: [],
    }
  },
  watch: {
    visible(val) {
      if(val) {
        this.getFocusProductionList()
      }
    }
  },
  mounted() {
    WebSockeUtil.subscribe("/zentao/plan", response=> {
      const body = JSON.parse(response.body)
      console.log("/zentao/plan", body)
      if(body.type === "success") {
        this.$notify({
          title: '成功',
          message: '已获取最新产品列表',
          duration: 0,
          type: 'success',
          position: 'bottom-right'
        })
        setTimeout(this.loadData, 500)
      } else {
        this.$notify.error({
          title: '失败',
          message: '失败了，稍后查问题',
          duration: 0,
          position: 'bottom-right'
        })
      }
      
    })
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
    handleLoadData(productionId) {
      this.loadData(productionId)
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.production-table {
  height: calc(85vh - 200px);
  overflow-y: auto;
}
</style>