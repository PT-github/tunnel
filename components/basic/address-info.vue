<template>
  <el-select v-model="choseValue" clearable filterable :placeholder="placeholder">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.name"
      :value="item.value">
    </el-option>
<!--    <el-option :value="choseValue" :label="'value:' + choseValue"></el-option>-->
  </el-select>
</template>

<script>
export default {
  services: ['basic'],
  props:{
    placeholder:{
      type:String,
      default:()=>{
        return "请选择"
      }
    },
    value:{
      type: [String,Number],
      default:()=>{
        return ''
      }
    }
  },
  watch:{
    value:{
      handler(val){
        this.choseValue = val+'';
      },
      deep: true
    },
    choseValue:{
      handler(val){
        this.$emit('input',val);
      }
    }
  },
  data() {
    return{
      choseValue: '',
      options:[]
    }
  },
  mounted(){
    if(this.value){
      this.choseValue = this.value+''
    }
    this.initData()
  },
  methods: {
    initData(){
        this.$service.basic.getAddress().then((res=[])=>{
          this.options = res;
          // this.$emit("areaLoad",res[0]&&res[0]['parentId'])
        })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
