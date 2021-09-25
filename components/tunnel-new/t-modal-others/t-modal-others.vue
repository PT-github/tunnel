<template>
  <view class="t-modal-others">
    <view class="header">
      <text>{{ title }}</text>
      <text class="close" @tap="handleCancel">x</text>
    </view>
    <view class="device-area">
      <view class="device-name">
        {{ currentWorkModeName || deviceData.workModeName }}
      </view>
      <view class="status" :class="{on: deviceData.deviceCommunicationsState === 0}"></view>
      <view ref="pic" class="pic" :class="{rotate: deviceData.orientationLocation === 0}" :style="[getStyle(deviceData), changeBg]"></view>
    </view>

    <template v-if="classifyNumber === 'lighting'">
      <view class="light-options">
        <view class="slider-container">
          <t-slider ref="tSlider" :value="deviceData.brightNess" @change="handleSliderChange"></t-slider>
        </view>
        <view class="light-workMode">
          <!-- 照明的控制模式获取不对 -->
          <view class="sel-btn" :class="{ active: lightForm.workMode === 1 }" @click="handleLightWorkModeChecked(1)">
            开启
          </view>
          <view class="sel-btn" :class="{ active: lightForm.workMode === 0 }" @click="handleLightWorkModeChecked(0)">
            关闭
          </view>
        </view>
      </view>
    </template>

    <!-- 其他设备的控制模式 -->
    <template v-else-if="needRequestWorkMode.indexOf(classifyNumber) !== -1">
      <view class="light-options">
        <view class="light-workMode">
          <view class="sel-btn" :class="{ active: workModeChecked == item.value }" v-for="(item,index) in workMode"
            :key="'workMode-' + item.value" @click="handleWorkModeChecked(item.value)">
            {{ item.name }}
          </view>
        </view>
      </view>
    </template>

    <!-- 紧急电话信息 -->
    <template v-if="classifyNumber === 'urgentphone'">
      <view class="urgentphone-msg">
        <text>号码：{{ deviceConfig.PhoneNumber }}</text>
        <text>IP：{{ deviceData.deviceIP }}</text>
      </view>
    </template>

    <!-- 水泵信息 沟通后 不要展示 -->
    <!-- <template v-if="classifyNumber === 'waterlevel'">
      <view class="urgentphone-msg">
        <text>高位水池：不知道字段cm
        </text>
        <text>低位水池：不知道字段cm
        </text>
      </view>
    </template> -->


    <!-- 火灾报警信息 -->
    <!-- <template v-if="classifyNumber === 'conflagration'">
      <view class="urgentphone-msg">
        <text>CO：不知道字段bpms
        </text>
        <text>Vi：不知道字段bpms
        </text>
      </view>
    </template> -->

    <!-- 环境 -->
    <template v-if="classifyNumber === 'environment' && sensorValTextShow">
      <view class="urgentphone-msg">
        <text v-for="(item, index) in infoData" :key="'environment_' + index">{{ item.name }}：{{ item.value }}</text>
      </view>
    </template>

    <view class="submit-area">
      <text @tap="handleCancel">取消</text>
      <template v-if="hideSubmit.indexOf(classifyNumber) === -1">
        <text class="active" @click="handleSubmit">执行</text>
      </template>

    </view>
  </view>
</template>

