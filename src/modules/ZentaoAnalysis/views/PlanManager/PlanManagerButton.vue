<template>
  <el-button type="text" @click="visible=true">
    计划维护
    <PlanManagerModal :user="user" :visible.sync="visible" />
  </el-button>
</template>
<script>
import PlanManagerModal from './PlanManagerModal.vue'
export default {
  components: {
    PlanManagerModal
  },
  props: {
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data () {
    return {
      visible: false,
    }
  }
}
</script>