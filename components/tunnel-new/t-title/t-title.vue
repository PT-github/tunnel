<template>
  <view class="t-title">
    <text><slot>报警预测</slot></text>
    <view class="fold" :class="{ active: current }" @click="handleClick"></view>
  </view>
</template>

<script>
  export default {
    name:"t-title",
    props: {
      // 是否展开
      isFold: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        current: false
      };
    },
    created () {
      this.current = this.isFold
    },
    methods: {
      handleClick () {
        this.current = !this.current
        this.$emit('is-fold', this.current)
      }
    }
  }
</script>

<style lang="scss" scoped>
.t-title {
  width: 125rpx;
  height: 15.625rpx;
  background: url(../../static/t-title.png) center / 125rpx auto no-repeat;
  padding: 4.2968rpx 0 0 16.7968rpx;
  box-sizing: border-box;
  position: relative;
  text {
    font-size: 6.25rpx;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #5DA0FE;
  }
  .fold {
    position: absolute;
    top: 6.25rpx;
    right: 10.9375rpx;
    width: 6.25rpx;
    height: 6.25rpx;
    background: url(../../static/fold.png) center / 6.25rpx 6.25rpx no-repeat;
    transition: transform .2s linear;
    &.active {
      transform: rotate(180deg);
    }
  }
}
</style>