<script>
  import config from '../../config/index.js'
  export default {
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
      uni.showLoading({
        title: '加载中'
      })

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
      uni.hideLoading()
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
        
        // let view = uni.createSelectorQuery().in(this).select(".pic")
        // view.fields({
        //   computedStyle: ['background-image', 'style']
        // }, data => {
        //   console.log("得到节点信息" + JSON.stringify(data));
        //   console.log("节点的宽为" + data.width);
        // }).exec()
        // this.$refs.pic.$el.style.backgroundImage = `url(${config.imagePrefix}/icon/${item.leftRightFlag}/${item.deviceTypeCode || this.deviceTypeCode}_${item.deviceCommunicationsState}${'_' + v}.png)`
      },
      // 照明亮度值
      handleSliderChange(v) {
        this.lightForm.currentBrightNess = v
      },
      lightingSubmit() {
        return this.$request.tCombinationschemeitemImplement({
          classifyNumber: this.classifyNumber,
          deviceId: this.deviceData.id,
          workMode: this.lightForm.workMode,
          lighteNess: this.lightForm.currentBrightNess
        }).then(res => {
          if (res && res.status === 1) {
            uni.showToast({
              icon: 'success',
              title: '执行成功'
            })
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
        return this.$request.trafficLightsImplement({
          classifyNumber: this.classifyNumber,
          deviceId: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res && res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-device', {
              classifyNumber: this.classifyNumber,
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      // 车道指示器执行
      laneIndicatorSubmit() {
        return this.$request.laneIndicatorImplementList([], {
          tunnelId: this.deviceData.tunnelId,
          classifyId: this.classifyId,
          deviceId: this.deviceData.id,
          deviceStatus: parseInt(this.workModeChecked),
          typeCode: this.classifyNumber,
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 信号灯执行
      signallampSubmit() {
        return this.$request.operateCommonDevice({
          classifyNumber: 'signallamp',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 信号灯执行
      conflagrationSubmit() {
        return this.$request.operateCommonDevice({
          classifyNumber: 'conflagration',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 水泵执行
      waterlevelSubmit() {
        return this.$request.operateCommonDevice({
          classifyNumber: 'waterlevel',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 风机执行
      draughtfanSubmit() {
        return this.$request.operateCommonDevice({
          classifyNumber: 'draughtfan',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      
      // 风机执行
      tunneldoorSubmit() {
        return this.$request.operateCommonDevice({
          classifyNumber: 'tunneldoor',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-device', {
              id: this.deviceData.id,
              workMode: parseInt(this.workModeChecked)
            })
          }
        })
      },
      // 发电机执行
      dynamotorSubmit() {
        return this.$request.operateCommonDevice({
          classifyNumber: 'dynamotor',
          deviceIds: this.deviceData.id,
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
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
        return this.$request.getDeviceClassifyControlInfo({
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
        uni.showLoading({
          title: '加载中'
        })
        // 
        let methodName = `${this.classifyNumber}Submit`
        if (!this[methodName]) {
          methodName = 'draughtfanSubmit'
        }
        await this[methodName]()
        uni.hideLoading()
        this.handleCancel()
      }
    }
  }
</script>

<style lang="scss">
  .t-modal-others {
    width: 171.875rpx;
    // height: 101.5625rpx;
    box-sizing: border-box;
    background: #0B0A30;
    border: 0.3906rpx solid #1D2388;
    display: flex;
    flex-direction: column;
    // padding-bottom: 11.7187rpx;

    .light-options {
      .slider-container {
        height: 21.875rpx;
        position: relative;
        width: 80%;
        margin: 0 auto;
      }

      .light-workMode {
        display: flex;
        margin: 3.9062rpx 0;
        justify-content: center;

        .sel-btn {
          height: 13.2812rpx;
          line-height: 13.2812rpx;
          background: url(../../static/modal/laneIndicator/unselected.png) left center / 5.4687rpx auto no-repeat;
          padding-left: 8.2031rpx;
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #286BC8;

          &+.sel-btn {
            margin-left: 6.25rpx; //3.5156rpx;
          }

          &.active {
            background-image: url(../../static/modal/laneIndicator/selected.png);
          }
        }
      }
    }

    .urgentphone-msg {
      padding: 0 0 6.25rpx;
      text-align: center;

      text {
        font-size: 5.4687rpx;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #5DA0FE;
        padding: 0 6.25rpx;
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
      width: 97.6562rpx; // 85.9375rpx;
      height: 78.125rpx; //46.875rpx;
      background: #120F41;
      border: 0.3906rpx solid #4E58ED;
      position: relative;
      display: flex;
      flex-direction: column;
      margin: 11.7187rpx auto;
      box-sizing: border-box;
    }

    .status {
      position: absolute;
      top: 0;
      right: 0;
      width: 17.5781rpx;
      height: 17.9687rpx;
      background: url(../../static/modal/laneIndicator/offline.png) center center / 17.5781rpx 17.9687rpx no-repeat;

      &.on {
        background-image: url(../../static/modal/laneIndicator/online.png);
      }
    }

    .device-name {
      font-size: 5.4687rpx;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #5DA0FE;
      padding: 3.9062rpx 5.0781rpx;
      flex: 1;
    }

    .submit-area {
      padding: 7.8125rpx 0;
      width: 100%;
      border-top: 0.3906rpx solid #1D2388;
      padding-right: 3.9062rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: center;

      text {
        width: 31.25rpx;
        height: 13.2812rpx;
        line-height: 13.2812rpx;
        text-align: center;
        background: #1B195A;
        font-size: 4.6875rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #286BC8;

        &.active {
          background: #3B46E2;
          color: #FFFFFF;
        }

        &+text {
          margin-left: 3.9062rpx;
        }
      }
    }

    .header {
      border-bottom: 0.3906rpx solid #1D2388;
      font-size: 6.25rpx;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #5DA0FE;
      background: url(../../static/modal/laneIndicator/dot.png) 7.4218rpx center / 7.0312rpx auto no-repeat;
      padding: 0 19.9218rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 21.875rpx;
      line-height: 21.875rpx;
      position: relative;

      .close {
        position: absolute;
        width: 12.8906rpx;
        height: 12.8906rpx;
        line-height: 12.8906rpx;
        text-align: center;
        background: #1B195A;
        color: #2B79E3;
        font-size: 8.5937rpx;
        right: 5.4687rpx;
        top: 4.2968rpx;
      }
    }
  }
</style>
