<template>
  <div class="t-modal-deviceSelect">
    <div class="header">
      <span>照明设备</span>
    </div>
    
    <div class="signallamp-content">
      <div class="search-container">
        <span :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)" v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</span>
        <span :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)" v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</span>
        <input class="input-dom" type="text" v-model="form.deviceName" @blur="getSelectDeviceList" placeholder="设备名称或桩号" />
        <div class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 25px;" @click="handleAllSelect(1)">
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
            </div>
            <div class="device-info">
              <span>{{ item.deviceName}}</span>
              <span>{{item.pileNumberStr}}</span>
            </div>
            <div class="status" :class="{on: item.deviceCommunicationsState === 0}"></div>
          </div>
          <div class="no-data" v-if="!deviceList.length">
            <image src="../../../assets/tunnel/no-data.png" mode="widthFix"></image>
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="operation">
      <span class="cancel" @click="handleCancel">取消</span>
      <span class="start" @click="handleSubmit">选择</span>
    </div>
  </div>
</template>

<script>
  
  export default {
    name:"t-modal-deviceSelect",
    props: {
      show: {
        type: Boolean,
        default: false
      },
      tunnelId: {
        type: [String, Object]
      },
      tunnelInfoData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      classifyId: String,
      // 方案已选设备id列表
      checkedIds: {
        type: Array,
        default: () => []
      }
    },
    services: ["_2d", "tunnel", "tunnel_2d"],
    async created () {
      this.form.tunnelId = this.tunnelId
      await this.getSelectDeviceList()
      this.checkedList.push(...this.checkedIds) // 默认勾选上方案的设备
    },
    data() {
      return {
        checkedAll: null, // 全选1/反选0
        form: {
          leftRightFlag: null, // 左右洞标识
          deviceName: null, // 设备名称或桩号
          tunnelId: null, // 隧道ID
          classifyNumber: 'lighting' // 分类
        },
        deviceList: [],
        checkedList: [], // 已选设备列表
        
        deviceTypeCode: 'lighting'
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
    watch: {
      show (v) {
        if (v) {
          this.getSelectDeviceList().then(() => {
            this.checkedList.push(...this.checkedIds) // 默认勾选上方案的设备
          })
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$emit('batch-add', this.checkedList, this.deviceList.filter(({id}) => this.checkedList.indexOf(id) !== -1))
      },
      // 左右洞切换
      switchLeftRight (f) {
        if (this.form.leftRightFlag === f) {
          this.form.leftRightFlag = null
        } else {
          this.form.leftRightFlag = f
        }
        this.getSelectDeviceList()
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
      // 获取设备列表
      getSelectDeviceList () {
        this.checkedAll = null
        this.deviceList.splice(0, this.deviceList.length)
        this.checkedList.splice(0, this.checkedList.length) // 清空已选的设备
        return this.$service.tunnel_2d.getSelectDeviceList(this.form).then(res => {
          if (res && res.data) {
            this.deviceList.push(...res.data)
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
.t-modal-deviceSelect {
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
    overflow-y: auto;
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
          margin-right: 10px;
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
