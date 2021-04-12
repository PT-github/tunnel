<!-- 情报板弹窗 -->
<template>
  <div>
    <section class="section">
      <div class="title flex">
        <div class="label">
          <span class="sub"
            >当前显示：情报板"{{
              showingDeviceIdx
            }}"的内容列表（点击情报板名称可以查看对应内容）</span
          >
        </div>

        <div class="select">
          <span>全选</span>
          <el-checkbox
            :value="isCheckAllDevice"
            @change="toggleSelection('deviceTable', !isCheckAllDevice)"
          ></el-checkbox>
        </div>
      </div>
      <div class="flex">
        <!--                <div class="board-show"></div>-->
        <!-- 情报板内容 -->
        <div class="board-show">
          <span
            v-for="(item, index) in deviceInfo.textArr"
            :key="index"
            :style="{
              fontFamily: `${deviceInfo.fontName}`,
              fontSize: `${deviceInfo.fontSize * 5}px`,
            }"
          >
            {{ item }}
          </span>
        </div>

        <el-table
          :data="deviceList"
          ref="deviceTable"
          height="288px"
          border
          :show-header="false"
          tooltip-effect="dark"
          @selection-change="deviceSelectionChange"
        >
          <el-table-column>
            <template slot-scope="scope">
              <div class="device-item" @click="getDeviceInfo(scope.row)">
                <!--              <div class="device-item" @click="showingDeviceIdx = scope.row.index">-->
                <div class="num">{{ scope.row.index }}</div>
                <div class="flex1">
                  <div>
                    <span class="label">设备名称：</span
                    >{{ scope.row.deviceName }}
                  </div>
                  <div>
                    <span class="label">设备桩号：</span
                    >{{ scope.row.pileNumberStr }}
                  </div>
                </div>
                <span>{{
                  scope.row.deviceCommunicationsState === 0 ? "正常" : "异常"
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            :width="50 * $px2rem"
          ></el-table-column>
        </el-table>
      </div>
    </section>

    <section class="section">
      <div class="title flex">
        <div class="label">节目</div>
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
        </div>
        <div class="select">
          <span>全选</span>
          <el-checkbox
            :value="isCheckAllTpl"
            @change="toggleSelection('tplTable', !isCheckAllTpl)"
          ></el-checkbox>
        </div>
      </div>
      <div>
        <!--  <el-form class="tpl-form" ref="tplForm" v-model="tplForm" :label-width="84*$px2rem+'px'">
          <el-form-item label="字串" prop="name">
            <el-input v-model="tplForm.text"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="字体">
                <hSelect :ds="{service:'basic',func:'getDict',params:'FontName'}"
                         v-model="tplForm.fontName" placeholder=""></hSelect>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="字号">
                <el-input-number v-model="tplForm.fontSize" :precision="0" :controls="false" :min="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="背景色">
                <hSelect :ds="{service:'basic',func:'getDict',params:'BgColor'}"
                         v-model="tplForm.backgroundColor" placeholder=""></hSelect>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="X坐标">
                <el-input-number v-model="tplForm.point.x" :precision="0" :controls="false" :min="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Y坐标">
                <el-input-number v-model="tplForm.point.y" :precision="0" :controls="false" :min="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="字间距">
                <el-input-number v-model="tplForm.spacing" :precision="0" :controls="false" :min="1"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出字方式">
                <hSelect :ds="{service:'basic',func:'getDict',params:'EmergeFlag'}"
                         v-model="tplForm.emergeFlag" placeholder=""></hSelect>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="停留时间">
                <el-input-number v-model="tplForm.interval" :precision="0" :controls="false" :min="1"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>-->
        <div class="flex">
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
            <play
              @input="playObjInput"
              @resolutionPowerOptions="resolutionPowerOptions"
            ></play>
          </div>
          <el-table
            :data="tplList"
            ref="tplTable"
            border
            height="300px"
            :show-header="false"
            tooltip-effect="dark"
            @selection-change="tplSelectionChange"
            @row-click="rowClick"
          >
            <el-table-column>
              <template slot-scope="scope">
                <div class="tpl-item" >
                  {{ scope.$index + 1 }}、{{
                    scope.row.templetName || scope.row.text
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column type="selection" width="60"></el-table-column>
          </el-table>
        </div>
      </div>
    </section>

    <popup
      :width="$getPx(1272)"
      title="模版列表"
      v-if="doOperateFormfalog"
      :show-popup="doOperateFormfalog"
      @handleClose="doOperateFormfalog = false"
    >
      <modal-operater
        @modalObj="modalObj"
        :tunnelId="tunnelId"
      ></modal-operater>
    </popup>
    <div class="buttons">
      <!-- <el-button type="primary" @click="doOperateForm">执行</el-button>
      <el-button type="primary" @click="doSave">另存为模板</el-button>
      <el-button type="primary" @click="doDelete">删除已选模板</el-button>
      <el-button type="primary" @click="doOperate">执行已选择模板</el-button> -->

      <el-button type="primary" @click="doOperateForm">选择模版</el-button>
      <el-button type="primary" @click="doPreserve">保存节目</el-button>
      <el-button type="primary" @click="doDelete">删除已选节目</el-button>
      <el-button type="primary" @click="doSave">另存为模板</el-button>
      <el-button type="primary" @click="doOperate">执行已选择节目</el-button>
    </div>
  </div>
</template>

<script>
import Txt from "./editor/txt.vue";
import live from "./editor/live.vue";
import Play from "./editor/play.vue";
import modalOperater from "./modal-operater.vue";
export default {
  components: {
    Txt,
    live,
    Play,
    modalOperater,
  },
  services: ["_2d"],
  props: {
    tunnelId: String,
    // resolutionPower: {
    //   type: String,
    //   default: () => {
    //     return "";
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
      deviceList: [],
      infoBoard: null,
      tplList: [],
      resolutionPower: "96*32",
      tplForm: {
        point: {},
      },
      doOperateFormfalog: false,
      selectedDevices: [],
      selectedTpls: [],
      deviceInfo: {},
    };
  },
  mounted() {
    this.updateDevices();
    //this.updateTpls();
  },
  methods: {
    playObjInput(val){
      this.playObj=val;
    },
    //分辨率
    resolutionPowerOptions(val) {
      this.resolutionPower = val;
    },
    textArrChange(textArr) {
      this.textArr = textArr || [];
    },
    //确定回写数据
    modalObj(val) {
      console.log(val);
      this.doOperateFormfalog = false;
      this.tplList.push(...val);
    },
    //点击行显示
    rowClick(row) {
      if(row.templetText){
        let obj = JSON.parse(row.templetText);
        this.resolutionPower = obj.resolutionPower;
        this.textObj = obj;
        this.playObj = obj;
      } else{
        this.textObj = row;
        this.playObj = row;
      }
    
    },
    imgChange(url = "") {
      this.imgUrls = url;
    },
    getDeviceInfo(row) {
      this.showingDeviceIdx = row.deviceName;

      this.getBoardDeviceInfo(row.id);
    },

    // 情报板内容
    getBoardDeviceInfo(id) {
      this.deviceInfo = {};
      this.$service._2d.getInfoBoardFromDevice(id).then((res) => {
        try {
          const boardInfo = JSON.parse(res.content);
          // boardInfo.text = '安全第一预防为主隧道行车打开大灯'

          const arr = [];
          const arrText = boardInfo.text.split("");
          for (let i = 0; i < boardInfo.text.length; i++) {
            if (i % 8 === 0) {
              arr.push(arrText.splice(0, 8).join(""));
            }
          }

          boardInfo.textArr = arr;

          this.deviceInfo = boardInfo;
        } catch (e) {
          //console.log(e);
        }
      });
    },

    toggleSelection(form, selectAll) {
      // 切换全选
      if (selectAll) {
        this.$refs[form].toggleAllSelection();
      } else {
        this.$refs[form].clearSelection();
      }
    },
    updateDevices() {
      // 更新设备
      this.$service._2d
        .getTunnelDeviceTypeList(this.tunnelId, "intelligenceboard")
        .then((res) => {
          this.deviceList = res.map((v, i) => {
            return { index: i + 1, ...v };
          });

          if (this.deviceList.length > 0)
            this.getBoardDeviceInfo(this.deviceList[0].id);
        });
    },
    updateTpls() {
      // 更新模板
      this.$service._2d.getInfoBoardTmpList(this.tunnelId).then((res) => {
        this.tplList = res.map((v, i) => {
          return { index: i + 1, ...v };
        });
      });
    },
    showTpl(tpl) {
      // 点击模板填上表单内容
      console.log(tpl)
     // this.tplForm = JSON.parse(tpl.templetText);
    },
    deviceSelectionChange(e) {
      this.selectedDevices = e;
    },
    tplSelectionChange(e) {
      this.selectedTpls = e;
    },
    doOperate() {
      // 执行模板
      //请确认是否删选择的模板信息，删除后不能恢复！
      // if (!this.deviceId) {
      //   return this.$message("请选择设备");
      // }
      if (!this.tempId) {
        return this.$message("请选择模板");
      }
      // if(!this.submitparms.text){
      //   return this.$message("请输入内容");
      // }
      for (let i in this.selectedTpls) {
        if (this.selectedTpls[i].bold) {
          this.selectedTpls[i].bold = 1;
        } else {
          this.selectedTpls[i].bold = 0;
        }
        if (this.selectedTpls[i].italics) {
          this.selectedTpls[i].italics = 1;
        } else {
          this.selectedTpls[i].italics = 0;
        }
      }
      let boardVo = {
        data: (this.selectedTpls),
        deviceIds: this.deviceId,
      };
      this.$service._2d.operateInfoBoardByTmpNew(boardVo).then(() => {
        this.updateDevices();
        this.$notifySuccess();
      });
    },
    doSave() {
      // let txt = this.$refs.text.detail;
      // console.log(this.submitparms);
      // 保存模板
      //console.log(this.submitparms.resolutionPower)
      if (!this.submitparms.text) {
        return this.$message("请输入内容");
      }
      if (this.submitparms.bold) {
        this.submitparms.bold = 1;
      } else {
        this.submitparms.bold = 0;
      }
      if (this.submitparms.italics) {
        this.submitparms.italics = 1;
      } else {
        this.submitparms.italics = 0;
      }

      this.submitparms.resolutionPowerWidth =
        (this.submitparms.resolutionPower.split("*")[0] * 100) / 100;
      this.submitparms.resolutionPowerHeight =
        (this.submitparms.resolutionPower.split("*")[1] * 100) / 100;
      this.$service._2d.saveInfoBoardTmp({ ...this.submitparms }).then(() => {
        //this.updateTpls();
        this.$notifySuccess();
      });
    },

    doPreserve() {
      if (!this.submitparms.text) {
        return this.$message("请输入内容");
      }
      let obj = { ...this.submitparms, id: Math.random() };
      this.tplList.push(obj);
    },

    doOperateForm() {
      // 直接执行模板
      // if (!this.deviceId) {
      //   return this.$message("请选择设备");
      // }

      this.doOperateFormfalog = true;
      // this.$service._2d
      //   .operateInfoBoard({
      //     deviceId: this.deviceId,
      //     ...this.tplForm,
      //     point: JSON.stringify(this.tplForm.point),
      //   })
      //   .then(() => {
      //     this.updateDevices();
      //     this.$notifySuccess();
      //   });
    },
    doDelete() {
      // 删除模板
      if (!this.tempId) {
        return this.$message("请选择模板");
      }
      console.log(this.selectedTpls);
      this.$showConfirm("请确认是否删选择的节目信息，删除后不能恢复！").then(
        () => {
          this.tplList = this.tplList.filter(
            (item) => !this.selectedTpls.some((ele) => ele.id === item.id)
          );
          console.log(this.tplList);
          // this.$service._2d.deleteInfoBoardTmp(this.tempId).then(() => {
          //   //this.updateTpls();
          //   this.$notifySuccess();
          // });
        }
      );
    },
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
      console.log(this.playObj)
      return {
        templateType: this.templateType,
        imgUrls: this.imgUrls,
      
        point: this.$refs.live.getAllPoint().point,
        // ...this.otherObj,
        ...this.playObj,
        ...this.textObj,
        templetId: "",
        resolutionPower: this.playObj.resolutionPower || "96*32",
      };
    },

    showingDeviceContent() {
      // 当前展示的设备内容
      if (!this.deviceList.length) return;
      return JSON.parse(this.deviceList[this.showingDeviceIdx].templateText);
    },
    isCheckAllDevice() {
      return this.selectedDevices.length === this.deviceList.length;
    },
    isCheckAllTpl() {
      return this.selectedTpls.length === this.tplList.length;
    },
    tempId() {
      return this.selectedTpls.map((v) => v.id).join(",");
    },
    deviceId() {
      return this.selectedDevices.map((v) => v.id).join(",");
    },
  },
};
</script>


<style>
.el-table td div {
  text-align: left;
}
</style>
<style scoped lang="less">
.board-show {
  width: 500px;
  height: 288px;
  background: rgba(12, 34, 83, 1);
  border-radius: 4px;
  margin-right: 20px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;

  .el-button {
    margin-left: 40px;
  }
}

.tpl-form {
  width: 505px;
  margin-right: 20px;
}

.tpl-item {
  color: #c1d9ff;
  cursor: pointer;
}

.device-item {
  cursor: pointer;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 6px;

  .num {
    width: 20px;
    height: 20px;
    background: rgba(41, 131, 253, 1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #fff;
    margin-right: 14px;
  }
}

.section {
  padding: 20px;
  background: rgba(18, 58, 132, 0.5);
  border-radius: 10px;
  margin-top: 20px;

  .title {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .sub {
      font-size: 14px;
      margin-left: 10px;
    }

    .label {
      font-size: 20px;
      font-weight: bold;
      color: rgba(83, 145, 243, 1);
      line-height: 16px;
    }

    .select {
      font-size: 16px;
      font-weight: 800;
      color: rgba(83, 145, 243, 1);
      margin-right: 13px;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-checkbox {
        padding: 0 12px;
      }
    }
  }
}
.content {
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-stop {
    flex: 1;
  }
  &-play {
    margin-left: 80px;
    flex: 1;
    &-select {
      margin-left: 12px;
    }
  }
}
.board-show {
  width: 500px;
  height: 288px;
  background: rgba(12, 34, 83, 1);
  border-radius: 4px;
  margin-right: 20px;
  color: #fbb827;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
