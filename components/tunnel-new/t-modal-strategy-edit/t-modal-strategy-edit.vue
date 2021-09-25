<template>
  <div class="t-modal-strategy-edit">
    <div class="header">
      <span>{{ type === 0 ? '新增' : '' }}策略</span>
    </div>
    <div class="strategy-edit-part1">
      <div class="strategy-device" v-if="type === 0 || (type === 1 && stragegyObj.lightIntensity)">
        <div class="sel-btn" :class="{active: selectList.indexOf('1') !== -1}" v-if="type === 0" @click="haneleSelect('1')"></div>
        <div class="strategy-detail">
          <div class="text">
            <span>设备</span>
          </div>
          <div class="strategy-select">
            <div><span><input :disabled="true" type="text" :value="luminanceMeterEquipmentFormat[stragegyObj.lightIntensity] || ''" @click="showDeviceModal" /></span></div>
            <div class="modal" v-show="showDevice" @click="showDevice = false"></div>
            <div class="strategy-select-options" v-show="showDevice">
              <div v-for="(item,index) in luminanceMeterEquipment" :key="'deviceList' + index" @click="hideDevice(item)">
                <span>{{ item.deviceName }}</span>
              </div>
            </div>
          </div>
          <div class="strategy-select">
            <div><span><input class="control" :disabled="true" type="text" :value="controlListFormat[stragegyObj.compare]" @click="showControlModal" /></span></div>
            <div class="modal" v-show="showControl" @click="showControl = false"></div>
            <div class="strategy-select-options" v-show="showControl" style="width: 39.0625rpx">
              <div v-for="(item,index) in controlList" :key="'selectList' + index" @click="hideControl(item)">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div class="strategy-input">
            <span>
              <input class="number" type="number" v-model="stragegyObj.bmps" style="width: 70px" />
            </span>
          </div>
          <div class="text">
            <span>的值</span>
          </div>
        </div>
      </div>
      
      <div class="strategy-device" v-if="type === 0 || (type === 1 && stragegyObj.weatherId)">
        <div class="sel-btn" :class="{active: selectList.indexOf('2') !== -1}" v-if="type === 0" @click="haneleSelect('2')"></div>
        <div class="strategy-detail">
          <div class="text">
            <span>天气情况为</span>
          </div>
          <div class="strategy-select">
            <div><span><input :disabled="true" type="text" :value="stragegyObj.weatherName" @click="showWeatherModal" /></span></div>
            <div class="modal" v-show="showWeather" @click="showWeather = false"></div>
            <div class="strategy-select-options" v-show="showWeather">
              <div v-for="(item,index) in weatherList" :key="'weatherList' + index" @click="hideWeather(item)">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div class="text">
            <span>时</span>
          </div>
        </div>
      </div>
      
      <div class="strategy-device" v-if="type === 0 || (type === 1 && stragegyObj.startTime && stragegyObj.endTime)">
        <div class="sel-btn" :class="{active: selectList.indexOf('3') !== -1}" v-if="type === 0" @click="haneleSelect('3')"></div>
        <div class="strategy-detail">
          <div class="text">
            <span>设置开始时间为</span>
          </div>
          <div class="control-time">
            <picker :disabled="type !== 0" mode="time" :value="stragegyObj.startTime" @change="bindStartTimeChange">
              <div class="uni-input">{{stragegyObj.startTime}}</div>
            </picker>
          </div>
          <div class="text">
            <span>结束时间为</span>
          </div>
          <div class="control-time">
            <picker :disabled="type !== 0" mode="time" :value="stragegyObj.endTime" @change="bindEndTimeChange">
              <div class="uni-input">{{ stragegyObj.endTime }}</div>
            </picker>
          </div>
          <div class="text">
            <span>时间段内</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="lighting-center">
      <div class="lighting-center-part">
        <span class="title">左洞：开启{{ leftDevicesList.length }}个回路；右洞开启{{ rightDevicesList.length }}个回路</span>
        <span v-show="type === 0" class="button" @click="deviceModalShow = true">选择开启设备</span>
      </div>
      
      <div :show-scrollbar="true" class="lighting-center-scroll" scroll-y="true" >
        <div class="scroll-content">
          <div class="device-item" v-for="(item, index) in deviceList" :key="item.id + '-' + index">
            <div class="device-title" :style="getStyle(item)">
              <span>{{ item['workModeName'] }}</span>
            </div>
            <div class="device-info">
              <span>{{ item.deviceName }}</span>
              <span>{{ item.pileNumberStr }}</span>
            </div>
            <div class="device-value">
              <t-slider disabled :value="item.brightNess"></t-slider>
            </div>
            <div class="status" :class="{on: item.deviceCommunicationsState === 0}"></div>
          </div>
          <div class="no-data" v-if="!deviceList.length">
            <img src="../../../assets/tunnel/no-data.png" mode="widthFix">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="lighting-submit">
      <span class="cancel" @click="handleCancel">取消</span>
      <span class="start" @click="handleSubmit" v-if="type === 0">保存</span>
    </div>
    <t-modal-control v-model="deviceModalShow">
      <!-- 选择照明设备弹窗 -->
      <t-modal-deviceSelect :show="deviceModalShow" :tunnelId="tunnelId" :tunnelInfoData="tunnelInfoData" :classifyId="classifyId" :checkedIds="checkedList" @close="deviceModalShow = false" @batch-add="handleBatchAdd"></t-modal-deviceSelect>
    </t-modal-control>
  </div>
