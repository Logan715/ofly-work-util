<template>
  <div>
    <div>
      <el-button :disabled="!productionId" class="mb" type="primary" @click="reloadPlan()">刷新计划</el-button>
    </div>
    <el-table 
      :data="planList" 
      border 
      stripe 
      :height="height"
      header-row-class-name="ofly-table-head"
    >
      <el-table-column prop="id" label="计划编号" :width="80" align="center" />
      <el-table-column prop="name" show-overflow-tooltip>
        <template #header>
          <span>计划名称</span>
          <el-popover
            v-if="list.length"
            placement="right"
            width="300"
            trigger="hover"
            @show="handleShow"
          >
            <template>
              <el-input ref="filterInput" v-model="searchStr" clearable />
            </template>
            <i slot="reference" style="padding-left:4px" class="el-icon-location"></i>
          </el-popover>
          
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="devFinishedDate" label="开发完成日期" :width="120" align="center" />
      <el-table-column prop="checkFinishedDate" label="更新验收日期" sortable :width="140" align="center" />
      
      <el-table-column prop="focus" label="是否被关注" :width="100" align="center">
        <template #default="{ row }">
          <i v-if="row.focus" class="el-icon-check" style="font-size: 18px;color: green;font-weight: bold;"></i>
          <span v-else>-</span>
        </template>
        
      </el-table-column>
      <el-table-column prop="handle" label="操作" :width="100" align="center">
        <template #default="{ row }">
          <el-button type="text" :class="{'danger': row.focus}" @click="toggleFocus(row.id)">{{ row.focus?"取关": "关注" }}</el-button>
          <el-button type="text" @click="analysis(row.id)">分析</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { 
  analysisPlan, 
  reloadAllPlanByProductionId, 
  getPlanList ,
  toggleFocusPlan,
} from '../../api'
import { v4 as uuidv4 } from "uuid";
import WebSockeUtil from '@/utils/WebSockeUtil'

export default {
  props: {
    user: Object,
    productionId: Number,
    height: String
  },
  data () {
    return {
      searchStr: undefined,
      list: [],
      token: uuidv4(),
    }
  },
  computed: {
    planList() {
      if(this.searchStr) {
        return this.list.filter(row=> row.name.includes(this.searchStr))
      }
      return this.list;
    }
  },
  watch: {
    productionId(val) {
      this.loadData(val)
    }
  },
  mounted() {
    WebSockeUtil.subscribe(`/zentao/plan/${this.token}`, response=> {
      const body = JSON.parse(response.body)
      console.log("/zentao/plan", body)
      if(body.type === "success") {
        this.$notify({
          title: '成功',
          message: '已获取最新计划列表',
          duration: 0,
          type: 'success',
          position: 'bottom-right'
        })
        setTimeout(this.loadData, 1000)
      } else {
        this.$notify.error({
          title: '失败',
          message: '失败了，稍后查问题',
          duration: 0,
          position: 'bottom-right'
        })
      }
    })
    WebSockeUtil.subscribe(`/zentao/analysis/${this.token}`, response=> {
      const body = JSON.parse(response.body)
      if(body.type === "success") {
        this.$notify({
          title: '成功',
          message: '已经分析完成',
          duration: 0,
          type: 'success',
          position: 'bottom-right'
        })
        setTimeout(this.getAnalysisDateList, 500)
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
    async toggleFocus(id) {
      const loading = this.$loading()
      try {
        await toggleFocusPlan(id);
        this.$message.success('操作成功')
        setTimeout(this.loadData, 50)
        this.$emit('handle-finished')
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
        const { note } = await reloadAllPlanByProductionId({...this.user, productionId, token: this.token});
        this.$message.success(note)
      } catch(e) {
        console.error(e);
      }
      loading.close()
    },
    async analysis(planId) {
     this.loading = true;
     try {
       const { note } = await analysisPlan({...this.user, planId, token: this.token})
      this.$message.success(note);
     } catch(e) {console.log(e)}
     this.loading = false;
    },
    handleShow() {
      setTimeout(this.$refs.filterInput?.focus, 100);
    },
  }
}
</script>