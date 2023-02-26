<template>
  <div>
    <div style="display: flex;" class="mb">
      <div style="width: 50%;">
        <el-button class="mb" :disabled="!selectedRows.length" type="primary" @click="handleScheduleGeneral">进度信息</el-button>
        <el-button class="mb" :disabled="!selectedRows.length" type="primary" @click="fetchLatestData">拉取最新数据</el-button>
        <el-button type="primary" class="mb" @click="handleScreenshots">截图</el-button>

        <el-table 
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
          <el-table-column prop="name" label="项目名称" />
          <el-table-column prop="checkFinishedDate" sortable label="最近计划日期" align="center" width="140" />
        </el-table>
      </div>
      <PlanManagerList :user="user" height="50vh" style="width: 50%;" :production-id="editRow.id" @handle-finished="loadData" />
    </div>
    <div class="content">
      <div ref="content" style="display: inline-grid;">
        <div v-for="(general, index) in generals" :key="`${index}`" class="general">
          <div ref="contentGeneral">
            <div class="title mb">
              <div>
                <span>{{ general.productionName }}</span>
                <span v-if="general.frontEndName ||general.backEndName " class="resp">
                  [{{ [general.frontEndName,general.backEndName].filter(val=>val).join('-') }}]
                </span>
              </div>
              <div>
                <span v-if="planId" style="color: #1cc91c;margin-right: 4px;">[{{ planId }}]</span>  
                <span>{{ general.planName }}</span>
              </div>
            </div>
            <div class="general">
              <plan-analysis-card type="story" :data="general.story" title="需求" style="margin-right: 12px;" />
              <plan-analysis-card type="bug" :data="general.bug" title="Bug" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { 
  getFocusProductionPlanList,
  getAnalysisDateList,
  getAnalysisPlanResult,
  fetchLatestData
 } from '../../api'
import PlanManagerList from '../PlanManager/PlanManagerList.vue'
import PlanAnalysisCard from '../PlanAnalysisCard.vue'
import html2canvas from 'html2canvas'
import moment from 'moment'
import * as clipboard from "clipboard-polyfill";
import { v4 as uuidv4 } from 'uuid'
import WebSockeUtil from '@/utils/WebSockeUtil'

export default {
  components: {
    PlanManagerList,
    PlanAnalysisCard
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
    async fetchScheduleGeneral() {
      const planIds = this.selectedRows.map(({planId})=>planId);
      this.loading = true;
      try {
        const generals = await Promise.all(planIds.map(planId=>this.fetchScehduleGeneralByPlanId(planId)))
        this.generals = generals
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
    async fetchScehduleGeneralByPlanId(planId) {
      const { records } = await getAnalysisDateList(planId)
      let selectDates = []
      if(records?.length > 1) {
        selectDates = [records[1], records[0]]
      } else {
        selectDates = [records[0], records[0]]
      } 
      const {code, data, note } = await getAnalysisPlanResult(planId, selectDates)
      if(code ==1) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(note)
      }
    },
    showPlans(row) {
      this.editRow = row
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
    handleScheduleGeneral() {
      this.fetchScheduleGeneral()
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