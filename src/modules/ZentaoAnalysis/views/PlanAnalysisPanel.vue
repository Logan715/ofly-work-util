<template>
  <div v-loading="loading">
    <div class="condition">
      <div class="label">计划编号：</div> 
      <!-- <el-input v-model="planId" class="input" placeholder="计划编号" @blur="handlePlanChange" /> -->
      <PlanCascader v-model="planId" @change="handlePlanChange" />
      <el-button type="primary" class="analysis-btn" :disabled="!planId" @click="handleAnalysis">分析</el-button>
    </div>
    <div style="margin-bottom: 12px;margin-top:12px;">
      已分析计划时间：
      <!-- <el-tag v-for="date in analysisDateList" :key="date" :type="selectDates.includes(date) ?'priamry':'info'" class="tag" @click.native="handleSelectDate(date)">{{ date }}</el-tag> -->
      <el-date-picker
        v-model="selectDates"
        type="daterange"
        range-separator="~"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
    </div>
    <el-button type="primary" class="mr" style="margin-bottom: 12px;" :disabled="!canGetExport" @click="getAnalysisPlanResult">获取分析报告</el-button>
    <!-- <el-button type="primary" style="margin-bottom: 12px;" :disabled="!canCopyLink" @click="handleCopyLink">复制链接</el-button> -->
    <el-dropdown 
      class="mr"
      :disabled="!canCopyLink"
      split-button 
      type="primary" 
      @click="handleCopyLink()" 
      @command="handleCopyLink"
    >
      复制链接
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="copyLink">复制链接</el-dropdown-item>
        <el-dropdown-item command="copyContentAndLink">复制内容+链接</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button type="primary" style="margin-bottom: 12px;" @click="handleScreenshots">截图</el-button>
    <el-button type="primary" style="margin-bottom: 12px;" @click="handleGeneralScreenshots">截图(general)</el-button>
    <div ref="content" class="content">
      <div class="general">
        <div ref="contentGeneral">
          <div class="title mb">
            <div>
              <span>{{ plan.productionName }}</span>
            </div>
            <div>
              <span v-if="planId" style="color: #1cc91c;margin-right: 4px;">[{{ planId }}]</span>  
              <span>{{ plan.label }}</span>
            </div>
            <!-- <div v-if="bugRate!='0'" class="title bug-rate">
              <span>Bug率：</span>
              <span :class="{'notice': warnRate}">{{ bugRate }}%</span>
            </div> -->
          </div>
          <div class="general">
            <plan-analysis-card type="story" :data="result.story" title="需求" style="margin-right: 12px;" @click="handleCompareList" />
            <plan-analysis-card type="bug" :data="result.bug" title="Bug" @click="handleCompareList" />
          </div>
        </div>
        <plan-analysis-compare-list style="margin-top: 12px;" :type="type" :data="compareList" :selected-rows.sync="selectedRows" />
      </div>
    </div>
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
import html2canvas from 'html2canvas'
import moment from 'moment'
import * as clipboard from "clipboard-polyfill";
import numeral from 'numeral'
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
      selectDates: [],
      compareList: [],
      type: undefined,
      selectedRows: [],
    }
  },
  computed: {
    warnRate() {
      const bugRate = Number(this.bugRate || "0");
      return bugRate > 200
    },
    bugRate() {
      const storyCount = this.result?.story && this.result?.story[0]?.count;
      const bugCount = (this.result?.bug && this.result?.bug[0].count ) || 0;
      if(!storyCount) {
        return `${bugCount * 100}`
      } else {
        return numeral(bugCount * 100/ storyCount).format("0.[00]")
      }
    },
    pickerOptions() {
      return {
        disabledDate:(date) => {
          return !this.analysisDateList.includes(moment(date).format('YYYY-MM-DD'))
        }
      }
    },
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
        if(val.length > 1) {
          this.selectDates = [val[1], val[0]]
        } else {
          this.selectDates = [val[0], val[0]]
        }
        this.$nextTick(this.getAnalysisPlanResult)
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
    async handleCopyLink(copyType="copyLink") {
      const copyContent = this.selectedRows.map(row=> {
        if(this.type ==="bug") {
          if(copyType==="copyLink") {
            return `http://120.39.223.102:12005/wwwroot/www/index.php?m=bug&f=view&bugID=${row.bugId}`
          }
          return `${row.bugTitle}【${row.toUserName}】([bugId=${row.bugId}](http://120.39.223.102:12005/wwwroot/www/index.php?m=bug&f=view&bugID=${row.bugId} ))`
        } else {
          if(copyType==="copyLink") {
            return `http://120.39.223.102:12005/wwwroot/www/index.php?m=story&f=view&storyID=${row.storyId}`
          }
          return `${row.storyTitle}【${row.toUserName || ''}】([storyId=${row.storyId}](http://120.39.223.102:12005/wwwroot/www/index.php?m=story&f=view&storyID=${row.storyId} ))`
        }
      }).join('\n');

      await copy(copyContent);
      this.$message.success('复制完成')
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
    async handleGeneralScreenshots() {
      const that = this
      const canvas = await html2canvas(this.$refs.contentGeneral, { useCORS: true })
      
      canvas.toBlob(async (blob, )=> {
        const item = new clipboard.ClipboardItem({ "image/png": blob});
        await clipboard.write([item]);
        that.$message.success('复制完成')
      })
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
  flex-direction: column;
  align-items: center;
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
  margin-bottom: 8px;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
    align-items: center;
}
.general {
  display: inline-block;
}
.bug-rate {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: gray;
    flex-direction: row;
}
.notice {
    color: red;
    cursor: pointer;
  }
</style>