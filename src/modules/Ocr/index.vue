<template>
<el-row :gutter="24" v-loading="loading" class="ocr">
  <el-col :span="11" class="ocr-col ocr-col-select">
    <el-upload
      class="avatar-uploader ocr-upload"
      action="#"
      drag
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onFileChange"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" width="100%" height="100%">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </el-col>
  <el-col :span="2" class="ocr-col ocr-col-analyse">
    <el-button type="primary" @click="analyse" :disabled="!canAnalyse">识别</el-button>
  </el-col>
  <el-col :span="11" class="ocr-col">
    <el-input type="textarea" class="ocr-result" :value="words"></el-input>
  </el-col>
</el-row>
</template>
<script>
import RequestUtil from '@/utils/RequestUtil'


export default {
  data () {
    return {
      imageUrl: undefined,
      file: undefined,
      loading: false,
      result: undefined
    }
  },
  computed: {
    canAnalyse() {
      return !!this.file
    },
    words() {
      if(this.result?.words?.length) {
        return this.result.words.join('\n')
      }
      return "";
    }
  },

  methods: {
    async analyse() {
      this.loading = true;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      let formData = new FormData();
      formData.append('file', this.file.raw);
      try {
        const {code, data} = await RequestUtil.post("/oflywork/ocr/analyse", formData, config);
        if(code === 1) {
          this.result = data
        }
      } catch(e) {console.error(e);}
      this.loading = false;
    },
    onFileChange(file) {
      this.file = file;
      this.imageUrl = URL.createObjectURL(file.raw);
    }
  }
}
</script>
<style lang="less" scoped>
  .ocr {
    height: calc(100vh - 156px);
    /deep/ .el-upload {
      width: 100%;
    }
    &-col {
      height: calc(100vh - 138px);
      &-select, &-analyse {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    &-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      /deep/ .el-icon-plus:before {
        position: relative; 
        top: calc((100vh - 300px)/2);
        font-size: 56px;
      }
    }
    &-result {
      height: inherit;
      /deep/ textarea {
        height: inherit;
      }
    }
    /deep/ .el-upload-dragger {
      height: unset;
      width: unset;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100%;
      height: calc(100vh - 138px);
      line-height: 178px;
      text-align: center;
      border: 1px dashed #9999;
      border-radius: 8px;
    }
    
  }
  
</style>

