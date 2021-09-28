<template>
  <div class="t-event-warn">
    <div class="name">
      <span>隧道行人</span>
    </div>
    <div class="no">
      <span>K1512+12</span>
    </div>
    <div class="status">
      <span>报警中</span>
    </div>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name:"t-event-warn",
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss" scoped>
.t-event-warn {
  width: 143px;
  height: 106px;
  background: url(../../../assets/tunnel/warn-bg.png) center / 143px auto no-repeat;
  text-align: center;
  .name {
    font-size: 14px;
    font-weight: 400;
    color: #5DA0FE;
    padding-top: 16px;
  }
  .no {
    padding: 4px 0;
    font-size: 18px;
    font-weight: bold;
    color: #5DA0FE;
  }
  .status {
    font-size: 14px;
    font-weight: 400;
    color: #DFEEF3;
    > span {
      display: inline-block;
      height: 21px;
      line-height: 21px;
      padding: 0 8px;
      background-color: #E7743A;
    }
  }
}
</style>
