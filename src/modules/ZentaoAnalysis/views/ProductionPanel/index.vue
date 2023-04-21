<template>
  <div>
    <div v-loading="loading" style="display: flex;" class="mb">
      <div style="width: 50%;">
        <el-button class="mb" type="primary" @click="loadData()">刷新列表</el-button>
        <el-button type="primary" class="mb" @click="handleScreenshots">截图</el-button>
        <el-button type="primary" class="mb" @click="handleTest">保存截图</el-button>
        <el-table 
          ref="table"
          :data="list" 
          height="50vh"
          border 
          :row-class-name="tableRowClassName"
          header-row-class-name="ofly-table-head" 
          @selection-change="handleSelectionChange"
          @row-dblclick="showPlans"
        >
          <!-- highlight-current-row -->
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" width="50" align="center" />
          <el-table-column prop="id" sortable label="项目ID" align="center" width="120" />
          <el-table-column prop="name" label="项目名称" show-overflow-tooltip />
          <el-table-column prop="frontEndName" label="前端" align="center" width="80" />
          <el-table-column prop="backEndName" label="后端" align="center" width="80" />
          <el-table-column prop="checkFinishedDate" sortable label="最近计划日期" align="center" width="140" />
        </el-table>
      </div>
      <PlanManagerList :user="user" height="50vh" style="width: 50%;" :production-id="editRow.id" @handle-finished="loadData" />
    </div>
    <div class="content">
      <div ref="content" style="display: inline-grid;">
        <PlanAnalysis v-for="planId in planIds" :key="planId" :user="user" :plan-id="planId" />
      </div>
    </div>
  </div>
</template>
<script>
import { 
  getFocusProductionPlanList,
  fetchLatestData
 } from '../../api'
import PlanManagerList from '../PlanManager/PlanManagerList.vue'
// import PlanAnalysisCard from '../PlanAnalysisCard.vue'
import html2canvas from 'html2canvas'
import moment from 'moment'
import * as clipboard from "clipboard-polyfill";
import { v4 as uuidv4 } from 'uuid'
import WebSockeUtil from '@/utils/WebSockeUtil'
import PlanAnalysis from '../PlanManager/PlanAnalysis.vue'

export default {
  components: {
    PlanManagerList,
    // PlanAnalysisCard,
    PlanAnalysis
  },
  props: {
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      planList: [],
      selectedRows: [],
      editRow: {},
      generals: [],
      token: uuidv4()
    }
  },
  computed: {
    planIds() {
      return this.selectedRows.map(({planId})=>planId);
    }
  },
  mounted () {
    WebSockeUtil.subscribe(`/zentao/plan/${this.token}`, response=> {
      const body = JSON.parse(response.body)
      console.log("/zentao/plan", body)
      if(body.type === "success") {
        this.$notify({
          title: '成功',
          message: body.message,
          duration: 0,
          type: 'success',
          position: 'bottom-right'
        })
        setTimeout(this.loadData, 1000)
      } else {
        this.$notify.error({
          title: '失败',
          message: body.message,
          duration: 0,
          position: 'bottom-right'
        })
      }
    })

    this.loadData()  
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await getFocusProductionPlanList()
        this.list = data;
      } catch(e) {console.log(e)}
      this.loading = false;
    },
    
    async fetchLatestData() {
      const planIds = this.selectedRows.map(({planId})=>planId);
      this.loading = true;
      try {
        const { note } = await fetchLatestData({...this.user,planIds, token: this.token})
        this.$message.success(note)
      } catch(e) {console.log(e)}
      this.loading = false;
    },
    showPlans(row) {
      this.editRow = row
      this.$refs.table.toggleRowSelection(row);
      // const finder = this.selectedRows.find(({planId})=>planId===row.planId)
      // if(finder) {
      //   this.selectedRows = this.selectedRows.filter(({planId})=>planId!==row.planId)
      // } else {
      //   this.selectedRows.push(row)
      // }

    },
    tableRowClassName({row}) {
      if(row.id===this.editRow.id) {
        return "current-row"
      } else if(moment().add(2, `d`).isAfter(moment(row.checkFinishedDate))) {
        return "ofly-urge-warning"
      } else if(moment().add(7, `d`).isAfter(moment(row.checkFinishedDate))) {
        return "ofly-warning"
      }
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    
    async handleScreenshots() {
      const that = this
      const canvas = await html2canvas(this.$refs.content, { useCORS: true })
      
      canvas.toBlob(async (blob, )=> {
        const item = new clipboard.ClipboardItem({ "image/png": blob});
        await clipboard.write([item]);
        that.$message.success('复制完成')
      })
    },
    async handleTest() {
      const canvas = await html2canvas(this.$refs.content, { useCORS: true })
      debugger
      const url = canvas.toDataURL("image/png")
      const oA = document.createElement("a");
      oA.download = '';// 设置下载的文件名，默认是'下载'
      oA.href = url;
      document.body.appendChild(oA);
      oA.click();
      oA.remove(); // 下载之后把创建的元素删除
    }
  }
}
</script>
<style lang="less" scoped>

.general, .title {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.general {
  display: inline-block;
}
.title {
  font-size: 30px;
  flex: 1;
  font-weight: 900;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: lightgoldenrodyellow;
}
.resp {
  vertical-align: sub;
  font-size: 18px;
  color: brown;
}
</style>