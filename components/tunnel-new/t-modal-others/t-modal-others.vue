<template>
  <div class="t-modal-others">
    <div class="header">
      <span>{{ title }}</span>
      <span class="close" @click="handleCancel">x</span>
    </div>
    <div class="device-area">
      <div class="device-name">
        {{ currentWorkModeName || deviceData.workModeName }}
      </div>
      <div class="status" :class="{on: deviceData.deviceCommunicationsState === 0}"></div>
      <div ref="pic" class="pic" :class="{rotate: deviceData.orientationLocation === 0}" :style="[getStyle(deviceData), changeBg]"></div>
    </div>

    <template v-if="classifyNumber === 'lighting'">
      <div class="light-options">
        <div class="slider-container">
          <t-slider ref="tSlider" :value="deviceData.brightNess" @change="handleSliderChange"></t-slider>
        </div>
        <div class="light-workMode">
          <!-- 照明的控制模式获取不对 -->
          <div class="sel-btn" :class="{ active: lightForm.workMode === 1 }" @click="handleLightWorkModeChecked(1)">
            开启
          </div>
          <div class="sel-btn" :class="{ active: lightForm.workMode === 0 }" @click="handleLightWorkModeChecked(0)">
            关闭
          </div>
        </div>
      </div>
    </template>

    <!-- 其他设备的控制模式 -->
    <template v-else-if="needRequestWorkMode.indexOf(classifyNumber) !== -1">
      <div class="light-options">
        <div class="light-workMode">
          <div class="sel-btn" :class="{ active: workModeChecked == item.value }" v-for="(item,index) in workMode"
            :key="'workMode-' + item.value" @click="handleWorkModeChecked(item.value)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </template>

    <!-- 紧急电话信息 -->
    <template v-if="classifyNumber === 'urgentphone'">
      <div class="urgentphone-msg">
        <span>号码：{{ deviceConfig.PhoneNumber }}</span>
        <span>IP：{{ deviceData.deviceIP }}</span>
      </div>
    </template>

    <!-- 水泵信息 沟通后 不要展示 -->
    <!-- <template v-if="classifyNumber === 'waterlevel'">
      <div class="urgentphone-msg">
        <span>高位水池：不知道字段cm
        </span>
        <span>低位水池：不知道字段cm
        </span>
      </div>
    </template> -->


    <!-- 火灾报警信息 -->
    <!-- <template v-if="classifyNumber === 'conflagration'">
      <div class="urgentphone-msg">
        <span>CO：不知道字段bpms
        </span>
        <span>Vi：不知道字段bpms
        </span>
      </div>
    </template> -->

    <!-- 环境 -->
    <template v-if="classifyNumber === 'environment' && sensorValTextShow">
      <div class="urgentphone-msg">
        <span v-for="(item, index) in infoData" :key="'environment_' + index">{{ item.name }}：{{ item.value }}</span>
      </div>
    </template>

    <div class="submit-area">
      <span @click="handleCancel">取消</span>
      <template v-if="hideSubmit.indexOf(classifyNumber) === -1">
        <span class="active" @click="handleSubmit">执行</span>
      </template>

    </div>
  </div>
</template>

