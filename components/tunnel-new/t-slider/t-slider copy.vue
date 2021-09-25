<template>
  <view class="t-slider">
    <view class="arrow" :style="{left: currentVal + '%'}"></view>
    <text class="percent" :style="{left: currentVal + '%'}">{{ currentVal }}%</text>
    <view class="bg"></view>
    <view class="slide-move" :style="{left: currentVal + '%'}" @touchstart.stop.prevent="handleTouchStart"
      @touchmove.stop.prevent="handleTouchMove" @touchend.stop.prevent="handleTouchEnd"></view>
    <!-- <slider :disabled="disabled" :value="currentVal" @change="handleChange" @changing="sliderChanging"/> -->
    <!-- step="5" -->
  </view>
</template>

<script>
  export default {
    name: "t-slider",
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
        currentVal: 0,

        left: 0, // 拖拽点left值
        width: 0, // 容器的宽度

        x: 0
      };
    },
    created() {
      this.currentVal = this.value || 0
    },
    mounted() {
      let view = uni.createSelectorQuery().in(this).select(".t-slider");

      view.fields({
        size: true
      }, data => {
        // console.log("得到节点信息" + JSON.stringify(data));
        // console.log("节点的宽为" + data.width);
        this.width = data.width
      }).exec()
      let moveDom = uni.createSelectorQuery().in(this).select(".slide-move");
      moveDom.boundingClientRect(data => {
        // console.log("得到布局位置信息" + JSON.stringify(data));
        // console.log("节点离页面顶部的距离为" + data.top);
        this.left = data.left
      }).exec()
    },
    watch: {
      value: {
        handler: function(v) {
          this.currentVal = v || 0
        }
      }
    },
    methods: {

      handleTouchStart(e) {
        console.log(e)
        var touch = e.changedTouches[0]
        this.x = touch.pageX - this.left
      },
      handleTouchMove(e) {
        var touch = e.changedTouches[0]
        var direction = touch.pageX - this.x
        console.log(touch.pageX)
        if (direction > 0) {

        }
      },
      handleTouchEnd(e) {
        console.log(e)
      },


      handleChange(v) {
        this.$emit('change', this.currentVal, this.data, this)
      },
      sliderChanging(v) {
        this.currentVal = v.detail.value
        // this.$emit('change', this.currentVal, this.data, this)
      },
      resetVal() {
        this.currentVal = this.value || 0
      }
    }
  }
</script>

<style lang="scss">
  .t-slider {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    right: 0;
    bottom: 0;
    width: calc(100% - 7.8125rpx);

    .bg {
      height: 1.5625rpx; // 0.7812rpx;
      background-image: linear-gradient(to right, rgba(255, 255, 255, .5), rgb(255, 255, 255));
      position: absolute;
      left: 0;
      right: 0;
      // width: 100%;
      top: 50%;
      transform: translateY(-50%);

      &::before {
        content: '';
        width: 3.9062rpx;
        height: 3.9062rpx;
        background-color: rgba(255, 255, 255, .5);
        position: absolute;
        left: -1.9531rpx;
        top: 50%;
        border-radius: 100%;
        transform: translateY(-50%);
      }

      &::after {
        content: '';
        width: 3.9062rpx;
        height: 3.9062rpx;
        background-color: rgb(255, 255, 255);
        position: absolute;
        right: -1.9531rpx;
        top: 50%;
        border-radius: 100%;
        transform: translateY(-50%);
      }
    }

    // outline: 0.3906rpx solid red;
    .slide-move {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      bottom: 0;
      width: 19.5312rpx;
      outline: 0.3906rpx solid red;
    }

    .percent {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 60%;
      color: #E7743A;
      font-size: 5.4687rpx;
    }

    .arrow {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 4.2968rpx;
      color: #E7743A;
      width: 3.9062rpx;
      height: 7.8125rpx;
      box-sizing: border-box;
      border-width: 3.9062rpx 1.9531rpx;
      border-style: solid;
      border-color: #E7743A transparent transparent transparent;
    }
  }
</style>
