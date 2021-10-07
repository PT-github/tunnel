<template>
  <div class="t-device-warn" :class="'t-device-warn_' + type">
    <span class="time">{{ data.warningTime }}</span>
    <span class="des">{{ data.warningContent }}</span>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name:"t-device-warn",
    props: {
      type: {
        type: String,
        default: ''
      },
      data: {
        type: Object,
        default: () => {
          return {}
        }
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
  width: 284px;
  height: 52px;
  background: #0E0C46;
  border: 1px solid;
  border-image: linear-gradient(0deg, #103F7F, #1288EC) 1 1;
  border-radius: 10px;
  display: flex;
  padding: 15px 7px;
  box-sizing: border-box;
  align-items: center;
  .des {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    height: 21px;
    line-height: 21px;
    padding-right: 23px;
  }
  .time {
    width: 76px;
    height: 21px;
    line-height: 21px;
    text-align: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #DFEEF3;
    background-color: #2B79E3;
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.t-device-warn_1 {
    .des {
      height: 36px;
      line-height: 18px;
      white-space: normal;
      word-break: break-all;
      // vertical-align: cen;
    }
  }
}
</style>
