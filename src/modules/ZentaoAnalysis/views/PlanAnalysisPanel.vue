<template>
  <div v-loading="loading">
    <div class="condition">
      <div class="label">计划编号：</div> <el-input class="input" placeholder="计划编号" v-model="planId" @blur="handlePlanChange"></el-input>
      <el-button type="primary" class="analysis-btn" @click="handleAnalysis">分析</el-button>
    </div>
    <div style="margin-bottom: 12px;margin-top:12px;">
      已分析计划时间：<el-tag v-for="date in analysisDateList" :key="date" :type="selectDate ===date ?'priamry':'info'" class="tag" @click.native="selectDate=date">{{ date }}</el-tag>
    </div>
    <el-button type="primary" style="margin-bottom: 12px;" @click="getAnalysisPlanResult" :disabled="!selectDate">获取分析报告</el-button>
    <el-input type="textarea" :value="resultInfo" :autosize="{maxRows: 10, minRows: 10}"></el-input>
  </div>
</template>
<script>
import { 
  analysisPlan, 
  getAnalysisDateList,
  getAnalysisPlanResult
} from '../api'
import WebSockeUtil from '@/utils/WebSockeUtil'

export default {
  props: {
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data() {
    return {
      loading: false,
      planId: 342,
      result: undefined,
      analysisDateList: [],
      selectDate: undefined,
    }
  },
  computed: {
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
        this.getAnalysisDateList();
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
        const { data } = await getAnalysisPlanResult(this.planId, this.selectDate)
        this.result = data
      } catch(e) {console.error(e);}
      this.loading = false;
    },
    handleAnalysis() {
      this.analysis()
    },
    handlePlanChange(val) {
      if(val) {
        this.getAnalysisDateList()
      } else {
        this.analysisDateList = []
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
.tag {
  cursor: pointer;
  margin-right: 12px
}
.analysis-btn {
  margin-left: 12px
}
</style>