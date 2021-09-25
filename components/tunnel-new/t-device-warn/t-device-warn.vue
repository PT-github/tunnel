<template>
  <view class="t-device-warn" :class="'t-device-warn_' + type">
    <text class="time">12时20分</text>
    <text class="des">可变情报板K1223通讯异常讯异常通讯异常讯异常</text>
  </view>
</template>

<script>
  export default {
    name:"t-device-warn",
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
.t-device-warn {
  width: 110.9375rpx;
  height: 20.3125rpx;
  background: #0E0C46;
  border: 1px solid;
  border-image: linear-gradient(0deg, #103F7F, #1288EC) 1 1;
  border-radius: 10px;
  display: flex;
  padding: 5.8593rpx 2.7343rpx;
  box-sizing: border-box;
  align-items: center;
  .des {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 5.4687rpx;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    height: 8.2031rpx;
    line-height: 8.2031rpx;
    padding-right: 8.9843rpx;
  }
  .time {
    width: 29.6875rpx;
    height: 8.2031rpx;
    line-height: 8.2031rpx;
    text-align: center;
    font-size: 5.4687rpx;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #DFEEF3;
    background-color: #2B79E3;
    margin-right: 1.9531rpx;
  }
  &.t-device-warn_1 {
    .des {
      height: 14.0625rpx;
      line-height: 7.0312rpx;
      white-space: normal;
      word-break: break-all;
      // vertical-align: cen;
    }
  }
}
</style>