</template>

<script>
import tModalDeviceSelect from '../t-modal-deviceSelect/t-modal-deviceSelect'
import tModalControl from '../t-modal-control/t-modal-control.vue'
import tSlider from '../t-slider/t-slider.vue'
import picker from '../t-slider/picker.vue'
  export default {
    name:"t-modal-strategy-edit",
    components: {
      tModalDeviceSelect,
      tModalControl,
      tSlider,
      picker
    },
    services: ["_2d", "tunnel", "tunnel_2d"],
    props: {
      // 0 策略新增； 1 策略查看
      type: {
        type: Number,
        default: 0
      },
      // 当前策略数据
      currentData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // 天气列表
      weatherList: {
        type: Array,
        default: () => []
      },
      // 光强列表
      luminanceMeterEquipment: {
        type: Array,
        default: () => []
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
    },
    data() {
      return {
        showDevice: false, // 设备选择下拉控制
        showControl: false, // 逻辑下拉控制
        showWeather: false, // 天气下拉控制
        controlList: [
          { id: 0, name: '大于等于' },
          { id: 1, name: '小于等于' },
          { id: 2, name: '大于' },
          { id: 3, name: '小于' },
        ],
        stragegyObj: {}, // 当前新增/编辑策略数据
        selectList: [],
        
        deviceModalShow: false,
        deviceTypeCode: 'lighting'
      };
    },
    computed: {
      checkedList () {
        return this.deviceList.map(item => item.id)
      },
      deviceList () {
        return this.stragegyObj.deviceList || []
      },
      leftDevicesList () {
        return this.stragegyObj.leftDevicesList || []
      },
      rightDevicesList () {
        return this.stragegyObj.rightDevicesList || []
      },
      controlListFormat () {
        let obj = {}
        this.controlList.forEach(item => {
          obj[item.id] = item.name
        })
        return obj
      },
      luminanceMeterEquipmentFormat () {
        let obj = {}
        this.luminanceMeterEquipment.forEach(item => {
          obj[item.id] = item.deviceName
        })
        return obj
      },
    },
    created() {
      this.setData()
    },
    watch: {
      show (v) {
        if (v) {
          this.setData()
        }
      }
    },
    methods: {
      handleBatchAdd (idList, deviceList) {
        this.$set(this.stragegyObj, 'deviceList', deviceList)
        this.$set(this.stragegyObj, 'leftDevicesList', deviceList.filter(item => item.leftRightFlag === 2))
        this.$set(this.stragegyObj, 'rightDevicesList', deviceList.filter(item => item.leftRightFlag === 1))
        //
        this.$nextTick(function(){
          this.deviceModalShow = false
        })
      },
      async handleSubmit () {
        if (!this.selectList.length) {
          return this.$message.warning("请选择一项条件")
        }
        let obj = {
          bmps: this.stragegyObj.bmps,
          compare: this.stragegyObj.compare,
          enableStatus: 0,
          endTime: this.stragegyObj.endTime,
          name: '',
          lightIntensity: this.stragegyObj.lightIntensity,
          startTime: this.stragegyObj.startTime,
          tunnelId: this.tunnelId,
          weatherId: this.stragegyObj.weatherId,
          weatherName: this.stragegyObj.weatherName,
          installLocation: '',
          leftRightFlag: 0,
          leftRightFlagName: '',
          tunnelName: ''
        }
        // 校验数据
        if (this.selectList.indexOf('1') !== -1) {
          if (!this.stragegyObj.lightIntensity) {
            return this.$message.warning("请选择设备")
          }
        } else {
          obj.bmps = 0
          obj.compare = 0
          obj.lightIntensity = ''
        }
        if (this.selectList.indexOf('2') !== -1) {
          if (!this.stragegyObj.weatherId) {
            return this.$message.warning("请选择天气")
          }
        } else {
          obj.weatherId = ''
          obj.weatherName = ''
        }
        if (this.selectList.indexOf('3') !== -1) {
          if (!this.validTime(this.stragegyObj.startTime, this.stragegyObj.endTime,)) {
            return this.$message.warning("请重新设置时间")
          }
        } else {
          obj.startTime = ''
          obj.endTime = ''
        }
        if (!this.stragegyObj.deviceList.length) {
          return this.$message.warning("请选择开启设备")
        }
        
        try{
          let modeData = await this.insertStrategy(obj) // '0acef50a-dc81-4ffc-bc82-6b03afeb3de6'; //
          await this.bindStrategyDevice(modeData.data)
          this.$emit('update')
          this.$nextTick(function(){
            this.handleCancel()
          })
        }catch(e){
          //TODO handle the exception
          console.log(e)
        }
      },
      // 时间校验
      validTime (sDate, eDate) {
        let [sHour , sMinite] = sDate.split(':')
        let [eHour , eMinite] = eDate.split(':')
        sHour = parseInt(sHour)
        sMinite = parseInt(sMinite)
        
        eHour = parseInt(eHour)
        eMinite = parseInt(eMinite)
        
        if (sHour > eHour || (sHour === eHour && sMinite > eMinite)) {
          return false
        }
        return true
      },
      // 新增策略
      insertStrategy (obj) {
        return this.$service.tunnel_2d.insertStrategy(obj)
      },
      bindStrategyDevice (modeId) {
        let deviceList = this.stragegyObj.deviceList, arry = []
        deviceList.forEach(item => {
          arry.push({
            deviceId: item.id,
            leftRightFlag: item.leftRightFlag,
            modeId
          })
        })
        console.log('=====')
        return this.$service.tunnel_2d.bindStrategyDevice(arry)
      },
      haneleSelect (f) {
        let idx = this.selectList.indexOf(f)
        if (idx === -1) {
          this.selectList.push(f)
        } else {
          this.selectList.splice(idx, 1)
        }
      },
      // 设置数据
      setData () {
        if (this.type === 1) {
          this.$set(this, 'stragegyObj', this.currentData ? JSON.parse(JSON.stringify(this.currentData)) : {})
        } else {
          this.$set(this, 'stragegyObj', {
            lightIntensity: this.luminanceMeterEquipment.length ? this.luminanceMeterEquipment[0].id : '', // 设备ID
            compare: 0,
            bmps: 0,
            startTime: '8:00',
            endTime: '9:00',
            weatherId: this.weatherList.length ? this.weatherList[0].dictionaryId : '',
            weatherName: this.weatherList.length ? this.weatherList[0].name : '',
            deviceList: []
          })
        }
      },
      showDeviceModal () {
        if (this.type === 0) {
          this.showDevice = true
        }
      },
      showControlModal () {
        if (this.type === 0) {
          this.showControl = true
        }
      },
      showWeatherModal () {
        if (this.type === 0) {
          this.showWeather = true
        }
      },
      hideDevice (item) {
        this.$set(this.stragegyObj, 'lightIntensity', item.id)
        this.showDevice = false
      },
      hideControl (item) {
        this.$set(this.stragegyObj, 'compare', item.id)
        this.showControl = false
      },
      hideWeather (item) {
        this.$set(this.stragegyObj, 'weatherId', item.dictionaryId)
        this.$set(this.stragegyObj, 'weatherName', item.name)
        this.showWeather = false
      },
      bindStartTimeChange (v) {
        this.$set(this.stragegyObj, 'startTime', v)
      },
      bindEndTimeChange (v) {
        this.$set(this.stragegyObj, 'endTime', v)
      },
      handleCancel () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
.t-modal-strategy-edit {
  width: 871px;
  height: 900px;//720px;
  background: url(../../../assets/tunnel/modal/laneIndicator/bg.png) center center / 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  padding: 14px 36px 0;
  box-sizing: border-box;
  .modal {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
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
        flex-direction: row;
        // justify-content: center;
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
            margin-right: 5px;//22px;//28px;
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
  
  .strategy-device {
    display: flex;
    align-items: center;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .strategy-detail {
      flex: 1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .control-time {
        uni-picker {
          display: inline-block;
          width: 115px;
          height: 30px;
          // line-height: 28px;
          background: #0B0A30;
          border: 2px solid #4E58ED;
          color: #5DA0FE;
          text-align: center;
          border-radius: 4px;
          margin: 0 5px;
          box-sizing: border-box;
        }
        .uni-input {
          height: 28px;
          line-height: 28px;
          
        }
      }
      .text {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
      }
      .strategy-select, .strategy-input {
        position: relative;
        color: #5DA0FE;
        font-size: 14px;
        margin: 0 5px;
        input {
          font-size: 14px;
          background: #0B0A30;
          border: 2px solid #4E58ED;
          width: 150px;
          padding: 0 10px;
          text-align: center;
          box-sizing: border-box;
          border-radius: 4px;
          height: 30px;
          line-height: 28px;
          color: #5DA0FE;
          &.control {
            width: 100px;
          }
          &.number {
            width: 50px;
          }
        }
      }
      .strategy-select-options {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #120F41;
        z-index: 101;
        border-radius: 2px;
        padding: 10px;
        border: 1px solid #4E58ED;
        width: 50px;
        min-width: 98%;
        box-sizing: border-box;
        text-align: center;
      }
    }
    .sel-btn {
      width: 30px;
      height: 30px;
      background: url(../../../assets/tunnel/modal/laneIndicator/unselected.png) center center / 18px auto no-repeat;
      &.active {
        background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
      }
    }
  }
  .strategy-edit-part1 {
    background: #0B0A30;
    border: 1px solid #1D2388;
    margin-top: 25px;
    box-sizing: border-box;
    padding: 16px;
  }
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
