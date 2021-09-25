<template>
  <view class="t-left-title" :class="'t-left-title_'+type" >
    <text><slot></slot></text>
  </view>
</template>

<script>
  export default {
    name:"t-left-title",
    props: {
      type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss" scoped>
.t-left-title {
  height: 24.2187rpx;
  box-sizing: border-box;
  padding: 9.375rpx 0 7.8125rpx 12.8906rpx;
  font-size: 6.25rpx;
  font-weight: bold;
  color: #5DA0FE;
  background-repeat: no-repeat;
  background-image: url(../../static/shijian@2x.png);
  background-size: 7.0312rpx auto;
  background-position: 2.3437rpx 9.375rpx;
  &.t-left-title_1 {
    background-image: url(../../static/tishi@2x.png);
  }
}
</style>
