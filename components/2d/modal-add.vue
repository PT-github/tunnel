<template>
  <div>
    <live
      :live="textObj"
      :imgUrls="imgUrls"
      :resolutionPower="resolutionPower"
      :mode="templateType"
      :textArr="textArr"
      :orginBmps="bmps"
      :idx="idx"
      @imgChange="imgChange"
      ref="live"
      class="live"
    ></live>
    <div>
      <txt
        v-model="textObj"
        :txtWH="txtWH"
        :allowRowHeight="allowRowHeight"
        :allowSpacing="allowSpacing"
        v-if="showText"
        ref="text"
        @textArrChange="textArrChange"
      ></txt>
      <play v-model="playObj" @resolutionPowerOptions="resolutionPowerOptions" ></play>
    </div>
     <div class="buttons">

      <el-button type="primary" @click="doSave">保存</el-button>
      <el-button type="primary" @click="doaCafagfalog">取消</el-button>
    </div>
  </div>
</template>
<script>
import Txt from "./editor/txt.vue";
import live from "./editor/live.vue";
import Play from "./editor/play.vue";
export default {
  services: ["_2d"],
  components: {
    Txt,
    live,
    Play,
  },
  name: "modalAdds",
  props: {
    tunnelId: String,
    // resolutionPower: {
    //   type: String,
    //   default: () => {
    //     return "96*32";
    //   },
    // },

  },
  data() {
    return {
      idx: 0,
      textArr: [],
      bmps: [],
      imgUrls: "",
      templateType: 0,
      showText: true, //显示文本组件
      textObj: {},
      allowRowHeight: true,
      allowSpacing: true,
      playObj: {},
      showingDeviceIdx: 1,
      resolutionPower:"96*32"
    };
  },
   computed: {
    txtWH() {
      let wh = this.resolutionPower.split("*");
      // 0 文字 1 图片 2 左图右文 3 左文右图，5上图下文  6 图文图
      let whObj = {
        w: 0,
        h: 0,
      };
      if (this.templateType == 0) {
        whObj.w = Number(wh[0]);
        whObj.h = Number(wh[1]);
      } else if (
        this.templateType == 2 ||
        this.templateType == 3 ||
        this.templateType == 6
      ) {
        whObj.w = (Number(wh[0]) * 2) / 3;
        whObj.h = Number(wh[1]);
      } else if (this.templateType == 5) {
        whObj.w = Number(wh[0]);
        whObj.h = Number(wh[1]) / 2;
      }
      return whObj;
    },
    submitparms() {
      return {
        templateType: this.templateType,
        imgUrls: this.imgUrls,
        ...this.textObj,
        point:this.$refs.live.getAllPoint().point,
        // ...this.otherObj,
        ...this.playObj,
        templetId:this.id || '',
        resolutionPower: this.playObj.resolutionPower || "96*32",
      };
    },
    showingDeviceContent() {
      // 当前展示的设备内容
      if (!this.deviceList.length) return;
      return JSON.parse(this.deviceList[this.showingDeviceIdx].templateText);
    },
  },
  methods: {
    //分辨率
    resolutionPowerOptions(val){
      this.resolutionPower = val;
    },
    //编辑穿值
    opens(row){
        console.log(row)
      let obj = JSON.parse(row.templetText);
      this.resolutionPower = obj.resolutionPower;
      this.id = row.id;
      this.textObj = obj;
      this.playObj = obj;
    },
    textArrChange(textArr) {
      this.textArr = textArr || [];
    },
    imgChange(url = "") {
      this.imgUrls = url;
    },
    doSave() {
      // let txt = this.$refs.text.detail;
      // console.log(this.submitparms);
      // 保存模板
      if(this.submitparms.bold){
        this.submitparms.bold=1
      }else{
         this.submitparms.bold=0
      }
      if(this.submitparms.italics){
        this.submitparms.italics=1
      }else{
         this.submitparms.italics=0
      }
      (this.submitparms.resolutionPowerWidth) = (this.resolutionPower.split('*')[0])*100/100;
      this.submitparms.resolutionPowerHeight = (this.resolutionPower.split('*')[1])*100/100;
      this.$service._2d.saveInfoBoardTmp({...this.submitparms}).then(() => {
        //this.updateTpls();
        this.$notifySuccess();
        this.$emit('close',false)
      });
    },
    doaCafagfalog(){
        //alert(1)
      this.$emit('close',false)
    }
  },
};
</script>
<style scoped>
.buttons{
    float: right;
    padding: 10px;
}
.live {
  margin-bottom: 20px;
}
</style>