<script>
  import * as config from '@/utils/constant'
  import tSlider from '../t-slider/t-slider.vue'
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name: "t-modal-others",
    props: {
      title: String,
      classifyNumber: String,
      deviceData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      classifyId: String
    },
    data() {
      return {
        currentWorkModeName: null, // 当前状态名称
        changeBg: {},
        deviceTypeCode: null, // 设备分类 兼容之前的代码 getStyle要用

        workMode: [], // 控制模式
        workModeChecked: null, // 已选控制模式
        // 需要显示控制模式的类别
        needRequestWorkMode: ['dynamotor', 'tunneldoor','conflagration','draughtfan', 'laneIndicator', 'signallamp', 'waterlevel'],
        hideSubmit: ['urgentphone', 'environment', 'video'], // 需要隐藏执行按钮的分类
        deviceConfig: {},

        // 照明灯变量
        lightForm: {
          currentBrightNess: 0,
          workMode: 1 // 1 开启；0 关闭
        },


      };
    },
    computed: {
      workModeFormat () {
        let obj = {}
        this.workMode.forEach(item => {
          obj[item.value] = item.name
        })
        return obj
      },
      sensorValTextShow() {
        return this.deviceData.sensorValTextShow
      },
      infoData() {
        let arry = []
        if (this.sensorValTextShow) {
          try {
            let sensorValTextShow = JSON.parse(this.sensorValTextShow)
            for (let props in sensorValTextShow) {
              arry.push({
                name: props,
                value: sensorValTextShow[props]
              })
            }
          } catch (e) {
            //TODO handle the exception
          }
        }
        return arry
      }
    },
    async created() {
      this.$ctx.showLoading('加载中...');

      this.deviceTypeCode = this.classifyNumber

      this.lightForm.currentBrightNess = this.deviceData.brightNess
      this.lightForm.workMode = this.deviceData.workMode

      if (this.needRequestWorkMode.indexOf(this.classifyNumber) !== -1) {
        await this.getDeviceClassifyControlInfo()
        this.workModeChecked = this.deviceData.workMode
      }

      if (this.deviceData.deviceConfig) {
        try {
          this.$set(this, 'deviceConfig', JSON.parse(this.deviceData.deviceConfig))
        } catch (e) {
          //TODO handle the exception
        }
      }
      this.$ctx.hideLoading()
    },
    methods: {
      handleLightWorkModeChecked (v) {
        this.lightForm.workMode = v
        this.currentWorkModeName = this.workModeFormat[v]
        // 设置图片
        let item = this.deviceData
        // this.$refs.pic.$el.style.backgroundImage = `url(${config.imagePrefix}/icon/${item.leftRightFlag}/${item.deviceTypeCode || this.deviceTypeCode}_${item.deviceCommunicationsState}${'_' + v}.png)`
        this.$set(this, 'changeBg', {
          backgroundImage: `url(${config.imagePrefix}/icon/${item.leftRightFlag}/${item.deviceTypeCode || this.deviceTypeCode}_${item.deviceCommunicationsState}${'_' + v}.png)`
        })
      },
      handleWorkModeChecked (v) {
        this.workModeChecked = v
        this.currentWorkModeName = this.workModeFormat[v]
        // 设置图片
        let item = this.deviceData
        
        this.$set(this, 'changeBg', {
          backgroundImage: `url(${config.imagePrefix}/icon/${item.leftRightFlag}/${item.deviceTypeCode || this.deviceTypeCode}_${item.deviceCommunicationsState}${'_' + v}.png)`
        })
        
      },
      // 照明亮度值
      handleSliderChange(v) {
        this.lightForm.currentBrightNess = v
      },
      lightingSubmit() {
        return this.$service.tunnel_2d.tCombinationschemeitemImplement({
          classifyNumber: this.classifyNumber,
          deviceId: this.deviceData.id,
          workMode: this.lightForm.workMode,
          lighteNess: this.lightForm.currentBrightNess
        }).then(res => {
          if (res && res.status === 1) {
            this.$notifySuccess('执行成功')
            this.handleCancel()
            this.$emit('update-device', {
              classifyNumber: this.classifyNumber,
              id: this.deviceData.id,
              workMode: this.lightForm.workMode,
              brightNess: this.lightForm.currentBrightNess
            })
          }
        })
      },

      // 风机-交通信号灯 执行
      draughtfanSubmit() {
        return this.$service.tunnel_2d.trafficLightsImplement({
          classifyNumber: this.classifyNumber,
          deviceId: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res && res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              classifyNumber: this.classifyNumber,
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        }).catch(() => {

        })
      },
      // 车道指示器执行
      laneIndicatorSubmit() {
        return this.$service.tunnel_2d.laneIndicatorImplementList([], {
          tunnelId: this.deviceData.tunnelId,
          classifyId: this.classifyId,
          deviceId: this.deviceData.id,
          deviceStatus: parseInt(this.workModeChecked),
          typeCode: this.classifyNumber,
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 信号灯执行
      signallampSubmit() {
        return this.$service.tunnel_2d.operateCommonDevice({
          classifyNumber: 'signallamp',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 信号灯执行
      conflagrationSubmit() {
        return this.$service.tunnel_2d.operateCommonDevice({
          classifyNumber: 'conflagration',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 水泵执行
      waterlevelSubmit() {
        return this.$service.tunnel_2d.operateCommonDevice({
          classifyNumber: 'waterlevel',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 风机执行
      draughtfanSubmit() {
        return this.$service.tunnel_2d.operateCommonDevice({
          classifyNumber: 'draughtfan',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 风机执行
      tunneldoorSubmit() {
        return this.$service.tunnel_2d.operateCommonDevice({
          classifyNumber: 'tunneldoor',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      // 发电机执行
      dynamotorSubmit() {
        return this.$service.tunnel_2d.operateCommonDevice({
          classifyNumber: 'dynamotor',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('执行成功')
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },

      // 控制模式
      getDeviceClassifyControlInfo() {
        this.workMode.splice(0, this.workMode.length)
        return this.$service.tunnel_2d.getDeviceClassifyControlInfo({
          Id: this.classifyId
        }).then(res => {
          if (res && res.data) {
            // let res = {data: '{"绿灯":"0","红灯":"1","黄灯":"2","左转":"3"}'}
            try {
              // {"绿灯":"0","红灯":"1","黄灯":"2","左转":"3"}
              let obj = JSON.parse(res.data)
              for (let prop in obj) {
                this.workMode.push({
                  name: prop,
                  value: obj[prop]
                })
              }
            } catch (e) {
              //TODO handle the exception
            }
          }
        })
      },
      handleCancel() {
        this.$emit('close')
      },
      async handleSubmit() {
        this.$ctx.showLoading('加载中...');
        // 
        let methodName = `${this.classifyNumber}Submit`
        if (!this[methodName]) {
          methodName = 'draughtfanSubmit'
        }
        try {
          await this[methodName]()
        } catch (error) {
          this.$ctx.hideLoading()
        } finally {
          this.$ctx.hideLoading()
        }
        this.handleCancel()
      }
    },
    components: {
      tSlider
    }
  }
</script>

<style lang="scss">
  .t-modal-others {
  width: 440px;
  // height: 260px;
  box-sizing: border-box;
  background: #0B0A30;
  border: 1px solid #1D2388;
  display: flex;
  flex-direction: column;
  // padding-bottom: 30px;

  .light-options {
    .slider-container {
      height: 56px;
      position: relative;
      width: 80%;
      margin: 0 auto;
    }

    .light-workMode {
      display: flex;
      margin: 10px 0;
      justify-content: center;

      .sel-btn {
        height: 34px;
        line-height: 34px;
        background: url(../../../assets/tunnel/modal/laneIndicator/unselected.png) left center / 14px auto no-repeat;
        padding-left: 21px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #286BC8;

        &+.sel-btn {
          margin-left: 16px; //9px;
        }

        &.active {
          background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
        }
      }
    }
  }

  .urgentphone-msg {
    padding: 0 0 16px;
    text-align: center;

    span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #5DA0FE;
      padding: 0 16px;
    }
  }

  .pic {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    flex: 1;
    background-repeat: no-repeat;

    // background-position: center center !important;
    &.rotate {
      transform: rotate(180deg);
    }
  }

  .device-area {
    width: 250px; // 220px;
    height: 200px; //120px;
    background: #120F41;
    border: 1px solid #4E58ED;
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 30px auto;
    box-sizing: border-box;
  }

  .status {
    position: absolute;
    top: 0;
    right: 0;
    width: 45px;
    height: 46px;
    background: url(../../../assets/tunnel/modal/laneIndicator/offline.png) center center / 45px 46px no-repeat;

    &.on {
      background-image: url(../../../assets/tunnel/modal/laneIndicator/online.png);
    }
  }

  .device-name {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #5DA0FE;
    padding: 10px 13px;
    flex: 1;
  }

  .submit-area {
    padding: 20px 0;
    width: 100%;
    border-top: 1px solid #1D2388;
    padding-right: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;

    span {
      width: 80px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      background: #1B195A;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #286BC8;

      &.active {
        background: #3B46E2;
        color: #FFFFFF;
      }

      &+span {
        margin-left: 10px;
      }
    }
  }

  .header {
    border-bottom: 1px solid #1D2388;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #5DA0FE;
    background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) 19px center / 18px auto no-repeat;
    padding: 0 51px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 56px;
    line-height: 56px;
    position: relative;

    .close {
      position: absolute;
      width: 33px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      background: #1B195A;
      color: #2B79E3;
      font-size: 22px;
      right: 14px;
      top: 11px;
    }
  }
}
</style>
