<!--
 * @Author: PT
 * @Date: 2021-09-25 23:02:06
 * @LastEditors: PT
 * @LastEditTime: 2021-09-25 23:29:29
 * @Description: file content
-->
<template>
  <el-time-select
    :value="value"
    size="mini"
    format="HH:mm"
    value-format="HH:mm"
    placeholder="选择时间"
    class="time-select"
    style="width: 50px"
    prefix-icon="none"
    :clearable="false"
    @input="handleChange">
  </el-time-select>
</template>

<script>
export default {
  name: 'picker',
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: String
  },
  data () {
    return {
      
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    handleChange (v) {
      this.$emit('change', v)
    }
  }
}
</script>
<style lang='scss'>
.time-select {
  border: 1px solid #4E58ED;
  border-radius: 4px;
  .el-input__inner {
    color: #5DA0FE;
    padding: 0 10px;
    text-align: center;
    background: #0B0A30;
  }
}
</style>
