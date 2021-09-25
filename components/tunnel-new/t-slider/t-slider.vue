<template>
  <div class="t-slider">
    <div class="arrow" :style="{left: currentVal + '%'}"></div>
    <span class="percent" :style="{left: currentVal + '%'}">{{ currentVal }}%</span>
    <!-- <div class="bg"></div> -->
    <el-slider :disabled="disabled" :show-tooltip="false" v-model="currentVal" @change="handleChange" @input="sliderChanging" style="width: 100%;"></el-slider>
  </div>
</template>

<script>
  export default {
    name:"t-slider",
    props: {
      value: {},
      data: {},
      disabled: {
        type: Boolean,
        default: false
      }
      
    },
    data() {
      return {
        currentVal: 0
      };
    },
    created() {
      this.currentVal = this.value || 0
    },
    watch: {
      value: {
        handler: function (v) {
          this.currentVal = v || 0
        }
      }
    },
    methods: {
      handleChange (v) {
        this.$emit('change', this.currentVal, this.data, this)
      },
      sliderChanging (v) {
        this.currentVal = v
        // this.$emit('change', this.currentVal, this.data, this)
      },
      resetVal () {
        this.currentVal = this.value || 0
      }
    }
  }
</script>

<style lang="scss">
.t-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // outline: 1px solid red;
  .el-slider__button {
    width: 10px;
    height: 10px;
  }
  .el-slider__bar {
    background-color: #5DA0FE;
  }
  .el-slider__button {
    border-color: #FFFFFF;
  }
  .percent {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 60%;
    color: #E7743A;
    font-size: 14px;
  }
  .arrow {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 11px;
    color: #E7743A;
    width: 10px;
    height: 20px;
    box-sizing: border-box;
    border-width: 10px 5px;
    border-style: solid;
    border-color: #E7743A transparent transparent transparent;
  }
  .bg {
    height: 4px; // 2px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, .5), rgb(255, 255, 255));
    position: absolute;
    left: -3%;
    right: -3%;
    // width: 100%;
    top: 50%;
    transform: translateY(-50%);
    &::before {
      content: '';
      width: 3.9062rpx;
      height: 3.9062rpx;
      background-color: rgba(255, 255, 255, .5);
      position: absolute;
      left: 0;
      top: 50%;
      border-radius: 100%;
      transform: translateY(-50%);
    }
    &::after {
      content: '';
      width: 10px;
      height: 10px;
      background-color: rgb(255, 255, 255);
      position: absolute;
      right: 0;
      top: 50%;
      border-radius: 100%;
      transform: translateY(-50%);
    }
  }
}
</style>
