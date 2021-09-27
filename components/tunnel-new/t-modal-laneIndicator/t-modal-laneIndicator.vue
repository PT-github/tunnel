<template>
  <div class="t-modal-laneIndicator">
    <div class="header">
      <span>手动模式-车道指示器</span>
    </div>
    <!-- 左线超车道 1;右线超车道 2;左线行车道 3;右线行车道 4;左线慢车道 5;右线慢车道 6 -->
    <div class="group">
      <div class="group-item" :class="{'group-item-hide': singleDoubleType === 1}">
        <div class="check-group-item" v-if="laneIndicatorDataFormat['1']">
          <div class="check-label">
            <span>{{ laneIndicatorDataFormat['1']['name'] }}</span>
          </div>
          <div class="check-list">
            <div class="check-item" v-for="item in laneIndicatorDataFormat['1'].deviceCurrentStatusList" :key="'1_' + item.deviceStatus" @click="handleChecked(1, item)">
              <div class="checkbox" :class="{ active: checkedObj['1'] === item.deviceStatus }"></div>
              <div class="check-value">
                <img :src="require(`../../../assets/tunnel/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix">
                <span>{{ item.deviceName }}</span>
              </div>
            </div>
          </div>
        </div>
        
        
        <div class="check-group-item" v-if="laneIndicatorDataFormat['3']">
          <div class="check-label">
            <span>{{ laneIndicatorDataFormat['3'].name }}</span>
          </div>
          <div class="check-list">
            <div class="check-item" v-for="item in laneIndicatorDataFormat['3'].deviceCurrentStatusList" :key="'3_' + item.deviceStatus" @click="handleChecked(3, item)">
              <div class="checkbox" :class="{ active: checkedObj['3'] === item.deviceStatus }"></div>
              <div class="check-value">
                <img :src="require(`../../../assets/tunnel/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix">
                <span>{{ item.deviceName }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="check-group-item"  v-if="laneIndicatorDataFormat['5']">
          <div class="check-label">
            <span>{{ laneIndicatorDataFormat['3'].name }}</span>
          </div>
          <div class="check-list">
            <div class="check-item" v-for="item in laneIndicatorDataFormat['5'].deviceCurrentStatusList" :key="'5_' + item.deviceStatus" @click="handleChecked(5, item)">
              <div class="checkbox" :class="{ active: checkedObj['5'] === item.deviceStatus }"></div>
              <div class="check-value">
                <img :src="require(`../../../assets/tunnel/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix">
                <span>{{ item.deviceName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="group-item" :class="{'group-item-hide': singleDoubleType === 2}">
        <div class="check-group-item" v-if="laneIndicatorDataFormat['2']">
          <div class="check-label">
            <span>{{ laneIndicatorDataFormat['2'].name }}</span>
          </div>
          <div class="check-list">
            <div class="check-item" v-for="item in laneIndicatorDataFormat['2'].deviceCurrentStatusList" :key="'2_' + item.deviceStatus" @click="handleChecked(2, item)">
              <div class="checkbox" :class="{ active: checkedObj['2'] === item.deviceStatus }"></div>
              <div class="check-value">
                <img :src="require(`../../../assets/tunnel/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix">
                <span>{{ item.deviceName }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="check-group-item" v-if="laneIndicatorDataFormat['4']">
          <div class="check-label">
            <span>{{laneIndicatorDataFormat['4'].name}}</span>
          </div>
          <div class="check-list">
            <div class="check-item" v-for="item in laneIndicatorDataFormat['4'].deviceCurrentStatusList" :key="'4_' + item.deviceStatus" @click="handleChecked(4, item)">
              <div class="checkbox" :class="{ active: checkedObj['4'] === item.deviceStatus }"></div>
              <div class="check-value">
                <img :src="require(`../../../assets/tunnel/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix">
                <span>{{ item.deviceName }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="check-group-item" v-if="laneIndicatorDataFormat['6']">
          <div class="check-label">
            <span>{{laneIndicatorDataFormat['6'].name}}</span>
          </div>
          <div class="check-list">
            <div class="check-item" v-for="item in laneIndicatorDataFormat['6'].deviceCurrentStatusList" :key="'6_' + item.deviceStatus" @click="handleChecked(6, item)">
              <div class="checkbox" :class="{ active: checkedObj['6'] === item.deviceStatus }"></div>
              <div class="check-value">
                <img :src="require(`../../../assets/tunnel/modal/laneIndicator/icon${item.deviceStatus}.png`)" mode="widthFix">
                <span>{{ item.deviceName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-area">
      <div class="title">
        <span>自定义组合区域</span>
      </div>
      
      <div class="search-container">
        <span :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)" v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</span>
        <span :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)" v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</span>
        <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
      </div>
      
      <div class="search-container">
        <span :class="{ active: form.vehicleLane === 1 }" @click="switchVehicleLane(1)">超车道</span>
        <span :class="{ active: form.vehicleLane === 2 }" @click="switchVehicleLane(2)">行车道</span>
        <span :class="{ active: form.vehicleLane === 3 }" @click="switchVehicleLane(3)">慢车道</span>
        
        <div class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 9.7656rpx;" @click="handleAllSelect(1)">
          全选
        </div>
        <div class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
          反选
        </div>
      </div>
      
      <div :show-scrollbar="true" class="scroll-container" scroll-y="true" >
        <div class="scroll-content">
          <div class="device-item" v-for="(item, index) in deviceList" :key="item.id + '_' + index" :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
            <div class="device-title" :style="getStyle(item)">
              <span>{{ item.workModeName }}</span>
              <div class="sensorValTextShow" v-if="item.sensorValTextShow">
                <span>{{ item.sensorValTextList }}</span>
              </div>
            </div>
            <div class="device-info">
              <span>{{ item.deviceName}}</span>
              <span>{{item.pileNumberStr}}</span>
            </div>
            <div class="status" :class="{on: item.deviceCommunicationsState === 0}"></div>
          </div>
          <div class="no-data" v-if="!deviceList.length">
            <img src="../../../assets/tunnel/no-data.png" mode="widthFix">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
      
      <div class="control-container">
        <div class="check-item" v-for="(item, index) in workMode" :key="item.value + '_workMode_' + item" @click="workModeChecked = item.value">
          <div class="checkbox" :class="{ active: workModeChecked === item.value }"></div>
          <div class="check-value">
            <img :src="require(`../../../assets/tunnel/modal/laneIndicator/icon${item.value}.png`)" mode="widthFix">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      
    </div>
    
    <div class="operation">
      <span class="cancel" @click="handleCancel">取消</span>
      <span class="start" @click="laneIndicatorImplementList">执行</span>
    </div>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
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
      await this.getLaneIndicatorData()
      await this.getDeviceList()
      await this.getDeviceClassifyControlInfo()
    },
    methods: {
      // 控制模式
      getDeviceClassifyControlInfo () {
        return this.$service.tunnel_2d.getDeviceClassifyControlInfo({
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
          return this.$message.warning("请选择控制模式")
        } else if (!this.checkedList.length && !laneIndicatorDTOList.length) {
          return this.$message.warning("请选设备或组合")
        }
        
        this.$service.tunnel_2d.laneIndicatorImplementList(laneIndicatorDTOList, {
          tunnelId: this.tunnelId,
          classifyId: this.classifyId,
          deviceId: this.checkedList.join(','),
          deviceStatus: parseInt(this.workModeChecked),
          typeCode: 'laneIndicator',
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess()
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
        return this.$service.tunnel_2d.getLaneIndicatorData({
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
        return this.$service.tunnel_2d.getSelectDeviceList(this.form).then(res => {
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
  height: 980px;
  width: 872px;
  background: url(../../../assets/tunnel/modal/laneIndicator/bg.png) center center / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  padding: 14px 32px 7px;
  box-sizing: border-box;
  .header {
    width: 277px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background: url(../../../assets/tunnel/modal/laneIndicator/top-bg.png) center center / 100% 100% no-repeat;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #FFFFFF;
    margin: 0 auto;
  }
  
  .group {
    display: flex;
    justify-content: space-between;
    .group-item {
      width: 395px;
      // height: 255px;
      background: #0B0A30;
      border: 1px solid #1D2388;
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
      padding: 10px 16px;
      .check-label {
        background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) left center / 18px auto no-repeat;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
        padding-left: 28px;
      }
      .check-list {
        display: flex;
        justify-content: space-between;
        .check-item {
          display: flex;
          align-items: center;
          .checkbox {
            background: url(../../../assets/tunnel/modal/laneIndicator/unselected.png) center center / 14px auto no-repeat;
            width: 14px;
            height: 14px;
            margin-right: 8px;
            &.active {
              background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
            }
          }
          .check-value {
            display: flex;
            flex-direction: column;
            text-align: center;
            img {
              width: 56px;
            }
            span {
              font-size: 12px;
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
    margin-top: 13px;
    background: #0B0A30;
    border: 1px solid #1D2388;
    display: flex;
    flex-direction: column;
    padding: 18px 16px 14px;
    .title {
      background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) left center / 18px auto no-repeat;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #5DA0FE;
      padding-left: 28px;
    }
    .search-container {
      height: 34px;
      display: flex;
      align-items: center;
      margin-top: 15px;
      span {
        display: inline-block;
        height: 34px;
        line-height: 34px;
        width: 80px;
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
        & + span {
          margin-left: 10px;
        }
      }
      input {
        width: 354px;
        height: 34px;
        background: #120F41 url(../../../assets/tunnel/modal/laneIndicator/sousuo.png) 321px center / 20px auto no-repeat;
        border: 1px solid #4E58ED;
        display: inline-block;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
        padding: 0 33px 0 16px;
        box-sizing: border-box;
        &.input-dom {
          margin-left: 13px;
        }
      }
      .mul-select {
        width: 354px;
        height: 34px;
        background: #120F41;
        border: 1px solid #4E58ED;
        box-sizing: border-box;
        margin-right: 10px;
      }
      .sel-btn {
        height: 34px;
        line-height: 34px;
        background: url(../../../assets/tunnel/modal/laneIndicator/unselected.png) left center / 14px auto no-repeat;
        padding-left: 21px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #286BC8;
        margin-left: 9px;
        &:first-of-type {
          
        }
        &.active {
          background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
        }
      }
    }
    
    .scroll-container {
      height: 350px;
      margin: 14px 0 17px;
      
      .scroll-content {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        .device-item {
          width: 178px;
          height: 159px;
          background: #120F41;
          border: 1px solid #4E58ED;
          position: relative;
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
          &.active {
            border-color: #e7743a;
          }
          &:not(:nth-child(4n)) {
            margin-right: 13px;//15px;//18px;
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
          .device-title {
            flex: 1;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #5DA0FE;
            padding: 10px 13px;
          }
          .device-info {
            height: 40px;
            line-height: 20px;
            background: #262477;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5DA0FE;
            text-align: center;
            width: 172px;
            margin: 0 auto 3px;
            span {
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
          margin-left: 12px;
        }
        .checkbox {
          background: url(../../../assets/tunnel/modal/laneIndicator/unselected.png) center center / 14px auto no-repeat;
          width: 14px;
          height: 14px;
          margin-right: 8px;
          &.active {
            background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
          }
        }
        .check-value {
          display: flex;
          flex-direction: column;
          text-align: center;
          img {
            width: 56px;
          }
          span {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #286BC8;
          }
        }
      }
    }
  }
  
  .operation {
    height: 34px;
    margin-top: 20px;
    text-align: center;
    span {
      display: inline-block;
      width: 80px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #FFFFFF;
    }
    .cancel {
      background: #1B195A;
      color: #286BC8;
      margin-right: 9px;
    }
    .start {
      background: #3B46E2;
    }
  }
}
</style>
