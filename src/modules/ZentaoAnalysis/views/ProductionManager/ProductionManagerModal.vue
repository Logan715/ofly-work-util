<template>
  <el-dialog 
    :visible="visible"
    title="产品维护"
    append-to-body
    :before-close="close"
  >
    <div class="production-table">
      <el-table 
        :data="list" 
        border 
        stripe 
        header-row-class-name="ofly-table-head"
        height="100%"
      >
        <el-table-column prop="id" label="产品编号" :width="80" align="center" />
        <el-table-column prop="name" label="产品名称" show-overflow-tooltip />
        <el-table-column prop="focus" label="是否被关注" :width="100" align="center">
          <template #default="{ row }">
            <i v-if="row.focus" class="el-icon-check" style="font-size: 18px;color: green;font-weight: bold;"></i>
            <span v-else>-</span>
          </template>
          
        </el-table-column>
        <el-table-column prop="handle" label="操作" :width="80" align="center">
          <template #default="{ row }">
            <el-button type="text" @click="toggleFocus(row.id)">{{ row.focus?"取消关注": "关注" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="reloadProduction">刷新产品</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { 
  reloadProductionList, 
  getProductionList ,
  toggleFocusProduction
} from '../../api'
import WebSockeUtil from '@/utils/WebSockeUtil'

export default {
  props: {
    visible: Boolean,
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data () {
    return {
      list: [],
    }
  },
  watch: {
    visible(val) {
      if(val) {
        this.loadData()
      }
    }
  },
  mounted() {
    WebSockeUtil.subscribe("/zentao/production", response=> {
      const body = JSON.parse(response.body)
      if(body.type === "success") {
        this.$notify({
          title: '成功',
          message: '已获取最新产品列表',
          duration: 0,
          type: 'success',
          position: 'bottom-right'
        })
        setTimeout(this.loadData, 500)
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
  methods: {
    async toggleFocus(id) {
      const loading = this.$loading()
      try {
        await toggleFocusProduction(id);
        this.$message.success('操作成功')
        setTimeout(this.loadData, 50)
      } catch(e) {
        console.error(e);
      }
      loading.close()
    },
    async loadData() {
      const loading = this.$loading()
      try {
        const { records } = await getProductionList();
        this.list = records
      } catch(e) {
        console.error(e);
      }
      loading.close()
      
    },
    async reloadProduction() {
      const loading = this.$loading()
      try {
        const { note } = await reloadProductionList(this.user);
        this.$message.success(note)
      } catch(e) {
        console.error(e);
      }
      loading.close()
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.production-table {
  height: calc(85vh - 200px);
  overflow-y: auto;
}
</style>