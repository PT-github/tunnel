<template>
  <div class="t-modal-signallamp">
    <div class="header">
      <span>手动模式-交通信号灯</span>
    </div>
    
    <div class="signallamp-content">
      <div class="search-container">
        <span :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)" v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</span>
        <span :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)" v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</span>
        <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
        <div class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 9.7656rpx;" @click="handleAllSelect(1)">
          全选
        </div>
        <div class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
          反选
        </div>
      </div>
      
      <div :show-scrollbar="true" class="scroll-container" scroll-y="true" >
        <div class="scroll-content">
          <div class="device-item" v-for="item in deviceList" :key="item.id" :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
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
          <!-- <div class="device-item">
            <div class="device-title">
              <span>红</span>
            </div>
            <div class="device-info">
              <span>设备名称+桩号</span>
            </div>
            <div class="status offline"></div>
          </div> -->
        </div>
      </div>
      
      <div class="control-container">
        <div class="check-item" v-for="item in workMode" :key="item.value" @click="workModeChecked = item.value">
          <div class="checkbox" :class="{ active: workModeChecked === item.value }"></div>
          <div class="check-value">
            <span>{{ item.name }}</span>
          </div>
        </div>
        <!-- <div class="check-item">
          <div class="checkbox"></div>
          <div class="check-value">
            <span>红</span>
          </div>
        </div>
        <div class="check-item">
          <div class="checkbox"></div>
          <div class="check-value">
            <span>绿</span>
          </div>
        </div>
        <div class="check-item">
          <div class="checkbox"></div>
          <div class="check-value">
            <span>左转</span>
          </div>
        </div> -->
      </div>
    </div>
    
    <div class="operation">
      <span class="cancel" @click="handleCancel">取消</span>
      <span class="start" @click="handleSubmit">执行</span>
    </div>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name:"t-modal-signallamp",
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
        deviceTypeCode: 'signallamp',
        checkedAll: null, // 全选1/反选0
        form: {
          leftRightFlag: null, // 左右洞标识
          deviceName: null, // 设备名称或桩号
          tunnelId: null, // 隧道ID
          classifyNumber: 'signallamp' // 分类
        },
        deviceList: [],
        checkedList: [], // 已选设备列表
        workMode: [], // 控制模式
        workModeChecked: null, // 已选控制模式
      };
    },
    computed: {
      // 隧道单双洞
      singleDoubleType () {
        return this.tunnelInfoData.singleDoubleType
      },
      // 过滤条件 左/右洞
      leftRightFlag () {
        return this.form.leftRightFlag
      },
    },
    created () {
      this.form.tunnelId = this.tunnelId
      this.getDeviceList()
      this.getDeviceClassifyControlInfo()
    },
    methods: {
      // 执行
      handleSubmit () {
        if (this.checkedList.length === 0) {
          return this.$message.warning("请选择设备")
        }
        if (!this.workModeChecked) {
          return this.$message.warning("请选择控制模式")
        }
        this.$ctx.showLoading('加载中...')
        this.$service.tunnel_2d.operateCommonDevice({
          classifyNumber: 'signallamp',
          deviceIds: this.checkedList.join(','),
          workMode: parseInt(this.workModeChecked)
        }).then(res => {
          if (res.status === 1) {
            this.$notifySuccess()
            this.$emit('update-devices', this.checkedList.map(id => {
              return {
                id,
                workMode: parseInt(this.workModeChecked)
              }
            }))
            this.handleCancel()
          }
          this.$ctx.hideLoading()
        }).catch(() => {
          this.$ctx.hideLoading()
        })
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
      // 设备选择
      handleSelect (item) {
        let idx = this.checkedList.indexOf(item.id)
        if (idx === -1) {
          this.checkedList.push(item.id)
        } else {
          this.checkedList.splice(idx, 1)
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
      // 获取设备列表
      getDeviceList () {
        this.checkedAll = null
        this.deviceList.splice(0, this.deviceList.length)
        this.checkedList.splice(0, this.checkedList.length) // 清空已选的设备
        this.$service.tunnel_2d.getSelectDeviceList(this.form).then(res => {
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
      getDeviceClassifyControlInfo () {
        return this.$service.tunnel_2d.getDeviceClassifyControlInfo({
          Id: this.classifyId
        }).then(res => {
          if (res && res.data) {
          // let res = {data: '{"绿灯":"0","红灯":"1","黄灯":"2","左转":"3"}'}
            try{
              // {"绿灯":"0","红灯":"1","黄灯":"2","左转":"3"}
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
      handleCancel () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
.t-modal-signallamp {
  width: 871px;
  height: 608px;
  background: url(../../../assets/tunnel/modal/laneIndicator/bg.png) center center / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  padding: 14px 32px 7px;
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
  .signallamp-content {
    width: 803px;
    margin: 26px auto;
    height: 431px;
    background: #0B0A30;
    border: 1px solid #1D2388;
    margin-bottom: 27px;
    padding: 19px 23px 17px;
    display: flex;
    flex-direction: column;
  }
  .search-container {
    height: 34px;
    display: flex;
    align-items: center;
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
    height: 340px;
    // flex: 1;
    margin: 21px 0;
    .scroll-content {
      display: flex;
      flex-wrap: wrap;
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
          margin-right: 10px; //25px;//28px;
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
        margin-left: 17px;
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
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #286BC8;
        // display: flex;
        // flex-direction: column;
        // text-align: center;
        // image {
        //   width: 56px;
        // }
        // span {
        //   font-size: 12px;
        //   font-family: Microsoft YaHei;
        //   font-weight: 400;
        //   color: #286BC8;
        // }
      }
    }
  }
  
  .operation {
    height: 34px;
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
