<template>
  <el-button type="text" @click="visible=true">
    产品维护
    <ProductionManagerModal :visible.sync="visible" :user="user" />
  </el-button>
</template>
<script>
import ProductionManagerModal from './ProductionManagerModal.vue'
export default {
  components: {
    ProductionManagerModal
  },
  props: {
    user: {
      type: Object,
      default() {return {}}
    }
  },
  data () {
    return {
      visible: false
    }
  }
}
</script>