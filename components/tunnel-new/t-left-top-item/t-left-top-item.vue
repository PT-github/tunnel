<template>
  <div class="t-left-top-item">
    <div class="title">
      <span>{{ text }}</span>
    </div>
    <div class="num">
      <span class="total">{{total}}</span><span class="unit">起</span>
    </div>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
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
  width: 140px;
  height: 82px;
  background: url(../../../assets/tunnel/left-top-bg.png) center / 140px auto no-repeat;
  .title {
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    padding: 27px 0 0 20px;
  }
  .num {
    padding-left: 22px;
  }
  .total {
    font-size: 20px;
    font-weight: bold;
    color: #4995FE;
    padding-right:3px;
  }
  .unit {
    font-size: 14px;
    font-weight: bold;
    color: #FFFFFF;
    opacity: 0.5;
  }
}
</style>
