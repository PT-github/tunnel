<!--
 * @Author: PT
 * @Date: 2021-09-25 19:45:38
 * @LastEditors: PT
 * @LastEditTime: 2021-09-25 23:47:41
 * @Description: file content
-->
<template>
  <div class="uni-popup" v-if="visible">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'uni-popup',
  components: {},
  props: {
    value: Boolean,
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {},
  watch: {
    value (v) {
      this.visible = v
    }
  },
  created () {
    this.visible = this.value
  },
  mounted () {},
  methods: {}
}
</script>
<style lang='scss' scoped>
.uni-popup {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, .4);
  z-index: 1000000;
}
</style>
