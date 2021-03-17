<template>
  <!--播放设置 -->

  <!--  <div class="content">
            <div class="content-stop">
               
                   投放时间 <el-input-number v-model="playDetail.intervalShow"  :min="1" :max="10" class="number" label="描述文字"></el-input-number>
               
            </div>
            <div class="content-play">
                播放效果<el-select class="content-play-select" filterable v-model="playDetail.emergeFlag" placeholder="选择播放效果">
                        <el-option
                        v-for="item in emergeFlagOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </div>
                        <div class="content-play">
                播放效果<el-select class="content-play-select" filterable v-model="playDetail.emergeFlag" placeholder="选择播放效果">
                        <el-option
                        v-for="item in emergeFlagOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </div>
         <div class="content-play" v-if="playDetail.emergeFlag>1">
                出字速度<el-slider :min="0" :max="49"  v-model="playDetail.emergeSpeed" show-input> </el-slider>
            </div> -->
  <div class="paay">
    <el-form  :inline="true">
      <el-row>
        <el-form-item label="投放时间">
          <el-input-number
            v-model="playDetail.intervalShow"
            :min="1"
            :max="10"
            class="number"
            size="mini" 
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="emergeFlag" label="播放效果">
          <el-select
            class="content-play-select"
            filterable
            v-model="playDetail.emergeFlag"
            placeholder="选择播放效果"
          >
            <el-option
              v-for="item in emergeFlagOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="resolutionPower" label="分辨率">
          <el-select
            filterable
            class="content-play-select"
            v-model="playDetail.resolutionPower"
            placeholder="选择分辨率"
            @change="resolutionPowerOptions"
          >
            <el-option
              v-for="item in resolutionPowerArr"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>  
        </el-form-item>
        <el-form-item label="出字速度" v-if="playDetail.emergeFlag>1">
          <el-input-number
           v-model="playDetail.emergeSpeed"
              size="mini" 
            :min="0" :max="49"
            class="number"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import container from "./container.vue";
export default {
  components: { container },
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      emergeFlagOption: [
        { label: "黑屏", value: 0 },
        { label: "立即显示", value: 1 },
        { label: "上移", value: 2 },
        { label: "下移", value: 3 },
        { label: "左移", value: 4 },
        { label: "右移", value: 5 },
        { label: "横百叶窗", value: 6 },
        { label: "竖百叶窗", value: 7 },
        { label: "上下合拢", value: 8 },
        { label: "上下展开", value: 9 },
        { label: "左右合拢", value: 10 },
        { label: "左右展开", value: 11 },
        { label: "中心合拢", value: 12 },
        { label: "中心展开", value: 13 },
        { label: "向下马赛克", value: 14 },
        { label: "向右马赛克", value: 15 },
        { label: "淡入", value: 16 },
        { label: "淡出", value: 17 },
        { label: "字符闪烁（闪后消失）", value: 18 },
        { label: "字符闪烁（闪后停留）", value: 19 },
        { label: "区域闪烁（闪后复原）", value: 20 },
        { label: "区域闪烁（闪后区域为黑）", value: 21 },
      ],
      playDetail: {
        emergeSpeed: 0,
        emergeFlag: 1,
        intervalShow: 2,
        resolutionPower:'96*32',
      },
       resolutionPowerArr:''
    };
  },

  watch: {
    value: {
      handler(obj) {
        this.playDetail = {
          emergeSpeed: Number(obj.emergeSpeed) || 0,
          emergeFlag: Number(obj.emergeFlag) || 1,
          intervalShow: Number(obj.intervalShow) || 2,
          resolutionPower:(obj.resolutionPower) || '96*32',
        };
      },
      deep: true,
      immediate: true,
    },
    playDetail: {
      handler(val) {
        if (JSON.stringify(val) != JSON.stringify(this.value)) {
          this.$emit("input", val);
        }
      },
      deep: true,
    },
  },
  methods:{
    resolutionPowerOptions(val){
      this.$emit('resolutionPowerOptions',val)
    }
  },
  mounted(){
    this.resolutionPowerArr = JSON.parse(localStorage.getItem("resolutionPower")||'[]'),  
      console.log(JSON.parse(localStorage.getItem("resolutionPower")||'[]'))
  }

};
</script>

<style scoped lang="less">
.content {
  // padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-stop {
    flex: 1;
    .slider {
      width: 300px;
    }
  }
  &-play {
    margin-left: 80px;
    flex: 1;
    &-select {
      margin-left: 12px;
    }
  }
}
.paay {
  padding: 10px 0px;
}
/deep/ .el-select .el-input__inner {
  width: 100px;
  font-size: 12px !important;
}
.content-play-select {
  font-size: 12px !important;
}
.content-play {
  width: 120px;
  font-size: 12px;
}
/deep/ .el-form--inline .el-form-item__label {
  font-size: 12px;
}
.number {
  display: inline-block;
  width: 115px;
  font-size: 12px;
}
/deep/ .el-input__inner {
        height: 0.30666667rem !important;
}
</style>

