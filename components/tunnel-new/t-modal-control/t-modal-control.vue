<template>
  <uni-popup ref="popup" v-model="dialogVisible" class="t-modal-control">
    <slot></slot>
  </uni-popup>
  <!-- <el-dialog
    :visible.sync="dialogVisible"
    custom-class="t-modal-control"
    :show-close="false">
    <span>这是一段信息</span>
  </el-dialog> -->
</template>

<script>
  import uniPopup from './uni-popup.vue'
  export default {
    name:"t-modal-control",
    components: {
      uniPopup
    },
    props: {
      value: Boolean,
      // 设备类型
      classifyNumber: String,
      // 显示类型
      type: {
        type: String,
        default: '1'
      }
    },
    data() {
      return {
        dialogVisible: false
      };
    },
    created () {
      this.dialogVisible = this.value
    },
    watch: {
      value (v) {
        this.dialogVisible = v
      }
    },
    methods: {
      // handleChange (v) {
      //   this.$emit('input', v.show)
      // }
    }
  }
</script>

<style lang="scss">
.t-modal-control {
  .el-dialog__header {
    display: none;
  }
}
</style>