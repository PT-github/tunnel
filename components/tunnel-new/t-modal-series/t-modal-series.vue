<template>
  <div class="t-modal-series">
    <div class="header">
      <span>时序模式</span>
    </div>
    
    <div class="lighting-top">
      <div class="lighting-top-part">
        <span class="title">季节列表</span>
        <!--沟通后不在前台进行配置，只显示 <span class="button" @click="handleScheme(0)">添加季节</span>
        <span class="button" @click="handleScheme(1)">修改季节</span>
        <span class="button" @click="handleDelete">删除季节</span> -->
      </div>
      <div class="lighting-top-part2">
        <span :class="{active: schemeChecked === item.id}" v-for="(item, index) in seasonList" :key="item.id + '-' + index" @click="handleSchemeSelect(item)">{{ item.seasonName }}</span>
      </div>
      
      <div class="lighting-top-part3">
        <span>当前季节时间：{{ seasonListFormat[schemeChecked] && seasonListFormat[schemeChecked].fullDate }}</span>
      </div>
    </div>
    
    <div class="lighting-center">
      <div :show-scrollbar="true" class="lighting-center-scroll" scroll-y="true" >
        <div class="scroll-content">
          <div class="time-item" v-for="(item, index) in timeList" :key="item.id + '-' + index" @click="handleSelect(item)">
            <div class="sel-btn" :class="{active: checkedList.indexOf(item.id) !== -1 }"></div>
            <div class="text-info">
              <span>{{ item.timeslotName }}：{{ item.startTime }}~{{ item.endTime }}</span>
              <span>左洞：开启{{ item.leftCount }}个回路；右洞：开启{{ item.rightCount }}个回路</span>
            </div>
            <div class="sel-choose" @click.stop="bindDevice(item)">
              <span>选择开启照明</span>
            </div>
          </div>
          <div class="no-data" v-if="!timeList.length">
            <image src="../../../assets/tunnel/no-data.png" mode="widthFix"></image>
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
      <t-modal-deviceSelect :show="deviceModalShow" :tunnelId="tunnelId" :tunnelInfoData="tunnelInfoData" :classifyId="classifyId" :checkedIds="checkedIds" @close="deviceModalShow = false" @batch-add="handleBatchAdd"></t-modal-deviceSelect>
    </t-modal-control>
    
  </div>
</template>

