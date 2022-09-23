<template>
  <el-table :data="data" border stripe header-row-class-name="ofly-table-head">
    <el-table-column type="index" width="50" align="center" />
    <el-table-column prop="bugId" v-if="isBug" label="bugID" width="80" align="center">
      <template #default="{ row }">
        <el-button type="text" @click="openBug(row)">{{ row.bugId }}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="storyId" v-else label="需求ID" width="80" align="center">
      <template #default="{ row }">
        <el-button type="text" @click="openStory(row)">{{ row.storyId }}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="bugTitle" v-if="isBug" label="bug标题" show-overflow-tooltip />
    <el-table-column prop="storyTitle" v-else label="需求标题" show-overflow-tooltip />
    <el-table-column prop="priority" label="优先级" width="120" align="center" />
    <el-table-column prop="createUserName" v-if="isBug" label="创建者" align="center" width="120" />
    <el-table-column prop="toUserName" v-if="isBug" label="指派给" align="center" width="120" />
    <el-table-column prop="status" label="状态" align="center" width="120" />
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
  }
}
</script>