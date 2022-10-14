<template>
  <div class="card">
    <div class="title">
      {{ title }}
      (<span class="link" @click="handleCompare('all')">{{ story.count }}</span>)
    
      <span v-if="story.count-story.finishedCount" class="notice" @click="handleCompare('unFinished')">-剩余{{ story.count-story.finishedCount }}</span>
    </div>
    <div class="content">
      <div class="block">
        <div class="date ">{{ story.analysisDate }}</div>
        <div class="data">
          <div class="count count-left">
            <div class="sub-title">紧急</div>
            <div class="divider" :class="{'notice': story.urgentCount !== story.urgentFinishedCount}">{{ story.urgentFinishedCount }}</div>
            <div>{{ story.urgentCount }}</div>
          </div>
          <div class="count count-right">
            <div class="sub-title">所有</div>
            <div class="divider" :class="{'notice': story.count !== story.finishedCount}">{{ story.finishedCount }}</div>
            <div>{{ story.count }}</div>
          </div>
        </div>
      </div>
      <div v-if="comparable" class="block">
        <div class="date ">{{ compareStory.analysisDate }}</div>
        <div class="data">
          <div class="count count-left">
            <div class="sub-title">紧急</div>
            <div class="divider">{{ compareStory.urgentFinishedCount }}</div>
            <div>{{ compareStory.urgentCount }}</div>
          </div>
          <div class="count count-right">
            <div class="sub-title">所有</div>
            <div class="divider">{{ compareStory.finishedCount }}</div>
            <div>{{ compareStory.count }}</div>
          </div>
        </div>
      </div>
      <div v-if="comparable" class="block">
        <div class="date">对比</div>
        <div class="data">
          <div class="count count-left">
            <div class="sub-title">紧急新增</div>
            <div class="compare-data link" :class="{'notice': story.urgentCount !== compareStory.urgentCount}" @click="handleCompare('urgentAdd')">{{ story.urgentCount -compareStory.urgentCount }}</div>
          </div>
          <div class="count count-right">
            <div class="sub-title">所有新增</div>
            <div class="compare-data link" :class="{'notice': story.count !== compareStory.count}" @click="handleCompare('add')">{{ story.count - compareStory.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default() {return []}
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    comparable() {
      return this.data?.length >= 2
    },
    story() {
      return this.data?.length?this.data[0]: {}
    },
    compareStory() {
      return this.data?.length?this.data[1]: {}
    },
    
  },
  methods: {
    handleCompare(state) {
      this.$emit('click', {
        type: this.type,
        state
      })
    }
  }
}
</script>
<style lang="less" scoped>
.card {
  border: 1px solid #d9d9d9;;
  border-radius: 8px;
  display: inline-block;
  .title {
    display: flex;
    justify-content: center;
    font-size: 24px;
    flex: 1;
    font-weight: 700;
    border-bottom: 1px solid #d9d9d9;;
    padding: 8px;
  }
  .content {
    width: 100%;
    text-align: center;
    display: flex;
  }
  .block {
    display: flex;
    flex-direction: column;
    border-left: 1px solid #d9d9d9;
    width: 100%;
  }
  .date {
     font-size: 20px;
     padding: 8px;
     background-color: #3c60bd;
     color:white;
     font-weight: 500;
  }
  .date-divider {
    border-left: 1px solid #d9d9d9;
  }
  .data {
    display: flex;
    flex: 1;
    // width: 160px;
  }
  .count {
    flex: 1;
    display: flex;
    justify-content:flex-start;
    flex-direction: column;
    align-items: center;
    color: white;
    padding: 12px;
    font-size: 20px;
    
  }
  .count-left {
    background-color: #3c60bd;
    color: #ff9900;
  }
   .count-right {
    background-color: #5e97f6;
  }
  .divider {
    border-bottom: 1px solid white;
  }
  .sub-title {
    font-size: 18px;
  }
  .notice {
    color: red;
    cursor: pointer;
  }
  .link {
    cursor: pointer;

  }
  .compare-data {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
  }
  
}
</style>