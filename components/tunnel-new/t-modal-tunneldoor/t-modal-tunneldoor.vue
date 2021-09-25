<!-- 横洞卷闸门 -->
<template>
  <view class="t-modal-tunneldoor">
    <view class="header">
      <text>手动模式-横洞卷闸门</text>
    </view>

    <view class="signallamp-content">
      <view class="search-container">
        <text :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)"
          v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</text>
        <text :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)"
          v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</text>
        <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
        <view class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 9.7656rpx;"
          @click="handleAllSelect(1)">
          全选
        </view>
        <view class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
          反选
        </view>
      </view>

      <scroll-view :show-scrollbar="true" class="scroll-container" scroll-y="true">
        <view class="scroll-content">
          <view class="device-item" v-for="item in deviceList" :key="item.id"
            :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
            <view class="device-title" :style="getStyle(item)">
              <text>{{ item.workModeName }}</text>
              <view class="sensorValTextShow" v-if="item.sensorValTextShow">
                <text>{{ item.sensorValTextList }}</text>
              </view>
            </view>
            <view class="device-info">
              <text>{{ item.deviceName}}</text>
              <text>{{item.pileNumberStr}}</text>
            </view>
            <view class="status" :class="{on: item.deviceCommunicationsState === 0}"></view>
          </view>
          <view class="no-data" v-if="!deviceList.length">
            <image src="../../static/no-data.png" mode="widthFix"></image>
            <text>暂无数据</text>
          </view>
        </view>
      </scroll-view>

      <view class="control-container">
        <view class="check-item" v-for="item in workMode" :key="item.value" @click="workModeChecked = item.value">
          <view class="checkbox" :class="{ active: workModeChecked === item.value }"></view>
          <view class="check-value">
            <text>{{ item.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="operation">
      <text class="cancel" @click="handleCancel">取消</text>
      <text class="start" @click="handleSubmit">执行</text>
    </view>
  </view>
</template>

<script>
  import config from '../../config/index.js'
  export default {
    name: "t-modal-tunneldoor",
    props: {
      tunnelId: {
        type: [String, Object]
      },
      tunnelInfoData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      classifyId: String
    },
    data() {
      return {
        config,
        checkedAll: null, // 全选1/反选0
        form: {
          leftRightFlag: null, // 左右洞标识
          deviceName: null, // 设备名称或桩号
          tunnelId: null, // 隧道ID
          classifyNumber: 'tunneldoor' // 分类
        },
        deviceList: [],
        checkedList: [], // 已选设备列表
        workMode: [], // 控制模式
        workModeChecked: null, // 已选控制模式
        deviceTypeCode: 'tunneldoor'
      };
    },
    computed: {
      // 隧道单双洞
      singleDoubleType() {
        return this.tunnelInfoData.singleDoubleType
      },
      // 过滤条件 左/右洞
      leftRightFlag() {
        return this.form.leftRightFlag
      },
    },
    created() {
      this.form.tunnelId = this.tunnelId
      this.getDeviceList()
      this.getDeviceClassifyControlInfo()
    },
    methods: {
      handleSliderChange(v, item) {
        console.log(v, item, '====')
      },
      // 执行
      handleSubmit() {
        if (this.checkedList.length === 0) {
          return uni.showToast({
            icon: 'none',
            title: '请选择设备'
          })
        }
        if (!this.workModeChecked) {
          return uni.showToast({
            icon: 'none',
            title: '请选择控制模式'
          })
        }
        this.$request.operateCommonDevice({
          classifyNumber: 'tunneldoor',
          deviceIds: this.checkedList.join(','),
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.$emit('update-devices', this.checkedList.map(id => {
              return {
                id,
                workMode: parseInt(this.workModeChecked)
              }
            }))
            this.handleCancel()
          }
        })
      },
      // 全选/反选
      handleAllSelect(code) {
        if (this.checkedAll === code) {
          this.checkedAll = null
          switch (code) {
            case 1:
              // 全选
              this.checkedList.splice(0, this.checkedList.length)
              break;
            case 0:
              // 反选
              this.deviceList.forEach(item => {
                let idx = this.checkedList.indexOf(item.id)
                idx === -1 ? this.checkedList.push(item.id) : this.checkedList.splice(idx, 1)
              })
              break;
          }
        } else {
          this.checkedAll = code
          switch (code) {
            case 1:
              // 全选
              this.deviceList.forEach(item => {
                this.checkedList.indexOf(item.id) === -1 && this.checkedList.push(item.id)
              })
              break;
            case 0:
              // 反选
              this.deviceList.forEach(item => {
                let idx = this.checkedList.indexOf(item.id)
                idx === -1 ? this.checkedList.push(item.id) : this.checkedList.splice(idx, 1)
              })
              break;
          }
        }
      },
      // 设备选择
      handleSelect(item) {
        let idx = this.checkedList.indexOf(item.id)
        if (idx === -1) {
          this.checkedList.push(item.id)
        } else {
          this.checkedList.splice(idx, 1)
        }
      },
      // 左右洞切换
      switchLeftRight(f) {
        if (this.form.leftRightFlag === f) {
          this.form.leftRightFlag = null
        } else {
          this.form.leftRightFlag = f
        }
        this.getDeviceList()
      },
      // 获取设备列表
      getDeviceList() {
        this.checkedAll = null
        this.deviceList.splice(0, this.deviceList.length)
        this.checkedList.splice(0, this.checkedList.length) // 清空已选的设备
        this.$request.getSelectDeviceList(this.form).then(res => {
          if (res && res.data) {
            this.deviceList.push(...res.data.map(item => {
              if (item.sensorValTextShow) {
                try{
                  let arry = [], sensorValTextShow = JSON.parse(item.sensorValTextShow)
                  for (let props in sensorValTextShow) {
                    // arry.push({ name: props, value: sensorValTextShow[props] })
                    arry.push(`${props}:${sensorValTextShow[props]}`)
                  }
                  item.sensorValTextList = arry.join(' ')
                }catch(e){
                  //TODO handle the exception
                  console.log('设备解析sensorValTextShow字段报错')
                }
              }
              return item
            }))
          }
        })
      },
      // 控制模式
      getDeviceClassifyControlInfo() {
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
      }
    }
  }
</script>

<style lang="scss">
  .t-modal-tunneldoor {
    width: 340.2343rpx;
    height: 237.5rpx;
    background: url(../../static/modal/laneIndicator/bg.png) center center / 100% 100% no-repeat;
    display: flex;
    flex-direction: column;
    padding: 5.4687rpx 12.5rpx 2.7343rpx;

    .header {
      width: 108.2031rpx;
      height: 17.1875rpx;
      line-height: 17.1875rpx;
      text-align: center;
      background: url(../../static/modal/laneIndicator/top-bg.png) center center / 100% 100% no-repeat;
      font-size: 7.0312rpx;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #FFFFFF;
      margin: 0 auto;
    }

    .signallamp-content {
      width: 313.6718rpx;
      margin: 10.1562rpx auto;
      height: 168.3593rpx;
      background: #0B0A30;
      border: 1px solid #1D2388;
      margin-bottom: 10.5468rpx;
      padding: 7.4218rpx 8.9843rpx 6.6406rpx;
      display: flex;
      flex-direction: column;
    }

    .search-container {
      height: 13.2812rpx;
      display: flex;
      align-items: center;

      text {
        display: inline-block;
        height: 13.2812rpx;
        line-height: 13.2812rpx;
        width: 31.25rpx;
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

      input {
        width: 138.2812rpx;
        height: 13.2812rpx;
        background: #120F41 url(../../static/modal/laneIndicator/sousuo.png) 125.3906rpx center / 7.8125rpx auto no-repeat;
        border: 1px solid #4E58ED;
        display: inline-block;
        font-size: 4.6875rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
        padding: 0 12.8906rpx 0 6.25rpx;
        box-sizing: border-box;

        &.input-dom {
          margin-left: 5.0781rpx;
        }
      }

      .mul-select {
        width: 138.2812rpx;
        height: 13.2812rpx;
        background: #120F41;
        border: 0.3906rpx solid #4E58ED;
        box-sizing: border-box;
        margin-right: 3.9062rpx;
      }

      .sel-btn {
        height: 13.2812rpx;
        line-height: 13.2812rpx;
        background: url(../../static/modal/laneIndicator/unselected.png) left center / 5.4687rpx auto no-repeat;
        padding-left: 8.2031rpx;
        font-size: 4.6875rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #286BC8;
        margin-left: 3.5156rpx;

        &:first-of-type {}

        &.active {
          background-image: url(../../static/modal/laneIndicator/selected.png);
        }
      }
    }

    .scroll-container {
      height: 132.8125rpx;
      // flex: 1;
      margin: 8.2031rpx 0;

      .scroll-content {
        display: flex;
        flex-wrap: wrap;

        .device-item {
          width: 69.5312rpx;
          height: 62.1093rpx;
          background: #120F41;
          border: 0.3906rpx solid #4E58ED;
          position: relative;
          display: flex;
          flex-direction: column;
          margin-bottom: 5.8593rpx;

          &.active {
            border-color: #e7743a;
          }

          &:not(:nth-child(4n)) {
            margin-right: 7.0312rpx; //9.7656rpx; //10.9375rpx;
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

          .device-title {
            flex: 1;
            font-size: 5.4687rpx;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #5DA0FE;
            padding: 3.9062rpx 5.0781rpx;
          }

          .device-info {
            height: 15.625rpx;
            line-height: 7.8125rpx;
            background: #262477;
            font-size: 4.6875rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5DA0FE;
            text-align: center;
            width: 67.1875rpx;
            margin: 0 auto 1.1718rpx;

            text {
              display: block;
            }
          }
        }
      }
    }

    .control-container {
      display: flex;

      .check-item {
        display: flex;
        align-items: center;

        &+.check-item {
          margin-left: 6.6406rpx;
        }

        .checkbox {
          background: url(../../static/modal/laneIndicator/unselected.png) center center / 5.4687rpx auto no-repeat;
          width: 5.4687rpx;
          height: 5.4687rpx;
          margin-right: 3.125rpx;

          &.active {
            background-image: url(../../static/modal/laneIndicator/selected.png);
          }
        }

        .check-value {
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #286BC8;
          // display: flex;
          // flex-direction: column;
          // text-align: center;
          // image {
          //   width: 21.875rpx;
          // }
          // text {
          //   font-size: 4.6875rpx;
          //   font-family: Microsoft YaHei;
          //   font-weight: 400;
          //   color: #286BC8;
          // }
        }
      }
    }

    .operation {
      height: 13.2812rpx;
      text-align: center;

      text {
        display: inline-block;
        width: 31.25rpx;
        height: 13.2812rpx;
        line-height: 13.2812rpx;
        text-align: center;
        font-size: 4.6875rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
      }

      .cancel {
        background: #1B195A;
        color: #286BC8;
        margin-right: 3.5156rpx;
      }

      .start {
        background: #3B46E2;
      }
    }
  }
</style>
