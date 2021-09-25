<!-- 智能模式 -->
<template>
  <div class="t-modal-smart">
    <div class="header">
      <span>智能模式-照明</span>
    </div>
    
    <div class="lighting-center">
      <div class="lighting-center-part">
        <span class="button" @click="handleAdd">新增策略</span>
        <span class="button" @click="handleDelete">删除策略</span>
      </div>
      
      <div :show-scrollbar="true" class="lighting-center-scroll" scroll-y="true" >
        <div class="scroll-content">
          <div class="strategy-item" v-for="(item, index) in strategyList" :key="item.id + '-' + index" @click="handleSelect(item)">
            <div class="sel-btn" :class="{active: checkedList.indexOf(item.id) !== -1 }"></div>
            <div class="text-info">
              <span class="text-main">{{ item.lightIntensityFormat ? (item.lightIntensityFormat.deviceName + ' ' + compareFormat[item.compare] + ' ' + item.bmps + 'bmps的值；') : ''}}{{item.weatherId ? ('天气情况为' + item.weatherName + ';') : ''}}{{ item.endTime && item.startTime ? (`设置开始时间为${item.startTime}，结束时间为${item.endTime}；`) : '' }}</span>
              <span>开启：左洞照明回路控制{{item.leftCount}}个，右洞照明回路控制{{item.rightCount}}个</span>
            </div>
            <div class="sel-choose" @click.stop="showStrategy(item, index)">
              <span>查看详情</span>
            </div>
          </div>
          <div class="no-data" v-if="!strategyList.length">
            <image src="../../static/no-data.png" mode="widthFix"></image>
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="lighting-submit">
      <span class="cancel" @click="handleCancel">取消</span>
      <span class="start" @click="handleSubmit">启用</span>
    </div>
    
    <t-modal-control v-model="strategyModalShow">
      <!-- 策略编辑 -->
      <t-modal-strategy-edit :weatherList="weatherList" :luminanceMeterEquipment="luminanceMeterEquipment" :show="strategyModalShow" :type="type" :currentData="currentData" :tunnelId="tunnelId" :tunnelInfoData="tunnelInfoData" :classifyId="classifyId" :checkedIds="selectDeviceIdList" @close="strategyModalShow = false" @update="handleUpdate"></t-modal-strategy-edit>
    </t-modal-control>
    
    
  </div>
</template>

