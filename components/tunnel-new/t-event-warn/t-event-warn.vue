<template>
  <view class="t-event-warn">
    <view class="name">
      <text>隧道行人</text>
    </view>
    <view class="no">
      <text>K1512+12</text>
    </view>
    <view class="status">
      <text>报警中</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"t-event-warn",
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss" scoped>
.t-event-warn {
  width: 55.8593rpx;
  height: 41.4062rpx;
  background: url(../../static/warn-bg.png) center / 55.8593rpx auto no-repeat;
  text-align: center;
  .name {
    font-size: 5.4687rpx;
    font-weight: 400;
    color: #5DA0FE;
    padding-top: 6.25rpx;
  }
  .no {
    padding: 3.125rpx 0;
    font-size: 7.0312rpx;
    font-weight: bold;
    color: #5DA0FE;
  }
  .status {
    font-size: 5.4687rpx;
    font-weight: 400;
    color: #DFEEF3;
    > text {
      display: inline-block;
      height: 8.2031rpx;
      line-height: 8.2031rpx;
      padding: 0 3.125rpx;
      background-color: #E7743A;
    }
  }
}
</style>
