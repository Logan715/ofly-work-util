<template>
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
</template>
<script>

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default() {return []}
    },
    selectedRows: {
      type: Array,
      default() {return []}
    }
  },
  computed: {
    isBug() {
      return this.type === 'bug'
    }
  },
  methods: {
    openBug(row) {
      window.open(`http://zentao.newboss.com/wwwroot/www/index.php?m=bug&f=view&bugID=${row.bugId}`)
    },
    openStory(row) {
      window.open(`http://zentao.newboss.com/wwwroot/www/index.php?m=story&f=view&storyID=${row.storyId}`)
    },
    handleSelectionChange(rows) {
      this.$emit('update:selectedRows', rows)
    }
  }
}
</script>