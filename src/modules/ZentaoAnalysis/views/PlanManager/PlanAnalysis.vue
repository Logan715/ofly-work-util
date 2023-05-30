<template>
  <div 
    class="general" 
    @mouseenter="hover=true"
    @mouseleave="hover=false"
  >
    <div ref="contentGeneral" class="block">
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
          <span class="toolbar">
            <i v-if="hover && type" class="el-icon-ofly-clear iconfont " @click="type=undefined"></i>
            <i v-if="hover" class="el-icon-ofly-refresh iconfont " @click="refresh"></i>
            <i v-if="hover" class="el-icon-ofly-remove iconfont " @click="remove"></i>
          </span>
        </div>
      </div>
      <div class="general">
        <plan-analysis-card type="story" :data="general.story" title="需求" style="margin-right: 12px;" @click="handleCompareList" />
        <plan-analysis-card type="bug" :data="general.bug" title="Bug" @click="handleCompareList" />
      </div>
      <PlanAnalysisCompareList 
        v-if="type"
        :plan-id="planId"
        :type="type"
        :state="state"
        :dates="dates"
      />

    </div>
  </div>
</template>
<script>
import PlanAnalysisCard from '../PlanAnalysisCard.vue'
import PlanAnalysisCompareList from './PlanAnalysisCompareList.vue'
import { 
  analysisPlan, 
  getAnalysisDateList,
  getAnalysisPlanResult,
 } from '../../api'
import WebSockeUtil from '@/utils/WebSockeUtil'
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    PlanAnalysisCard,
    PlanAnalysisCompareList
  },
  props: {
    user: Object,
    planId: [String, Number],
  },
  data () {
    return {
      token: uuidv4(),
      general: {},
      type: undefined,
      state: undefined,
      dates: [],
      hover: false
    }
  },
  watch: {
    planId: {
      immediate: true,
      handler(val) {
        if(val) {
          this.loadData()
        }
      }
    }
  },
  mounted () {
    WebSockeUtil.subscribe(`/zentao/analysis/${this.token}`, response=> {
      const body = JSON.parse(response.body)
      if(body.type === "success") {
        this.$notify({
          title: '成功',
          message: body.message,
          duration: 0,
          type: 'success',
          position: 'bottom-right'
        })
        setTimeout(this.loadData, 500)
      } else {
        this.$notify.error({
          title: '失败',
          message: body.message,
          duration: 0,
          position: 'bottom-right'
        })
      }
    })
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const { records } = await getAnalysisDateList(this.planId)
        let selectDates = []
        if(records?.length > 1) {
          selectDates = [records[1], records[0]]
        } else if(records?.length === 1){
          selectDates = [records[0], records[0]]
        } else {
          selectDates = []
        }
        this.dates = selectDates
        const { data } = await getAnalysisPlanResult(this.planId, selectDates)
        this.general = data
      }catch(e) {console.error(e);}
      this.loading = false;
    },
    async analysis() {
     this.loading = true;
     try {
       const { note } = await analysisPlan({...this.user, planId: this.planId, token: this.token})
      this.$message.success(note);
     } catch(e) {console.log(e)}
     this.loading = false;
    },
    handleCompareList({ type, state }) {
      this.type = type;
      this.state = state
    },
    refresh() {
      this.analysis()
    },
    remove() {
      this.$emit('remove', this.planId)
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
.toolbar {
  font-size: 24px;
  padding-left: 12px;
  cursor: pointer;
  color: brown;
  i {
    font-size: 24px;

  }
}
.block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>