<template>
  <div class="t-modal-emergency">
    <div class="header">
      <span>应急模式</span>
    </div>
    
    <div class="lighting-center">
      <div class="lighting-center-part">
        <span class="title">左洞：开启{{ leftDeviceList.length }}个回路；右洞开启{{ rightDeviceList.length }}个回路</span>
        <span class="button" @click="handleSetLight">统一调光</span>
        <span class="button" @click="deviceModalShow = true">选择照明设备</span>
      </div>
      
      <div :show-scrollbar="true" class="lighting-center-scroll" scroll-y="true" >
        <div class="scroll-content">
          <div class="device-item" v-show="selectDeviceIdList.indexOf(item.id) !== -1" v-for="(item, index) in deviceList" :key="item.id + '-' + index" :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
            <div class="device-title" :style="getStyle(item)">
              <span>{{ item['workModeName'] }}</span>
            </div>
            <div class="device-info">
              <span>{{ item.deviceName }}</span>
              <span>{{ item.pileNumberStr }}</span>
            </div>
            <div class="device-value">
              <t-slider disabled :value="item.brightNess" @change="handleSliderChange"></t-slider>
            </div>
            <div class="status" :class="{on: item.deviceCommunicationsState === 0}"></div>
          </div>
          <div class="no-data" v-if="!selectDeviceIdList.length">
            <img src="../../../assets/tunnel/no-data.png" mode="widthFix">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="lighting-submit">
      <span class="cancel" @click="handleCancel">取消</span>
      <span class="start" @click="handleSubmit">启用</span>
    </div>
    
    <t-modal-control v-model="deviceModalShow">
      <!-- 选择照明设备弹窗 -->
      <t-modal-deviceSelect :show="deviceModalShow" :tunnelId="tunnelId" :tunnelInfoData="tunnelInfoData" :classifyId="classifyId" :checkedIds="selectDeviceIdList" @close="deviceModalShow = false" @batch-add="handleBatchAdd"></t-modal-deviceSelect>
    </t-modal-control>
    
    <t-modal-control v-model="setlighteNessShow">
      <!-- 统一调光 -->
      <t-modal-lighteNess :show="setlighteNessShow" :deviceId="selectDeviceIdList" :classifyNumber="classifyNumber" @close="setlighteNessShow = false" @change="handleLightNessChange"></t-modal-lighteNess>
    </t-modal-control>
    
  </div>
</template>

