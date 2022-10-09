<template>
  <div v-loading="loading">
    <div class="condition">
      <div class="label">计划编号：</div> 
      <!-- <el-input v-model="planId" class="input" placeholder="计划编号" @blur="handlePlanChange" /> -->
      <PlanCascader v-model="planId" @change="handlePlanChange" />
      <el-button type="primary" class="analysis-btn" :disabled="!planId" @click="handleAnalysis">分析</el-button>
    </div>
    <div style="margin-bottom: 12px;margin-top:12px;">
      已分析计划时间：<el-tag v-for="date in analysisDateList" :key="date" :type="selectDates.includes(date) ?'priamry':'info'" class="tag" @click.native="handleSelectDate(date)">{{ date }}</el-tag>
    </div>
    <el-button type="primary" style="margin-bottom: 12px;" :disabled="!canGetExport" @click="getAnalysisPlanResult">获取分析报告</el-button>
    <el-button type="primary" style="margin-bottom: 12px;" :disabled="!canCopyLink" @click="handleCopyLink">复制链接</el-button>
    <div>
      <div class="title mb">
        {{ plan.label }}
      </div>
      <div class="general">
        <plan-analysis-card type="story" :data="result.story" title="需求" style="margin-right: 12px;" @click="handleCompareList" />
        <plan-analysis-card type="bug" :data="result.bug" title="Bug" @click="handleCompareList" />
      </div>
    </div>
    <plan-analysis-compare-list style="margin-top: 12px;" :type="type" :data="compareList" :selected-rows.sync="selectedRows" />
    <!-- <el-input type="textarea" :value="resultInfo" :autosize="{maxRows: 10, minRows: 10}"></el-input> -->
  </div>
</template>
<script>
import { 
  analysisPlan, 
  getAnalysisDateList,
  getAnalysisPlanResult,
  getCompareList
} from '../api'
import PlanAnalysisCard from './PlanAnalysisCard.vue'
import PlanAnalysisCompareList from './PlanAnalysisCompareList.vue'
import WebSockeUtil from '@/utils/WebSockeUtil'
import PlanCascader from '../views/PlanManager/PlanCascader.vue'
import copy from 'clipboard-copy'

