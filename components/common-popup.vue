<template>
  <el-dialog :visible.sync="showPopup"
             append-to-body    
             :width="width"  
             :close-on-click-modal="closeOnClickModal"
             :before-close="handleClose">
    <div slot="title">
      <IndexTipTitle :title="title"></IndexTipTitle>
    </div>
    <slot></slot>
    <span slot="footer"
          v-if="showButton"
          class="dialog-footer">
                <el-button @click="btnCancel" v-if="!hideCancel">取消</el-button>
                <el-button type="primary" @click="btnConfirm">{{confirmButtonText}}</el-button>
            </span>
  </el-dialog>
</template>

<script>
import IndexTipTitle from '../components/index/tips-title';

export default {
  name: 'common-popup',
  components: {IndexTipTitle},
  props: {
    showPopup: Boolean,
    title: String,
    width: String,
    closeOnClickModal: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    confirmButtonText: {
      type: String,
      default: '确 定'
    },
    hideCancel: Boolean,

    showButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //关闭弹层
    handleClose() {
      this.$emit('handleClose');
    },
    //取消
    btnCancel() {
      this.$emit('btnCancel');
    },
    //确定
    btnConfirm() {
      this.$emit('btnConfirm');
    }
  }
};
</script>

<style scoped>

/deep/ .el-dialog {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #142E69;
  background: #142E69;
  margin-top: 5vh!important;
}

/deep/ .el-dialog__header {
  background: #142E69;
}

/deep/ .el-dialog__body {
  padding: 0px 20px 30px 20px !important;
}
</style>
