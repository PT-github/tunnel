<template>
  <div>
    <el-upload
      :class="[dialogImageUrl&&'upload']"
      list-type="picture-card"
      :action="action"
      :data="param"
      :headers="headers"
      :show-file-list="true"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="handlebeforeUpload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    busType: {  // 隧道busType：Tunnel     中心头像busType：userheader
      type:String,
      default:()=>{
        return 'userheader'
      }
    },
    value: {
        type: String,
        default: () =>{
          return ''
        }
    }
  },
  watch:{
    value:{
      handler(val){
        this.handerData(this.value)
      },
      deep: true
    }
  },
  data() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let currentDay = date.getFullYear() + (month+'').padStart(2, '0') +  + (day+'').padStart(2, '0');
    return {
        action: Context.$config.baseUrl + '/tunnel/rest/file/commonUploadFileReturnPath',
        headers: {//设置header
            jwt: this.$store.state.myUserInfo.jwt
        },
        dialogImageUrl: '', // 当前预览图片地址
        dialogVisible: false, // 预览弹框 visible
        param: {
          busType: this.busType,
          uploadDate: currentDay
        },
        fileList:[]
    }
  },
  mounted(){
      this.handerData(this.value)
  },
  methods: {
    handerData(img){
      // if(!img.includes('http')&&img){
      //   img = Context.$config.baseImgUrl +img
      // }
      this.dialogImageUrl = img;
      this.fileList = img? [{
          url: img
        }] : [];
    },
    handleUploadExceed() {
      this.$ctx.toastError(`最多上传${this.limit}张图片`)
    },
    handleRemove(file, fileList) {
      this.dialogImageUrl = "";
      this.fileList =fileList;
      this.$emit('input', '')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handlebeforeUpload(file) {
        const isImg = ['image/jpeg','image/jpg','image/png','image/bmp'].includes(file.type);
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isImg) {
           this.$ctx.toastError('上传头像只能图片!');
        }
        if (!isLt10M) {
           this.$ctx.toastError('上传头像图片大小不能超过 10MB!');
        }
        return isImg && isLt10M;
    },
    handleSuccess(res, file) {
      this.dialogImageUrl = file.url;
      this.fileList = [file]
      this.$emit('input', res.data)
    }
  }
}
</script>
<style lang="less" scoped>
 /deep/ .el-upload--picture-card{
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
    background-color: rgba(22, 28, 70, .8);
  }
  /deep/ .upload  div.el-upload{
    display: none;
  }
</style>