export default {
  components: {
    PlanAnalysisCard,
    PlanAnalysisCompareList,
    PlanCascader
  },
  props: {
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data() {
    return {
      loading: false,
      plan: {},
      planId: undefined,
      result: {},
      analysisDateList: [],
      selectDate: undefined,
      selectDates: [],
      compareList: [],
      type: undefined,
      selectedRows: [],
    }
  },
  computed: {
    condition() {
      return {
        planId: this.planId
      }
    },
    canGetExport() {
      return this.selectDates?.length > 0
    },
    canCopyLink() {
      return this.selectedRows?.length > 0
    },
    resultInfo() {
      let _resultInfo = "";
      const { story, bug } = this.result || {};
      if(story || bug) {
        if(story) {
          _resultInfo += this.toStoryInfo(story)
        }
        if(bug) {
          _resultInfo += this.toBugInfo(bug)
        }
      }
      return _resultInfo;
    }
  },
  watch: {
    analysisDateList(val) {
      if(val?.length) {
        this.selectDates = [val[0]]
        this.getAnalysisPlanResult();
      }
    }
  },
  mounted() {
    WebSockeUtil.subscribe("/zentao/analysis", response=> {
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
  /*
   {
        "planId": "342",
        "analysisDate": "2022-06-11",
        "urgentCount": 23,
        "urgentFinishedCount": 20,
        "count": 36,
        "finishedCount": 31
    },
  */
  methods: {
    async getAnalysisDateList() {
      this.loading = true;
      try {
        const { records } = await getAnalysisDateList(this.planId);
        this.analysisDateList = records;
      } catch(e) {console.error(e);}
      this.loading = false;
    },
    async analysis() {
     this.loading = true;
     try {
       const { note } = await analysisPlan({...this.user, planId: this.planId})
      this.$message.success(note);
      // setTimeout(this.getAnalysisDateList, 500)
     } catch(e) {console.log(e)}
     this.loading = false;
    },
    async getAnalysisPlanResult() {
      this.loading = true;
      try {
        const { data } = await getAnalysisPlanResult(this.planId, this.selectDates)
        this.result = data
      } catch(e) {console.error(e);}
      this.loading = false;
    },
    handleAnalysis() {
      this.analysis()
    },
    handlePlanChange(planId, plan) {
      this.plan = plan
      if(planId) {
        this.getAnalysisDateList()
      } else {
        this.analysisDateList = []
        this.plan = {}
      }
    },
    handleSelectDate(date) {
      if(this.selectDates.length < 2) {
        this.selectDates.push(date)
      } else {
        this.selectDates.shift();
        this.selectDates.push(date);
      }
    },
    toStoryInfo(story) {
      let _storyInfo = "";
      const currentStory = story[0];
      _storyInfo = `${currentStory.analysisDate}: 1-2级需求：(${currentStory.urgentFinishedCount}/${currentStory.urgentCount})，整体需求：（${currentStory.finishedCount}/${currentStory.count}）` 
      if(story.length === 2) {
        const compareStory = story[1];
        _storyInfo+= `\n${compareStory.analysisDate}: 1-2级需求：(${compareStory.urgentFinishedCount}/${compareStory.urgentCount})，整体需求：（${compareStory.finishedCount}/${compareStory.count}）` 
        _storyInfo+= `\n新增1-2级需求：${currentStory.urgentCount - compareStory.urgentCount} 个，整体需求新增: ${currentStory.count - compareStory.count} 个` 
      }
      return _storyInfo + "\n\r";
    },
    toBugInfo(bug) {
      let _bugInfo = "";
      const currentBug = bug[0];
      _bugInfo = `${currentBug.analysisDate}: 1-2级bug：(${currentBug.urgentFinishedCount}/${currentBug.urgentCount})，整体bug：（${currentBug.finishedCount}/${currentBug.count}）` 
      if(bug.length === 2) {
        const compareBug = bug[1];
        _bugInfo+= `\n${compareBug.analysisDate}: 1-2级bug：(${compareBug.urgentFinishedCount}/${compareBug.urgentCount})，整体bug：（${compareBug.finishedCount}/${compareBug.count}）` 
        _bugInfo+= `\n新增1-2级bug：${currentBug.urgentCount - compareBug.urgentCount} 个，整体bug新增: ${currentBug.count - compareBug.count} 个` 
      }
      return _bugInfo + "\n";
    } ,
    async handleCompareList(params) {
      this.loading = true;
      try {
        const { data } = await getCompareList({
          planId: this.planId,
          dates: this.selectDates,
          ...params
        })
        this.type = params.type
        this.compareList = data
      } catch(e) {console.error(e);}
      this.loading = false;
    },
    async handleCopyLink() {
      const copyContent = this.selectedRows.map(row=> {
        if(this.type ==="bug") {
          return `http://120.39.223.102:12005/wwwroot/www/index.php?m=bug&f=view&bugID=${row.bugId}`
        } else {
          return `http://120.39.223.102:12005/wwwroot/www/index.php?m=story&f=view&storyID=${row.storyId}`
        }
      }).join('\n');

      await copy(copyContent);
      this.$message.success('复制完成')
    }
    
  }
}
</script>
<style lang="less" scoped>
.condition {
  display: flex;
  align-items: center;
  .label {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
  .input {
    width: 200px
  }
}
.general, .title {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 30px;
  flex: 1;
  font-weight: 900;
}
.tag {
  cursor: pointer;
  margin-right: 12px
}
.analysis-btn {
  margin-left: 12px
}
.mb {
  margin-bottom: 20px;
}
</style>