<script>
import tModalDeviceSelect from '../t-modal-deviceSelect/t-modal-deviceSelect'
import tModalControl from '../t-modal-control/t-modal-control.vue'
import tSlider from '../t-slider/t-slider.vue'
import tModalLighteNess from '../t-modal-lighteNess/t-modal-lighteNess.vue'
  export default {
    name:"t-modal-emergency",
    services: ["_2d", "tunnel", "tunnel_2d"],
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
      classifyId: String,
      
    },
    components: {
      tModalDeviceSelect,
      tModalControl,
      tSlider,
      tModalLighteNess
    },
    async created () {
      await this.getSelectDeviceList()
      // await this.listAll()
      // this.getDeviceClassifyControlInfo()
    },
    data() {
      return {
        deviceList: [], // 设备列表
        selectDeviceIdList: [], // 现实的额设备列表
        
        
        checkedAll: null,
        checkedList: [], // 已选设备列表
        schemeList: [], // 方案列表
        schemeChecked: null, // 当前选择的方案
        
        schemeDeviceList: [], // 方案下的设备列表
        
        deviceModalShow: false, // 选择照明设备弹窗控制
        
        schemeModalShow: false, // 组合编辑/新增弹窗控制
        schemeModalType: 0, // 0 新增/1修改
        
        setlighteNessShow: false, // 统一调光弹窗控制
        
        classifyNumber: 'lighting',
        
        workMode: 1, // 1开启 0关闭
        form: {
          
        }
      };
    },
    computed: {
      schemeListFormat () {
        let obj = {}
        this.schemeList.forEach(item => {
          obj[item.id] = item
        })
        return obj
      },
      schemeDeviceIdList () {
        let list = []
        this.schemeDeviceList.forEach(item => {
          list.push(item.id)
        })
        return list
      },
      // 设备匹配用
      deviceListFormat () {
        let obj = {}
        this.deviceList.forEach(item => {
          obj[item.id] = item
        })
        return obj
      },
      // 左洞
      leftDeviceList () {
        return this.deviceList.filter(item => item.leftRightFlag === 2 && item.workMode == 1)
      },
      // 右洞
      rightDeviceList () {
        return this.deviceList.filter(item => item.leftRightFlag === 1 && item.workMode == 1)
      },
      schemeDeviceIds () {
        return this.deviceList.map(item => item.id)
      }
    },
    methods: {
      // 选择设备回调
      handleBatchAdd (list) {
        this.selectDeviceIdList.splice(0, this.selectDeviceIdList.length)
        this.selectDeviceIdList.push(...list)
        this.$nextTick(function(){
          this.deviceModalShow = false
        })
      },
      // 获取设备列表
      getSelectDeviceList (f) {
        this.deviceList.splice(0, this.deviceList.length)
        this.$service.tunnel_2d.getSelectDeviceList({
          classifyNumber: "lighting",
          tunnelId: this.tunnelId
        }).then(res => {
          if (res && res.data) {
            this.deviceList.push(...res.data)
            !f && this.selectDeviceIdList.push(...this.deviceList.map(item => item.id))
          }
        })
      },
      // 启用
      handleSubmit () {
        if (!this.selectDeviceIdList.length) {
          return this.$message.warning("请选择设备")
        }
        this.$service.tunnel_2d.lightingEnable({
          enableStatus: 1
        }, {
          ids: this.selectDeviceIdList
        }).then(res => {
          if (res && res.status === 1) {
            this.$notifySuccess()
            this.handleCancel()
            this.$emit('update-devices')
          }
        })
        
      },
      // 统一调光回调
      handleLightNessChange () {
        this.getSelectDeviceList(true)
        this.setlighteNessShow = false
      },
      handleSetLight () {
        if (!this.selectDeviceIdList.length) {
          return this.$message.warning("暂无设备")
        }
        this.setlighteNessShow = true
      },
      
      
      
      // 控制模式
      getDeviceClassifyControlInfo () {
        return this.$service.tunnel_2d.getDeviceClassifyControlInfo({
          id: this.classifyId
        }).then(res => {
          if (res && res.data) {
          // let res = {data: '{"绿灯":"0","红灯":"1","黄灯":"2","左转":"3"}'}
            try{
              // {"绿灯":"0","红灯":"1","黄灯":"2","左转":"3"}
              let obj = JSON.parse(res.data)
              for (let prop in obj) {
                this.workModeList.push({
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
      handleSliderChange (v, item, instance) {
        if (v === item.brightNess) {
          return
        }
        this.$service.tunnel_2d.tCombinationschemeitemImplement({
          classifyNumber: this.classifyNumber,
          deviceId: item.id,
          lighteNess: v
        }).then(res => {
          if (res && res.status === 1) {
            for (let i = 0; i < this.deviceList.length; i++) {
              if (this.deviceList[i].id === item.id) {
                this.$set(this.deviceList, i, Object.assign({}, this.deviceList[i], {
                  brightNess: v
                }))
                break;
              }
            }
          }
          
        }).catch(() => {
          instance.resetVal()
        })
      },
      handleScheme (f) {
        this.schemeModalType = f
        this.$nextTick(function(){
          this.schemeModalShow = true
        })
      },
      // handleLightNessChange () {
      //   this.getIsDeviceListAll(false)
      //   this.setlighteNessShow = false
      // },
      // 组合策略修改或新增
      handleChange () {
        this.schemeModalShow = false
        this.listAll(false) // 不刷新设备
      },
      handleDelete () {
        let self = this
        if (!this.schemeChecked) {
          return
        }
        this.$showConfirm("是否确认删除").then(
          () => {
            self.$service.tunnel_2d.deleteScheme({
              id: self.schemeChecked
            }).then(res => {
              if (res && res.status === 1) {
                this.$notifySuccess()
                self.schemeChecked = null
                self.listAll()
              }
            })
          }
        );
      },
      // 方案选择
      handleSchemeSelect (item) {
        if (this.schemeChecked === item.id) {
          return
        }
        this.schemeChecked = item.id
        this.getIsDeviceListAll()
      },
      // 获取方案列表
      listAll (refreshDevice = true) {
        this.schemeList.splice(0, this.schemeList.length)
        return this.$service.tunnel_2d.listAll({
          classifyNumber: 'lighting',
          tunnelId: this.tunnelId
        }).then(res => {
          if (res.data) {
            this.schemeList.push(...res.data)
          }
          if (refreshDevice) {
             if (this.schemeChecked === null) {
               this.handleSchemeSelect(this.schemeList[0])
             } else {
               this.getIsDeviceListAll()
             }
          }
        })
      },
      // 获取应急模式下的设备
      getIsDeviceListAll (clearSelected = true) {
        clearSelected && this.checkedList.splice(0, this.checkedList.length) // 清空已选设备
        this.schemeDeviceList.splice(0, this.schemeDeviceList.length)
        return this.$service.tunnel_2d.getIsDeviceListAll({
          id: this.schemeChecked
        }).then(res => {
          if (res && res.data) {
            this.schemeDeviceList.push(...res.data)
          }
        })
      },
      
      // 设备选择
      handleSelect (item) {
        // let idx = this.checkedList.indexOf(item.id)
        // if (idx === -1) {
        //   this.checkedList.push(item.id)
        // } else {
        //   this.checkedList.splice(idx, 1)
        // }
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
      
      
      
      sliderChange (v) {
        console.log(v)
      },
      handleCancel () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
.t-modal-emergency {
  width: 871px;
  height: 720px;
  background: url(../../../assets/tunnel/modal/laneIndicator/bg.png) center center / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  padding: 14px 36px 0;
  box-sizing: border-box;
  
  .lighting-submit {
    height: 34px;
    margin-top: 22px;
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
  
  .lighting-center {
    width: 100%;
    height: 567px;
    background: #0B0A30;
    border: 1px solid #1D2388;
    margin-top: 14px;
    box-sizing: border-box;
    
    .lighting-center-part2 {
      display: flex;
      margin-top: 20px;
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
        &.active {
          background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
        }
      }
    }
    
    .lighting-center-scroll {
      height: 434px;
      padding: 0 10px;
      box-sizing: border-box;
      // border: 1px solid red;
      .scroll-content {
        display: flex;
        flex-wrap: wrap;
        min-height: 100%;
        position: relative;
        // justify-content: space-between;
        .device-item {
          width: 178px;
          height: 230px;
          background: #120F41;
          box-sizing: border-box;
          border: 1px solid #4E58ED;
          position: relative;
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
          &.active {
            border-color: #e7743a;
          }
          &:not(:nth-child(4n)) {
            margin-right: 18px;//22px;//28px;
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
            height: 24px;
            line-height: 24px;
            
            height: 40px;
            line-height: 20px;
            background: #262477;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5DA0FE;
            text-align: center;
            width: 98%;
            margin: 0 auto 3px;
            span {
              display: block;
            }
          }
          .device-value {
            height: 56px;
            position: relative;
            width: 85%;
            margin: 0 auto;
          }
        }
      }
    }
    
    .lighting-center-part {
      padding: 18px 30px 19px;
      display: flex;
      align-items: center;
      .title {
        flex: 1;
        background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) left center / 18px auto no-repeat;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
        padding-left: 28px;
      }
      .button {
        width: 100px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #3B46E2;
        border-radius: 4px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        & + .button {
          margin-left: 14px;
        }
      }
    }
  }
  
  .lighting-top {
    width: 100%;
    height: 112px;
    background: #0B0A30;
    border: 1px solid #1D2388;
    margin-top: 26px;
    box-sizing: border-box;
    .lighting-top-part2 {
      display: flex;
      padding: 0 24px;
      span {
        width: 80px;
        height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        & + span {
          margin-left: 11px;
        }
      }
    }
    .lighting-top-part {
      padding: 18px 30px 19px;
      display: flex;
      align-items: center;
      .title {
        flex: 1;
        background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) left center / 18px auto no-repeat;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
        padding-left: 28px;
      }
      .button {
        width: 90px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #3B46E2;
        border-radius: 4px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFFFFF;
        & + .button {
          margin-left: 14px;
        }
      }
    }
  }
  
  > .header {
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
}
</style>
