<template>
  <view class="t-left-top-item">
    <view class="title">
      <text>{{ text }}</text>
    </view>
    <view class="num">
      <text class="total">{{total}}</text><text class="unit">起</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"t-left-top-item",
    props: [ 'text', 'total' ],
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss" scoped>
.t-left-top-item {
  width: 54.6875rpx;
  height: 32.0312rpx;
  background: url(../../static/left-top-bg.png) center / 54.6875rpx auto no-repeat;
  .title {
    font-size: 5.4687rpx;
    font-weight: 400;
    color: #FFFFFF;
    padding: 10.5468rpx 0 0 7.8125rpx;
  }
  .num {
    padding-left: 8.5937rpx;
  }
  .total {
    font-size: 7.8125rpx;
    font-weight: bold;
    color: #4995FE;
    padding-right:1.1718rpx;
  }
  .unit {
    font-size: 5.4687rpx;
    font-weight: bold;
    color: #FFFFFF;
    opacity: 0.5;
  }
}
</style>
