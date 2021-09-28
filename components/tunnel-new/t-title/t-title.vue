<template>
  <div class="t-title">
    <span><slot>报警预测</slot></span>
    <div class="fold" :class="{ active: current }" @click.stop="handleClick"></div>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
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
    watch: {
      isFold (v) {
        this.current = v
      }
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
  width: 320px;
  height: 40px;
  background: url(../../../assets/tunnel/t-title.png) center / 320px auto no-repeat;
  padding: 11px 0 0 43px;
  box-sizing: border-box;
  position: relative;
  span {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #5DA0FE;
  }
  .fold {
    position: absolute;
    top: 16px;
    right: 28px;
    width: 16px;
    height: 16px;
    background: url(../../../assets/tunnel/fold.png) center / 16px 16px no-repeat;
    transition: transform .2s linear;
    &.active {
      transform: rotate(180deg);
    }
  }
}
</style>