<script>
  import tModalStrategyEdit from '../t-modal-strategy-edit/t-modal-strategy-edit'
  import tModalControl from '../t-modal-control/t-modal-control.vue'
  export default {
    name:"t-modal-smart",
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
      tModalStrategyEdit,
      tModalControl
    },
    services: ["_2d", "tunnel", "tunnel_2d"],
    async created () {
      await Promise.all([
        this.getLuminanceMeterEquipment(),
        this.listChildrenByParentValue()
      ])
      await this.getLists()
      // await this.getStragyDeviceListAll()
      
      // this.getDeviceClassifyControlInfo()
    },
    data() {
      return {
        compareFormat: {
          '0': '大于等于', '1': '小于等于', '2': '大于', '3': '小于'
        },
        strategyList: [], // 策略列表
        checkedList: [], // 已选设备策略
        strategyModalShow: false, // 策略新增/查看弹窗显示
        type: 0, // 0 策略新增； 1 策略查看
        currentData: {}, // 当前选中策略
        luminanceMeterEquipment: [], // 光强设备列表
        weatherList: [], // 天气列表
        
        
        
        
        deviceList: [], // 设备列表
        selectDeviceIdList: [], // 现实的额设备列表
        
        
        checkedAll: null,
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
      luminanceMeterEquipmentFormat () {
        let obj = {}
        this.luminanceMeterEquipment.forEach(item => {
          obj[item.id] = item
        })
        return obj
      },
      // 天气匹配用
      weatherListFormat () {
        let obj = {}
        this.weatherList.forEach(item => {
          obj[item.dictionaryId] = item
        })
        return obj
      },
      
      
      // 左洞
      // leftDeviceList () {
      //   return this.schemeDeviceList.filter(item => item.leftRightFlag === 2)
      // },
      // // 右洞
      // rightDeviceList () {
      //   return this.schemeDeviceList.filter(item => item.leftRightFlag === 1)
      // },
      // schemeDeviceIds () {
      //   return this.deviceList.map(item => item.id)
      // }
    },
    methods: {
      // 启用
      handleSubmit () {
        if (!this.checkedList.length) {
          return this.$message.warning("请选择策略")
        }
        this.$service.tunnel_2d.lightingEnable({
          enableStatus: 1
        }, {
          ids: this.checkedList
        }).then(res => {
          if (res && res.status === 1) {
            this.$notifySuccess()
            this.$emit('update-devices', 'lighting')
            this.handleCancel()
          }
        })
      },
      async handleUpdate () {
        await this.getLists()
      },
      // 获取天气
      listChildrenByParentValue () {
        this.weatherList.splice(0, this.weatherList.length)
        return this.$service.tunnel_2d.listChildrenByParentValue({
          value: 'Weather'
        }).then(res => {
          res && res.data && this.weatherList.push(...res.data)
        })
      },
      // 显示策略
      async showStrategy (item, index) {
        this.type = 1
        await this.getStragyDeviceListAll(item.id, index)
        this.currentData = this.strategyList[index]
        this.$nextTick(function(){
          this.strategyModalShow = true
        })
      },
      // 策略新增
      handleAdd () {
        this.type = 0
        this.currentData = {}
        this.$nextTick(function(){
          this.strategyModalShow = true
        })
      },
      // 策略删除
      handleDelete () {
        let self = this
        if (!this.checkedList.length) {
          return this.$message.warning("请选择策略")
        }
        this.$showConfirm("请确认是否删选择的节目信息，删除后不能恢复！").then(
          () => {
            self.$service.tunnel_2d.strategyDelete({
              id: self.checkedList.join(',')
            }).then(res => {
              if (res && res.status === 1) {
                this.$notifySuccess()
                self.schemeChecked = null
                self.handleUpdate()
              }
            })
          }
        );
      },
      // 策略选择
      handleSelect (item) {
        let idx = this.checkedList.indexOf(item.id)
        if (idx === -1) {
          this.checkedList.push(item.id)
        } else {
          this.checkedList.splice(idx, 1)
        }
      },
      // 获取策略列表
      getLists () {
        this.strategyList.splice(0, this.strategyList.length)
        this.checkedList.splice(0, this.checkedList.length)
        return this.$service.tunnel_2d.getLists({
          tunnelId: this.tunnelId
        }).then(res => {
          res.data.forEach(item => {
            if (item.enableStatus === 1) {
              this.checkedList.push(item.id)
            }
            if (item.panoramaDeviceInfo) {
              item.lightIntensity = item.panoramaDeviceInfo.id
            }
            if (item.lightIntensity && this.luminanceMeterEquipmentFormat[item.lightIntensity]) {
              item.lightIntensityFormat = this.luminanceMeterEquipmentFormat[item.lightIntensity]
            }
            // if (item.weatherId && this.weatherListFormat[item.weatherId]) {
            //   item.lightIntensityFormat = this.luminanceMeterEquipmentFormat[item.lightIntensity]
            // }
            this.strategyList.push(item)
          })
        })
      },
      // 光强设备列表
      getLuminanceMeterEquipment () {
        this.luminanceMeterEquipment.splice(0, this.luminanceMeterEquipment.length)
        return this.$service.tunnel_2d.getLuminanceMeterEquipment({
          tunnelId: this.tunnelId
        }).then(res => {
          res && res.data && this.luminanceMeterEquipment.push(...res.data)
        })
      },
      // 获取智能模式下的设备
      async getStragyDeviceListAll (modeId, index) {
        await this.$service.tunnel_2d.getStragyDeviceListAll({
          modeId
        }).then(res => {
          if (res && res.data) {
            this.$set(this.strategyList, index, Object.assign({}, this.strategyList[index], {
              deviceList: res.data,
              deviceIdList: res.data.map(item => item.id),
              leftDevicesList: res.data.filter(item => item.leftRightFlag === 2 && item.workMode == 1),
              rightDevicesList: res.data.filter(item => item.leftRightFlag === 1 && item.workMode == 1),
            }))
          } else {
            this.$set(this.strategyList, index, Object.assign({}, this.strategyList[index], {
              deviceList: [],
              deviceIdList: [],
              leftDevicesList: [],
              rightDevicesList: []
            }))
          }
          
        })
      },
      // // 获取智能模式下的设备
      // async getStragyDeviceListAll () {
      //   if (this.strategyList.length) {
      //     for (let i = 0; i < this.strategyList.length; i++) {
      //       await this.$service.tunnel_2d.getStragyDeviceListAll({
      //         modeId: this.strategyList[i].id
      //       }).then(res => {
      //         if (res && res.data) {
      //           this.$set(this.strategyList, i, Object.assign({}, this.strategyList[i], {
      //             deviceList: res.data,
      //             deviceIdList: res.data.map(item => item.id),
      //             leftDevicesList: res.data.filter(item => item.leftRightFlag === 2 && item.workMode == 1),
      //             rightDevicesList: res.data.filter(item => item.leftRightFlag === 1 && item.workMode == 1),
      //           }))
      //         } else {
      //           this.$set(this.strategyList, i, Object.assign({}, this.strategyList[i], {
      //             deviceList: [],
      //             deviceIdList: [],
      //             leftDevicesList: [],
      //             rightDevicesList: []
      //           }))
      //         }
              
      //       })
      //     }
      //   }
      // },
      
      
      
      handleCancel () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
.t-modal-smart {
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
    
    .lighting-center-scroll {
      height: 434px;
      padding: 0 10px;
      box-sizing: border-box;
      // border: 1px solid red;
      .scroll-content {
        display: flex;
        flex-direction: column;
        padding: 0 16px 16px;
        // flex-wrap: wrap;
        // justify-content: space-between;
        .strategy-item {
          // width: 178px;
          background: #120F41;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #4E58ED;
          position: relative;
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 10px;
          &.active {
            border-color: #e7743a;
          }
          .sel-btn {
            width: 30px;
            height: 30px;
            background: url(../../../assets/tunnel/modal/laneIndicator/unselected.png) center center / 18px auto no-repeat;
            &.active {
              background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
            }
          }
          .text-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 10px;
            span {
              padding: 0 10px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #5DA0FE;
              &.text-main {
                font-size: 14px;
              }
            }
          }
          .sel-choose {
            padding: 5px 10px;
            background: #0B0A30;
            border: 1px solid #3B46E2;
            border-radius: 4px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #3B46E2;
          }
        }
      }
    }
    
    .lighting-center-part {
      padding: 18px 30px 19px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
}
</style>
