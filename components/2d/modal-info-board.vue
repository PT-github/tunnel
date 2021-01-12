<!-- 情报板弹窗 -->
<template>
  <div>
    <section class="section">
      <div class="title flex">
        <div class="label">
          <span class="sub">当前显示：情报板"{{showingDeviceIdx}}"的内容列表（点击情报板名称可以查看对应内容）</span>
        </div>

        <div class="select">
          <span>全选</span>
          <el-checkbox :value="isCheckAllDevice"
                       @change="toggleSelection('deviceTable',!isCheckAllDevice)"></el-checkbox>
        </div>
      </div>
      <div class="flex">
        <!--                <div class="board-show"></div>-->
        <!-- 情报板内容 -->
        <div style="min-width:400px; position: relative">
          <div class="board-show" :style="{
                    marginTop: `-${deviceInfo.height / 2}px`,
                    marginLeft: `-${deviceInfo.width / 2}px`,
                    width: `${deviceInfo.width}px`,
                    height: `${deviceInfo.height}px`}">
            <span v-for="(item, index) in deviceInfo.textArr" :key="index" :style="{
                    fontFamily: `${deviceInfo.fontName}`,
                    color: `${deviceInfo.color}`,
                    lineHeight:`${deviceInfo.fontSize}px`,
                     fontSize: `${deviceInfo.fontSize}px`
                }">
              {{item}}
            </span>
          </div>
        </div>


        <el-table :data="deviceList"
                  ref="deviceTable"
                  height="288px"
                  border
                  :show-header="false"
                  tooltip-effect="dark"
                  @selection-change="deviceSelectionChange">
          <el-table-column>
            <template slot-scope="scope">
              <div class="device-item" @click="getDeviceInfo(scope.row)">
                <!--              <div class="device-item" @click="showingDeviceIdx = scope.row.index">-->
                <div class="num">{{scope.row.index}}</div>
                <div class="flex1">
                  <div><span class="label">设备名称：</span>{{scope.row.deviceName}}</div>
                  <div><span class="label">设备桩号：</span>{{scope.row.pileNumberStr}}</div>
                </div>
                <span>{{scope.row.deviceCommunicationsState === 0 ? '正常' : '异常'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="selection" :width="50*$px2rem"></el-table-column>
        </el-table>
      </div>
    </section>

    <section class="section">
      <div class="title flex">
        <div class="label">情报板模板列表</div>
        <div class="select">
          <span>全选</span>
          <el-checkbox :value="isCheckAllTpl"
                       @change="toggleSelection('tplTable',!isCheckAllTpl)"></el-checkbox>
        </div>
      </div>
      <div class="flex">
        <el-form class="tpl-form" ref="tplForm" v-model="tplForm" :label-width="84*$px2rem+'px'">
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
        </el-form>
        <el-table :data="tplList"
                  ref="tplTable"
                  border
                  height="250px"
                  :show-header="false"
                  tooltip-effect="dark"
                  @selection-change="tplSelectionChange">
          <el-table-column>
            <template slot-scope="scope">
              <div class="tpl-item" @click="showTpl(scope.row)">
                {{scope.row.index}}、{{scope.row.templetName}}
              </div>
            </template>
          </el-table-column>
          <el-table-column type="selection" :width="50"></el-table-column>
        </el-table>
      </div>
    </section>
    <div class="buttons">
      <el-button type="primary" @click="doOperateForm">执行</el-button>
      <el-button type="primary" @click="doSave">另存为模板</el-button>
      <el-button type="primary" @click="doDelete">删除已选模板</el-button>
      <el-button type="primary" @click="doOperate">执行已选择模板</el-button>
    </div>
  </div>
</template>

<script>
export default {
  services: ['_2d'],
  props: {
    tunnelId: String
  },
  data() {
    return {
      showingDeviceIdx: 1,
      deviceList: [],
      infoBoard: null,
      tplList: [],
      tplForm: {
        point: {}
      },
      selectedDevices: [],
      selectedTpls: [],
      deviceInfo: {}
    };
  },
  mounted() {
    this.updateDevices();
    this.updateTpls();
  },
  methods: {
    getDeviceInfo(row) {
      this.showingDeviceIdx = row.deviceName

      this.getBoardDeviceInfo(row)
    },

    // 情报板内容
    getBoardDeviceInfo(row) {
      this.deviceInfo = {}
       this.$service._2d.getInfoBoardFromDevice(row.id).then(res => {
         try {
          //debugger
          // const test = JSON.parse("{\"data\":{\"fontName\":\"宋体\",\"backgroundColor\":null,\"emergeFlag\":0,\"emergeSpeed\":0,\"spacing\":0,\"color\":\"#FFFF00\",\"templet\":\"\\\\fs2424\\\\c255255000000桥梁\\\\n压道\",\"fontSize\":24,\"interval\":1,\"text\":\"隧道严禁\\\\n变更车道\",\"point\":null}}")
          // const boardInfo = test.data
          const boardInfo = res.data
          console.log('boardInfo',boardInfo)
          const arr = []
          const arrText = boardInfo.text.split("\\n")
          for (let i = 0; i < arrText.length; i++) {
            arr.push(arrText[i])
          }

          boardInfo.textArr = arr
          if(row.reamrks && row.reamrks.split("*")[0]){
            boardInfo.width = row.reamrks.split("*")[0]
          }
          if(row.reamrks && row.reamrks.split("*")[1]){
            boardInfo.height = row.reamrks.split("*")[1]
          }
          this.deviceInfo = boardInfo
         } catch (e) {
           console.log(e)
         }
       })
    },


    toggleSelection(form, selectAll) { // 切换全选
      if (selectAll) {
        this.$refs[form].toggleAllSelection();
      } else {
        this.$refs[form].clearSelection();
      }
    },
    updateDevices() {  // 更新设备
      this.$service._2d.getTunnelDeviceTypeList(this.tunnelId, 'intelligenceboard').then(res => {
        this.deviceList = res.map((v, i) => {
          return {index: i + 1, ...v};
        });

        if (this.deviceList.length>0) this.getBoardDeviceInfo(this.deviceList[0])
      });
    },
    updateTpls() {  // 更新模板
      this.$service._2d.getInfoBoardTmpList(this.tunnelId).then(res => {
        this.tplList = res.map((v, i) => {
          return {index: i + 1, ...v};
        });
      });
    },
    showTpl(tpl) { // 点击模板填上表单内容
      this.tplForm = JSON.parse(tpl.templetText);
    },
    deviceSelectionChange(e) {
      this.selectedDevices = e;
    },
    tplSelectionChange(e) {
      this.selectedTpls = e;
    },
    doOperate() {  // 执行模板
      //请确认是否删选择的模板信息，删除后不能恢复！
      if (!this.deviceId) {
        return this.$message('请选择设备');
      }
      if (!this.tempId) {
        return this.$message('请选择模板');
      }
      this.$service._2d.operateInfoBoardByTmp(this.deviceId, this.tempId).then(() => {
        this.updateDevices();
        this.$notifySuccess();
      });
    },
    doSave() {  // 保存模板
      this.$service._2d.saveInfoBoardTmp(this.tplForm).then(() => {
        this.updateTpls();
        this.$notifySuccess();
      });
    },
    doOperateForm() {  // 直接执行模板
      if (!this.deviceId) {
        return this.$message('请选择设备');
      }
      this.$service._2d.operateInfoBoard({
        deviceId: this.deviceId,
        ...this.tplForm,
        point: JSON.stringify(this.tplForm.point)
      }).then(() => {
        this.updateDevices();
        this.$notifySuccess();
      });
    },
    doDelete() {  // 删除模板
      if (!this.tempId) {
        return this.$message('请选择模板');
      }
      this.$showConfirm('请确认是否删选择的模板信息，删除后不能恢复！').then(() => {
        this.$service._2d.deleteInfoBoardTmp(this.tempId).then(() => {
          this.updateTpls();
          this.$notifySuccess();
        });
      });
    }
  },
  computed: {
    showingDeviceContent() { // 当前展示的设备内容
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
      return this.selectedTpls.map(v => v.id).join(',');
    },
    deviceId() {
      return this.selectedDevices.map(v => v.id).join(',');
    }
  }
};
</script>


<style>
.el-table td div {
  text-align: left;
}
</style>
<style scoped lang="less">
.board-show {
  margin-top:-16px;
  margin-left:-16px;
  width: 32px;
  height: 32px;
  background: rgba(12, 34, 83, 1);
  border-radius: 4px;
  margin-right: 20px;
  top:50%;
  left:50%;
  position: relative;
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
  color: #C1D9FF;
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
  background: rgba(18, 58, 132, .5);
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


.board-show {
  background: rgba(12, 34, 83, 1);
  border-radius: 4px;
  margin-right: 20px;
  color: #FBB827;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
