<template>
  <view class="t-modal-laneIndicator">
    <view class="header">
      <text>手动模式-车道指示器</text>
    </view>
    <!-- 左线超车道 1;右线超车道 2;左线行车道 3;右线行车道 4;左线慢车道 5;右线慢车道 6 -->
    <view class="group">
      <view class="group-item" :class="{'group-item-hide': singleDoubleType === 1}">
        <view class="check-group-item" v-if="laneIndicatorDataFormat['1']">
          <view class="check-label">
            <text>{{ laneIndicatorDataFormat['1']['name'] }}</text>
          </view>
          <view class="check-list">
            <view class="check-item" v-for="item in laneIndicatorDataFormat['1'].deviceCurrentStatusList" :key="'1_' + item.deviceStatus" @click="handleChecked(1, item)">
              <view class="checkbox" :class="{ active: checkedObj['1'] === item.deviceStatus }"></view>
              <view class="check-value">
                <image :src="require(`../../static/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix"></image>
                <text>{{ item.deviceName }}</text>
              </view>
            </view>
          </view>
        </view>
        
        
        <view class="check-group-item" v-if="laneIndicatorDataFormat['3']">
          <view class="check-label">
            <text>{{ laneIndicatorDataFormat['3'].name }}</text>
          </view>
          <view class="check-list">
            <view class="check-item" v-for="item in laneIndicatorDataFormat['3'].deviceCurrentStatusList" :key="'3_' + item.deviceStatus" @click="handleChecked(3, item)">
              <view class="checkbox" :class="{ active: checkedObj['3'] === item.deviceStatus }"></view>
              <view class="check-value">
                <image :src="require(`../../static/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix"></image>
                <text>{{ item.deviceName }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="check-group-item"  v-if="laneIndicatorDataFormat['5']">
          <view class="check-label">
            <text>{{ laneIndicatorDataFormat['3'].name }}</text>
          </view>
          <view class="check-list">
            <view class="check-item" v-for="item in laneIndicatorDataFormat['5'].deviceCurrentStatusList" :key="'5_' + item.deviceStatus" @click="handleChecked(5, item)">
              <view class="checkbox" :class="{ active: checkedObj['5'] === item.deviceStatus }"></view>
              <view class="check-value">
                <image :src="require(`../../static/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix"></image>
                <text>{{ item.deviceName }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="group-item" :class="{'group-item-hide': singleDoubleType === 2}">
        <view class="check-group-item" v-if="laneIndicatorDataFormat['2']">
          <view class="check-label">
            <text>{{ laneIndicatorDataFormat['2'].name }}</text>
          </view>
          <view class="check-list">
            <view class="check-item" v-for="item in laneIndicatorDataFormat['2'].deviceCurrentStatusList" :key="'2_' + item.deviceStatus" @click="handleChecked(2, item)">
              <view class="checkbox" :class="{ active: checkedObj['2'] === item.deviceStatus }"></view>
              <view class="check-value">
                <image :src="require(`../../static/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix"></image>
                <text>{{ item.deviceName }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="check-group-item" v-if="laneIndicatorDataFormat['4']">
          <view class="check-label">
            <text>{{laneIndicatorDataFormat['4'].name}}</text>
          </view>
          <view class="check-list">
            <view class="check-item" v-for="item in laneIndicatorDataFormat['4'].deviceCurrentStatusList" :key="'4_' + item.deviceStatus" @click="handleChecked(4, item)">
              <view class="checkbox" :class="{ active: checkedObj['4'] === item.deviceStatus }"></view>
              <view class="check-value">
                <image :src="require(`../../static/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix"></image>
                <text>{{ item.deviceName }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="check-group-item" v-if="laneIndicatorDataFormat['6']">
          <view class="check-label">
            <text>{{laneIndicatorDataFormat['6'].name}}</text>
          </view>
          <view class="check-list">
            <view class="check-item" v-for="item in laneIndicatorDataFormat['6'].deviceCurrentStatusList" :key="'6_' + item.deviceStatus" @click="handleChecked(6, item)">
              <view class="checkbox" :class="{ active: checkedObj['6'] === item.deviceStatus }"></view>
              <view class="check-value">
                <image :src="require(`../../static/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix"></image>
                <text>{{ item.deviceName }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="custom-area">
      <view class="title">
        <text>自定义组合区域</text>
      </view>
      
      <view class="search-container">
        <text :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)" v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</text>
        <text :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)" v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</text>
        <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
      </view>
      
      <view class="search-container">
        <!-- <yealuo-select
          class="mul-select"
          value=""
          placeholder='可多选 车道指示器组合进行筛选'
          :binData="binData"
          checkType="checkbox"
          overflow="hide"
          @getBackVal="getBackVal"
          :selectIco="true"
          >
        </yealuo-select> -->
        <text :class="{ active: form.vehicleLane === 1 }" @click="switchVehicleLane(1)">超车道</text>
        <text :class="{ active: form.vehicleLane === 2 }" @click="switchVehicleLane(2)">行车道</text>
        <text :class="{ active: form.vehicleLane === 3 }" @click="switchVehicleLane(3)">慢车道</text>
        
        <view class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 9.7656rpx;" @click="handleAllSelect(1)">
          全选
        </view>
        <view class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
          反选
        </view>
      </view>
      
      <scroll-view :show-scrollbar="true" class="scroll-container" scroll-y="true" >
        <view class="scroll-content">
          <view class="device-item" v-for="(item, index) in deviceList" :key="item.id + '_' + index" :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
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
        <view class="check-item" v-for="(item, index) in workMode" :key="item.value + '_workMode_' + item" @click="workModeChecked = item.value">
          <view class="checkbox" :class="{ active: workModeChecked === item.value }"></view>
          <view class="check-value">
            <image :src="require(`../../static/modal/laneIndicator/icon${item.value}.png`)" mode="widthFix"></image>
            <text>{{ item.name }}</text>
          </view>
        </view>
      </view>
      
    </view>
    
    <view class="operation">
      <text class="cancel" @tap="handleCancel">取消</text>
      <text class="start" @click="laneIndicatorImplementList">执行</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"t-modal-laneIndicator",
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
        deviceTypeCode: 'laneIndicator',
        binData: [{id:1,value:'选项1'},{id:2,value:'选项2'}],
        selectValue: [],
        
        // 车道指示器数据
        laneIndicatorData: [],
        
        // 指示器选中 左线超车道 1;右线超车道 2;左线行车道 3;右线行车道 4;左线慢车道 5;右线慢车道 6
        checkedObj: {
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null,
        },
        
        form: {
          vehicleLane: null, // 车道
          leftRightFlag: null, // 左右洞标识
          deviceName: null, // 设备名称或桩号
          tunnelId: this.tunnelId, // 隧道ID
          classifyNumber: 'laneIndicator' // 分类
        },
        
        checkedAll: null, // 全选1/反选0
        deviceList: [],
        checkedList: [], // 已选设备列表
        workMode: [], // 控制模式
        workModeChecked: null, // 已选控制模式
        
        totalDeviceList: [], // 第一次所有的设备数据
      };
    },
    computed: {
      laneIndicatorDataFormat () {
        let obj = {}
        this.laneIndicatorData.forEach(item => {
          obj[item.status] = item
        })
        return obj
      },
      // 隧道单双洞
      singleDoubleType () {
        return this.tunnelInfoData.singleDoubleType
      },
      // 隧道车道数
      laneNums () {
        return this.tunnelInfoData.laneNums
      },
      // 过滤条件 左/右洞
      leftRightFlag () {
        return this.form.leftRightFlag
      },
    },
    async created () {
      uni.showLoading({
        title: '加载中'
      })
      await this.getLaneIndicatorData()
      await this.getDeviceList()
      await this.getDeviceClassifyControlInfo()
      uni.hideLoading()
    },
    methods: {
      // 控制模式
      getDeviceClassifyControlInfo () {
        return this.$request.getDeviceClassifyControlInfo({
          Id: this.classifyId
        }).then(res => {
          if (res && res.data) {
          // let res = {data: '{"正向通行":"1","反向通行":"2","左转通行":"3","道路封闭":"0"}'}
            try{
              let obj = JSON.parse(res.data)
              for (let prop in obj) {
                this.workMode.push({
                  name: prop,
                  value: obj[prop]
                })
              }
            }catch(e){
              //TODO handle the exception
            }
          }
        })
      },
      // 设备选择
      handleSelect (item) {
        let idx = this.checkedList.indexOf(item.id)
        if (idx === -1) {
          this.checkedList.push(item.id)
        } else {
          this.checkedList.splice(idx, 1)
        }
      },
      // 指示器选中事件
      handleChecked (status, item) {
        // status 左线超车道 1;右线超车道 2;左线行车道 3;右线行车道 4;左线慢车道 5;右线慢车道 6
        if (this.checkedObj[status] === item.deviceStatus) {
          this.checkedObj[status] = null
        } else {
          this.checkedObj[status] = item.deviceStatus
        }
      },
      // 全选/反选
      handleAllSelect (code) {
        if (this.checkedAll === code) {
          this.checkedAll = null
          switch(code) {
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
          switch(code) {
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
      // 左右洞切换
      switchLeftRight (f) {
        if (this.form.leftRightFlag === f) {
          this.form.leftRightFlag = null
        } else {
          this.form.leftRightFlag = f
        }
        this.getDeviceList()
      },
      // 车道切换
      switchVehicleLane (f) {
        if (this.form.vehicleLane === f) {
          this.form.vehicleLane = null
        } else {
          this.form.vehicleLane = f
        }
        this.getDeviceList()
      },
      // 执行
      laneIndicatorImplementList () {
        let laneIndicatorDTOList = [], batchUpdateObj = {}
        for (let prop in this.checkedObj) {
          if (this.checkedObj[prop] !== null) {
            laneIndicatorDTOList.push({
              classifyId: this.classifyId,
              typeCode: 'laneIndicator',
              status: parseInt(prop), // 车道指示器路线状态(1:左线超车道)
              deviceStatus: this.checkedObj[prop] // 车道指示器设备通行状态(1:正向通行)

            })
            batchUpdateObj[prop] = this.checkedObj[prop]
          }
        }
        let deviceId = ''
        if (!this.workModeChecked) {
          return uni.showToast({
            icon:'none',
            title: '请选择控制模式'
          })
        } else if (!this.checkedList.length && !laneIndicatorDTOList.length) {
          return uni.showToast({
            icon:'none',
            title: '请选设备或组合'
          })
        }
        
        this.$request.laneIndicatorImplementList(laneIndicatorDTOList, {
          tunnelId: this.tunnelId,
          classifyId: this.classifyId,
          deviceId: this.checkedList.join(','),
          deviceStatus: parseInt(this.workModeChecked),
          typeCode: 'laneIndicator',
        }).then(res => {
          if (res.status === 1) {
            uni.showToast({
              title: '执行成功',
              icon: 'success'
            })
            this.handleCancel()
            
            // let updateDevices = []
            // if (this.checkedList.length) {
            //   updateDevices.push(...this.checkedList.map(id => {
            //     return {
            //       id,
            //       workMode: parseInt(this.workModeChecked)
            //     }
            //   }))
            // }
            // if (laneIndicatorDTOList.length) {
            //   for (let i = 0; i < this.totalDeviceList.length; i++) {
            //     let device = this.totalDeviceList[i]
            //     if (null !== batchUpdateObj[device.vehicleLane + '']) {
            //       updateDevices.push({
            //         id: device.id,
            //         workMode: batchUpdateObj[device.vehicleLane + '']
            //       })
            //     }
            //   }
            // }
            this.$emit('update-devices')
          }
        })
        console.log(laneIndicatorDTOList)
      },
      // 获取车道指示器数据
      getLaneIndicatorData () {
        return this.$request.getLaneIndicatorData({
          classifyId: this.classifyId,
          tunnelId: this.tunnelId,
          typeCode: 'laneIndicator'
        }).then(res => {
          this.laneIndicatorData = res.data.data
        })
      },
      // 获取设备列表
      getDeviceList () {
        this.checkedAll = null
        this.deviceList.splice(0, this.deviceList.length)
        this.checkedList.splice(0, this.checkedList.length) // 清空已选的设备
        return this.$request.getSelectDeviceList(this.form).then(res => {
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
            !this.totalDeviceList.length && this.totalDeviceList.push(...res.data)
          }
        })
      },
      getBackVal (v) {
        console.log('多选选中数据', v)
      },
      handleCancel () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
.t-modal-laneIndicator {
  height: 373.8281rpx;
  width: 340.625rpx;
  background: url(../../static/modal/laneIndicator/bg.png) center center / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  padding: 5.4687rpx 12.5rpx 2.7343rpx;
  box-sizing: border-box;
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
  
  .group {
    display: flex;
    justify-content: space-between;
    .group-item {
      width: 154.2968rpx;
      // height: 99.6093rpx;
      background: #0B0A30;
      border: 0.3906rpx solid #1D2388;
      // opacity: .5;
      position: relative;
      &.group-item-hide {
        opacity: .5;
        &::after {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
      }
    }
    .check-group-item {
      padding: 3.9062rpx 6.25rpx;
      .check-label {
        background: url(../../static/modal/laneIndicator/dot.png) left center / 7.0312rpx auto no-repeat;
        font-size: 5.4687rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
        padding-left: 10.9375rpx;
      }
      .check-list {
        display: flex;
        justify-content: space-between;
        .check-item {
          display: flex;
          align-items: center;
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
            display: flex;
            flex-direction: column;
            text-align: center;
            image {
              width: 21.875rpx;
            }
            text {
              font-size: 4.6875rpx;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #286BC8;
            }
          }
        }
      }
    }
  }
  .custom-area {
    flex: 1;
    margin-top: 5.0781rpx;
    background: #0B0A30;
    border: 1px solid #1D2388;
    display: flex;
    flex-direction: column;
    padding: 7.0312rpx 6.25rpx 5.4687rpx;
    .title {
      background: url(../../static/modal/laneIndicator/dot.png) left center / 7.0312rpx auto no-repeat;
      font-size: 5.4687rpx;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #5DA0FE;
      padding-left: 10.9375rpx;
    }
    .search-container {
      height: 13.2812rpx;
      display: flex;
      align-items: center;
      margin-top: 5.8593rpx;
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
        & + text {
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
        &:first-of-type {
          
        }
        &.active {
          background-image: url(../../static/modal/laneIndicator/selected.png);
        }
      }
    }
    
    .scroll-container {
      height: 136.7187rpx;
      margin: 5.4687rpx 0 6.6406rpx;
      
      .scroll-content {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
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
            margin-right: 5.0781rpx;//5.8593rpx;//7.0312rpx;
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
        & + .check-item {
          margin-left: 4.6875rpx;
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
          display: flex;
          flex-direction: column;
          text-align: center;
          image {
            width: 21.875rpx;
          }
          text {
            font-size: 4.6875rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #286BC8;
          }
        }
      }
    }
  }
  
  .operation {
    height: 13.2812rpx;
    margin-top: 7.8125rpx;
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