<script>
import tModalDeviceSelect from '../t-modal-deviceSelect/t-modal-deviceSelect'
import tModalControl from '../t-modal-control/t-modal-control.vue'
  export default {
    name:"t-modal-series",
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
      tModalControl
    },
    services: ["_2d", "tunnel", "tunnel_2d"],
    async created () {
      await this.getListAll()
      await this.getSeasonListAll()
      // await this.getDevicebookinfoList()
    },
    data() {
      return {
        seasonList: [], // 季节列表
        schemeChecked: null, // 当前选择的季节
        timeList: [], // 时间列表
        checkedList: [], // 已选时间段ID
        checkedTimeId: '1', // 已选时间段ID
        currentTimeId: null, // 绑定设备时当前选中的时间段ID
        deviceModalShow: false, // 选择照明设备弹窗控制
        checkedIds: [], // 设备选择默认被勾选的设备
        
        
        
        
        checkedAll: null,
        schemeList: [], // 方案列表
        
        deviceList: [], // 设备列表
        schemeDeviceList: [], // 方案下的设备列表
        
        
        
        schemeModalShow: false, // 组合编辑/新增弹窗控制
        schemeModalType: 0, // 0 新增/1修改
        
        classifyNumber: 'lighting',
        
        workMode: 1, // 1开启 0关闭
        form: {
          
        }
      };
    },
    computed: {
      seasonListFormat () {
        let obj = {}
        this.seasonList.forEach(item => {
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
        return this.schemeDeviceList.filter(item => item.leftRightFlag === 2)
      },
      // 右洞
      rightDeviceList () {
        return this.schemeDeviceList.filter(item => item.leftRightFlag === 1)
      },
      schemeDeviceIds () {
        return this.schemeDeviceList.map(item => item.id)
      }
    },
    methods: {
      // 季节删除
      handleDelete () {
        let self = this
        if (!this.schemeChecked) {
          return
        }
        this.$showConfirm().then(() => {
          self.$service.tunnel_2d.deleteSeason({
            id: self.schemeChecked
          }).then(res => {
            if (res && res.status === 1) {
              this.$notifySuccess()
              self.schemeChecked = null
              self.getListAll()
            }
          })
        });
      },
      async bindDevice (item) {
        this.currentTimeId = item.id
        let deviceIdList = await this.getDevicebookinfoList(item.id)
        this.checkedIds = (deviceIdList || []).map(item => item.id) || []
        this.$nextTick(function(){
          this.deviceModalShow = true
        })
      },
      handleSubmit () {
        if (!this.checkedList.length) {
          return this.$message.warning("请选择时间段")
        }
        this.$service.tunnel_2d.timeEnable({
          enableStatus: 1,
          ids: this.checkedList.join(',')
        }).then(res => {
          if (res && res.status === 1) {
            this.$notifySuccess()
            this.handleCancel()
            this.$emit('update-devices', 'lighting')
          }
        })
      },
      // 时间段绑定设备
      handleBatchAdd (idList, deviceList) {
        this.$service.tunnel_2d.updateTimeByBatch(
          deviceList.map(item => {
            return {
              deviceId: item.id,
              seasonId: this.schemeChecked,
              timeslotId: this.currentTimeId,
              leftRightFlag: item.leftRightFlag
            }
          })
        ).then(res => {
          if (res && res.status === 1) {
            this.getSeasonListAll().then(() => {
              this.$notifySuccess()
              this.$nextTick(function(){
                this.deviceModalShow = false
              })
            })
          }
        })
      },
      // 时间段选择
      handleSelect (item) {
        let idx = this.checkedList.indexOf(item.id)
        if (idx === -1) {
          this.checkedList.push(item.id)
        } else {
          this.checkedList.splice(idx, 1)
        }
      },
      // 获取时间段下的列表
      getDevicebookinfoList (id) {
        return this.$service.tunnel_2d.getDevicebookinfoList({
          timeslotId: id,
          leftRightFlag: ''
        }).then(res => {
          return res.data
        })
      },
      // 获取时间段列表
      getSeasonListAll () {
        this.timeList.splice(0, this.timeList.length)
        this.checkedList.splice(0, this.checkedList.length)
        // this.enableStatus
        return this.$service.tunnel_2d.getSeasonListAll({
          tunnelId: this.tunnelId,
          seasonId: this.schemeChecked
        }).then(res => {
          this.timeList.push(...res.data.map(item => {
            if (item.enableStatus == 1) {
              this.checkedList.push(item.id)
            }
            return item
          }))
          // return this.timeList
        })
      },
      // 季节选择
      async handleSchemeSelect (item) {
        if (this.schemeChecked === item.id) {
          return
        }
        this.schemeChecked = item.id
        let list = await this.getSeasonListAll()
        // await this.getDevicebookinfoList()
      },
      getListAll () {
        let year = new Date().getFullYear()
        this.seasonList.splice(0, this.seasonList.length)
        return this.$service.tunnel_2d.getListAll().then(res => {
          this.seasonList.push(...res.data.map(item => {
            return {
              ...item,
              fullDate: year + '-' + item.startDate + '至' + year + '-' + item.endDate
            }
          }))
          this.schemeChecked = this.seasonList[0].id
        })
      },
      handleCancel () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
.t-modal-series {
  width: 870px;
  height: 880px;
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
      height: 567px;
      padding: 0 10px;
      // box-sizing: border-box;
      // border: 1px solid red;
      overflow-y: auto;
      .scroll-content {
        padding: 20px;
        box-sizing: border-box;
        .time-item {
          border: 1px solid #4E58ED;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          padding: 10px;
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
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #5DA0FE;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
    background: #0B0A30;
    border: 1px solid #1D2388;
    margin-top: 26px;
    box-sizing: border-box;
    .lighting-top-part3 {
      color: #5DA0FE;
      font-size: 16px;
      padding: 10px 24px;
    }
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
