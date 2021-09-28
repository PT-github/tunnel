<template>
  <div class="t-left-title" :class="'t-left-title_'+type" >
    <span><slot></slot></span>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
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
  height: 62px;
  box-sizing: border-box;
  padding: 24px 0 20px 33px;
  font-size: 16px;
  font-weight: bold;
  color: #5DA0FE;
  background-repeat: no-repeat;
  background-image: url(../../../assets/tunnel/shijian@2x.png);
  background-size: 18px auto;
  background-position: 6px 24px;
  &.t-left-title_1 {
    background-image: url(../../../assets/tunnel/tishi@2x.png);
  }
}
</style>
