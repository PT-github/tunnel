<template>
  <div class="t-modal-lighteNess">
    <div class="header">
      <span>统一调光</span>
      <span class="close" @click="handleCancel">x</span>
    </div>
    <div class="content">
      <t-slider :value="value" @change="handleSliderChange"></t-slider>
    </div>
    <div class="submit-area">
      <span @click="handleCancel">取消</span>
      <span class="active" @click="handleSubmit">保存</span>
    </div>
  </div>
</template>

<script>
import tSlider from '../t-slider/t-slider.vue'
  export default {
    name:"t-modal-lighteNess",
    props: {
      deviceId: {
        type: Array,
        default: () => []
      },
      classifyNumber: {}
    },
    services: ["_2d", "tunnel", "tunnel_2d"],
    components: {
      tSlider
    },
    data() {
      return {
        value: 50,
      };
    },
    methods: {
      handleCancel () {
        this.$emit('close')
      },
      handleSliderChange (v) {
        this.value = v
      },
      handleSubmit () {
        this.$service.tunnel_2d.tCombinationschemeitemImplement({
          classifyNumber: this.classifyNumber,
          deviceId: this.deviceId.join(','),
          lighteNess: this.value
        }).then(res => {
          if (res && res.status === 1) {
            this.$notifySuccess()
            this.$emit('change')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
.t-modal-lighteNess {
  width: 480px;
  height: 220px;//703px;
  box-sizing: border-box;
  background: #0B0A30;
  border: 1px solid #1D2388;
  display: flex;
  flex-direction: column;
  .content {
    height: 56px;
    position: relative;
    width: 85%;
    margin: 20px auto;
  }
  
  .submit-area {
    width: 100%;
    // padding-right: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    span {
      width: 80px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      background: #1B195A;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #286BC8;
      &.active {
        background: #3B46E2;
        color: #FFFFFF;
      }
      & + span {
        margin-left: 10px;
      }
    }
  }
  .header {
    border-bottom: 1px solid #1D2388;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #5DA0FE;
    background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) 19px center / 18px auto no-repeat;
    padding-left: 51px;
    height: 56px;
    line-height: 56px;
    position: relative;
    .close {
      position: absolute;
      width: 33px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      background: #1B195A;
      color: #2B79E3;
      font-size: 22px;
      right: 14px;
      top: 11px;
    }
  }
}
</style>
