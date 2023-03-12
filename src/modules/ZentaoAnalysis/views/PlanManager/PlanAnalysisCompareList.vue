<template>
  <div>
    <el-table :data="data" border stripe header-row-class-name="ofly-table-head" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="50" align="center" />
      <el-table-column v-if="isBug" prop="bugId" label="bugID" width="80" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="openBug(row)">{{ row.bugId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column v-else prop="storyId" label="需求ID" width="80" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="openStory(row)">{{ row.storyId }}</el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="isBug" prop="bugTitle" label="bug标题" show-overflow-tooltip />
      <el-table-column v-else prop="storyTitle" label="需求标题" show-overflow-tooltip />
      <el-table-column prop="priority" sortable label="优先级" width="120" align="center" />
      <el-table-column v-if="isBug" prop="createUserName" sortable label="创建者" align="center" width="120" />
      <el-table-column v-if="isBug" prop="toUserName" sortable label="指派给" align="center" width="120" />
      <el-table-column prop="status" sortable label="状态" align="center" width="120" />
    </el-table>
    <PlanAnalysisCompareToolbar 
      :visible="toolbarVisible" 
      :position="position" 
      @command="handleComand"
    />
  </div>
</template>
<script>
import { 
  getCompareList
} from '../../api'
import PlanAnalysisCompareToolbar from './PlanAnalysisCompareToolbar.vue'
import copy from 'clipboard-copy'
export default {
  components: {PlanAnalysisCompareToolbar},
  props: {
    planId: Number,
    type: String,
    state: String,
    dates: {
      type: Array,
      default() {return []}
    }
  },
  data () {
    return {
      data: [],
      selectedRows: [],
      toolbarVisible: false,
      position: {
        x: 0,y:0
      }
    }
  },
  computed: {
    condition() {
      return {
        planId: this.planId,
        type: this.type,
        state: this.state,
        dates: this.dates,
      }
    },
    isBug() {
      return this.type === 'bug'
    }
  },
  watch: {
    condition: {
      immediate: true,
      handler(condition) {
        if(condition.planId && condition.dates.length==2 && condition.type) {
          this.loadData()
        }
      }
    }
  },
  mounted () {
    this.$el.addEventListener('contextmenu', event=> {
      event.preventDefault();
      console.log(event.clientX, event.clientY)
      this.position.x = event.clientX
      this.position.y = event.clientY
      this.toolbarVisible = true;
    })
    // 右键取消 begin
    document.body.addEventListener(`click`, () => {
      this.toolbarVisible = false;
    });
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const { data } = await getCompareList(this.condition)
        this.data = data
      } catch(e) {console.error(e);}
      this.loading = false;
    },
    handleComand(command) {
      switch(command) {
        case `copyLink`:
        case `copyContentAndLink`:
          this.handleCopyLink(command)
          break;
      }
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
    openBug(row) {
      window.open(`http://120.39.223.102:12005/wwwroot/www/index.php?m=bug&f=view&bugID=${row.bugId}`)
    },
    openStory(row) {
      window.open(`http://120.39.223.102:12005/wwwroot/www/index.php?m=story&f=view&storyID=${row.storyId}`)
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
      // this.$emit('update:selectedRows', rows)
    }
  }
}
</script>