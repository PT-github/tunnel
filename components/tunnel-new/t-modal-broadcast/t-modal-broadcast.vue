<!-- 隧道广播 -->
<template>
  <view class="t-modal-broadcast">
    <view class="header">
      <text>隧道广播设置</text>
      <text class="close" @tap="handleCancel">x</text>
    </view>
    
    <view class="flex-box">
      <view class="left" v-if="!type">
        <view class="title">
          <text>隧道广播列表</text>
        </view>
        
        <view class="operation">
          
          <text :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)" v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</text>
          <text :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)" v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</text>
          <view class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 3.9062rpx;" @click="handleAllSelect(1)">
            全选
          </view>
          <view class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
            反选
          </view>
        </view>
        
        <view class="input-area">
          <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
        </view>
        
        <view class="filter">
          <text :class="{active: form.workMode === 0}" @click="switchWorkMode(0)">空闲</text>
          <text :class="{active: form.workMode === 1}" @click="switchWorkMode(1)">播放中</text>
        </view>
        
        <scroll-view :show-scrollbar="true" scroll-y="true" class="left-scroll">
          <view class="device-item" v-for="(item, index) in deviceList" :key="item.id + '_' + index" :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
            <view class="device-title" :style="getStyle(item)">
              <text>{{ item.workModeName }}</text>
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
        </scroll-view>
        
      </view>
      <view class="right">
        <view class="content-area">
          <view class="area-top">
            <view class="title">
              <text>报警广播</text>
              <text class="num">{{ warnList.length }}</text>
            </view>
            <view class="button">
              <text @click="handleAdd(2)">新增广播</text>
            </view>
          </view>
          
          <scroll-view class="area-scroll" scroll-y="true" >
            <view class="audio-item" v-for="(item, index) in warnList" :key="item.id + '-' + index" @click="selectBroad(item)">
              <view class="checkbox" :class="{active: checkedBroadIds.indexOf(item.id) !== -1}">
                <icon class="checked" :size="getRealPx(12)" color="#2B79E3" type="success_no_circle"/>
              </view>
              <view class="text">
                <text>{{ item.templetName }}</text>
              </view>
              <view class="listen-btn" @click.stop="listenMp3(item.templetText)">
                <text>试听</text>
              </view>
            </view>
          </scroll-view>
          <view class="info">
            <text>点击击以添加到节目单</text>
          </view>
        </view>
        
        <view class="content-area">
          <view class="area-top">
            <view class="title">
              <text>选中播放的广播</text>
            </view>
          </view>
          
          <scroll-view :show-scrollbar="true" class="area-scroll" scroll-y="true" style="height: 87.8905rpx">
            <view class="audio-item" v-for="(item, index) in checkedBroadList" :key="item.id + '-' + index">
              <view class="text">
                <text>{{ item.templetName }}</text>
              </view>
              <view class="listen-btn" @click.stop="listenMp3(item.templetText)">
                <text>试听</text>
              </view>
              <view class="listen-btn del-btn">
                <text @click="removeSelected(item.id)">删除</text>
              </view>
            </view>
          </scroll-view>
        </view>
      
        <view class="content-area">
          <view class="area-top">
            <view class="title">
              <text>通知广播</text>
              <text class="num">{{ noticeList.length }}</text>
            </view>
            <view class="button">
              <text @click="handleAdd(3)">新增广播</text>
            </view>
          </view>
          
          <scroll-view :show-scrollbar="true" class="area-scroll" scroll-y="true" >
            <view class="audio-item" v-for="(item, index) in noticeList" :key="item.id + '-' + index" @click="selectBroad(item)">
              <view class="checkbox" :class="{active: checkedBroadIds.indexOf(item.id) !== -1}">
                <icon class="checked" :size="getRealPx(12)" color="#2B79E3" type="success_no_circle"/>
              </view>
              <view class="text">
                <text>{{ item.templetName }}</text>
              </view>
              <view class="listen-btn" @click.stop="listenMp3(item.templetText)">
                <text>试听</text>
              </view>
            </view>
          </scroll-view>
          <view class="info">
            <text>点击击以添加到节目单</text>
          </view>
        </view>
      
        <view class="content-area">
          <view class="area-top">
            <view class="title">
              <text>控制区域</text>
            </view>
          </view>
          
          <view class="control-content">
            <view class="control-part1">
              <text :class="{active: controlType === 1}" @click="controlType = 1">播放</text>
              <text :class="{active: controlType === 2}" @click="controlType = 2">停止定时</text>
              <text :class="{active: controlType === 0}" @click="controlType = 0">停止播放</text>
            </view>
            
            <view class="control-part2" v-if="controlType === 1">
              <!--  @click="isSetTime = !isSetTime" -->
              <text :class="{ active: isSetTime }">定时播放</text>
              <!-- <text>取消播放</text> -->
            </view>
            
            <view class="control-time" v-if="controlType === 1 && isSetTime">
              <!-- start="09:01" end="21:01" -->
              <picker mode="time" :value="sDate" @change="bindTimeChange">
                <view class="uni-input">{{sDate}}</view>
              </picker>
              <text class="separation">至</text>
              <picker mode="time" :value="eDate" @change="bindTimeChange($event, true)">
                <view class="uni-input">{{eDate}}</view>
              </picker>
            </view>
            
          </view>
          
        </view>
              
        <view class="submit-area">
          <text @tap="handleCancel">取消</text>
          <text class="active" @click="handleSubmit">执行</text>
        </view>
      </view>
    </view>
    <t-modal-control v-model="showAddModal">
      <view class="add-modal-broad">
        <view class="header">
          <text>新增{{ uploadForm.boardcastFileType === 2 ? '报警' : '通知' }}广播</text>
          <text class="close" @tap="handleHideUploadModal">x</text>
        </view>
        <view class="form-control">
          <view class="label">
            <text>广播名称：</text>
          </view>
          <view class="value">
            <input v-model="uploadForm.boardcastFileName" :disabled="true" type="text" placeholder="请输入广播文件名称" />
          </view>
        </view>
        <view class="form-control" style="padding-bottom: 11.7187rpx;">
          <view class="label">
            <text>广播文件：</text>
          </view>
          <view class="value">
            <input type="text" v-model="uploadForm.boardcastFilePath" :disabled="true" placeholder="请选择需要上传的广播文件" />
            <view class="upload" @click="show=true">选择文件</view>
          </view>
        </view>
        <view class="submit-area">
          <text @tap="handleHideUploadModal">取消</text>
          <text class="active" @click="handleUpload">保存</text>
        </view>
        <nk-select-file v-model="show" @confirm="getPath"></nk-select-file>
      </view>
    </t-modal-control>
  </view>
</template>

<script>
  import config from '../../config/index.js'
  export default {
    name:"t-modal-broadcast",
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
      // 单个广播设备弹窗 type为'single'
      type: String,
      // 单个广播设备弹窗 设备数据
      deviceData: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        show: false,
        pathArr: null,
        showAddModal: false,
        
        windowWidth: wx.getSystemInfoSync().windowWidth,
        sDate: '08:00',
        eDate: '18:00',
        
        form: {
          workMode: null, // 工作模式
          leftRightFlag: null, // 左右洞标识
          deviceName: null, // 设备名称或桩号
          tunnelId: null, // 隧道ID
          classifyNumber: 'broadcast' // 分类
        },
        
        checkedAll: null, // 全选1/反选0
        deviceList: [],
        checkedList: [], // 已选设备列表
        workMode: [], // 控制模式
        workModeChecked: null, // 已选控制模式
        
        warnList: [], // 报警列表
        noticeList: [], // 通知列表
        
        checkedBroadList: [], // 已选广播列表
        
        controlType: 1, // 控制 播放：1；停止播放：0；停止定时播放：2
        isSetTime: true, // 是否定时播放
        
        uploadForm: {
          boardcastFileName: '',
          boardcastFilePath: '',
          boardcastFileType: 2, // 广播文件类型2:报警广播 3:通知广播
        },
        deviceTypeCode: 'broadcast'
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
      checkedBroadIds () {
        return this.checkedBroadList.map(item => item.id)
      }
    },
    async created () {
      this.form.tunnelId = this.tunnelId
      uni.showLoading({
        title: '加载中'
      })
      if (!this.type) {
        await this.getDeviceList()
      } else {
        this.checkedList.push(this.deviceData.id)
      }
      await this.getWarnBroadcastList()
      await this.getNoticeBroadcastList()
      uni.hideLoading()
    },
    methods: {
      listenMp3 (url) {
        const innerAudioContext = uni.createInnerAudioContext();
        innerAudioContext.autoplay = true;
        innerAudioContext.src = url // 'http://downsc.chinaz.net/Files/DownLoad/sound1/201906/11582.mp3';
        innerAudioContext.onPlay(() => {
          console.log('开始播放');
        });
        innerAudioContext.onError((res) => {
          console.log(res.errMsg);
          console.log(res.errCode);
        })
      },
      handleHideUploadModal () {
        this.showAddModal = false
        // 清空数据
        this.uploadForm.boardcastFileName = ''
        this.uploadForm.boardcastFilePath = ''
      },
      getPath(file){
        // file:{name: this.fileArr[index].name, url: Path, sizeMB: sizeMb}
        
        console.log('======', file)
        
      	this.pathArr = file
        let now = new Date(), self = this
        let uploadDate = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate()
        uni.showLoading({
          title: '加载中'
        })
        uni.uploadFile({
          url: `${config.baseUrl}/tunnel/rest/file/commonUploadFileReturnPath`,
          filePath: file[0].url,
          name: 'file',
          header: {
            jwt: this.$store.state.myUserInfo.jwt
          },
          formData: {
            uploadDate,
            busType: 'BroadCast',
          },
          complete: () => {
            uni.hideLoading()
          },
          fail: res => {
            console.log(res, '文件上传失败')
            uni.showToast({
              icon: 'error',
              title: '文件上传失败'
            })
          },
          success: (res) => {
            console.log(res, '000000000')
            if (res.statusCode === 200) {
              try{
                let ret = JSON.parse(res.data)
                if (ret.status === 1) {
                  console.log('*****',ret.data, '*****', ret)
                  self.uploadForm.boardcastFilePath = ret.data
                  self.uploadForm.boardcastFileName = file[0].name
                } else {
                  uni.showToast({
                    icon: 'error',
                    title: ret.message || '文件上传失败'
                  })
                }
              }catch(e){
                uni.showToast({
                  icon: 'error',
                  title: ret.message || '文件上传失败'
                })
              }
              // 文件上传成功 {data: url}
              // self.uploadForm.boardcastFilePath = res.data
            } else {
              uni.showToast({
                icon: 'error',
                title: res.errMsg || '文件上传失败'
              })
            }
          }
        })
      },
      handleUpload () {
        if (!this.uploadForm.boardcastFileName) {
          return uni.showToast({
            icon:'none',
            title: '请输入广播名称'
          })
        }
        this.uploadForm.boardcastFilePath='000000'
        if (!this.uploadForm.boardcastFilePath) {
          return uni.showToast({
            icon:'none',
            title: '请选择广播文件'
          })
        }
        uni.showLoading({
          title: '保存中'
        })
        this.$request.saveDeviceCriticalBroadcast(this.uploadForm).then(res => {
          if (res.status === 1) {
            uni.showToast({
              icon:'success',
              title: '新增广播成功'
            })
            let refreshFun = this.getNoticeBroadcastList
            if (this.uploadForm.boardcastFileType === 2) {
              refreshFun = this.getWarnBroadcastList
            }
            refreshFun().then(() => {
              this.showAddModal = false
              this.$nextTick(function(){
                uni.hideLoading()
              })
            })
          } else {
            uni.hideLoading()
          }
        })
      },
      // 2 报警； 3 通知
      handleAdd (f) {
        this.uploadForm.boardcastFileType = f
        this.showAddModal = true
      },
      handleSubmit () {
        // controlType: 1, // 控制 播放：1；停止播放：0；停止定时播放：2
        if (this.controlType === 2) {
          this.$request.criticalBroadTimedPlaybackShop(this.tunnelId).then(res => {
            if (res.status === 1) {
              uni.showToast({
                title: '已关闭定时播放',
                icon: 'success'
              })
              this.$emit('update-devices', [], 'broadcast')
              this.handleCancel()
            }
          })
        } else if (this.controlType === 0){
          if (!this.checkedList.length) {
            return uni.showToast({
              title: '请选择设备',
              icon: 'none'
            })
          }
          this.$request.closeDeviceCriticalBroadcast(this.checkedList.join(',')).then(res => {
            if (res.status === 1) {
              uni.showToast({
                title: '已停止播放',
                icon: 'success'
              })
              if (this.checkedList.length === 1) {
                this.$emit('update-device', {id: this.checkedList[0]})
              } else {
                this.$emit('update-devices', [], 'broadcast')
              }
              this.handleCancel()
            }
          })
        } else {
          let obj = {
            tempId: this.checkedBroadIds.join(','),
            tunnelId: this.tunnelId,
            sTime: this.sDate,
            eTime: this.eDate,
            deviceId: this.checkedList.join(',')
          }
          if (!this.checkedList.length) {
            return uni.showToast({
              title: '请选择设备',
              icon: 'none'
            })
          }
          if (!this.checkedBroadList.length) {
            return uni.showToast({
              icon: 'none',
              title: '请选择广播'
            })
          }
          // if (this.isSetTime) {
          if (!this.validTime()) {
            return uni.showToast({
              icon: 'none',
              title: '请重新设置时间'
            })
          }
          // } else {
          //   delete obj.sTime
          //   delete obj.eTime
          // }
          this.$request.criticalBroadTimedPlayback(obj).then(res => {
            if (res.status === 1) {
              uni.showToast({
                title: '定时播放成功',
                icon: 'success'
              })
              if (this.checkedList.length === 1) {
                this.$emit('update-device', {id: this.checkedList[0]})
              } else {
                this.$emit('update-devices', [], 'broadcast')
              }
              this.handleCancel()
            }
          })
        }
      },
      // 获取设备列表
      getDeviceList () {
        this.deviceList.splice(0, this.deviceList.length)
        this.checkedList.splice(0, this.checkedList.length) // 清空已选的设备
        this.checkedAll = null
        return this.$request.getSelectDeviceList(this.form).then(res => {
          if (res && res.data) {
            this.deviceList.push(...res.data)
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
      // 勾选广播
      selectBroad (item) {
        let index = this.checkedBroadIds.indexOf(item.id)
        if (index === -1) {
          this.checkedBroadList.push(item)
        } else {
          this.checkedBroadList.splice(index, 1)
        }
      },
      // 删除已选广播
      removeSelected (id) {
        for (let i = 0; i < this.checkedBroadList.length; i++) {
          if (this.checkedBroadList[i].id === id) {
            this.checkedBroadList.splice(i, 1)
            return
          }
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
      switchWorkMode (workMode) {
        if (this.form.workMode === workMode) {
          this.form.workMode = null
        } else {
          this.form.workMode = workMode
        }
        this.getDeviceList()
      },
      // 报警
      getWarnBroadcastList () {
        this.warnList.splice(0, this.warnList.length)
        return this.$request.getDeviceCriticalBroadcastList({
          boardcastFileType: 2
        }).then(res => {
          this.warnList.push(...res.data)
        })
      },
      // 通知
      getNoticeBroadcastList () {
        this.noticeList.splice(0, this.noticeList.length)
        return this.$request.getDeviceCriticalBroadcastList({
          boardcastFileType: 3
        }).then(res => {
          this.noticeList.push(...res.data)
        })
      },
      bindTimeChange(event, f){
        f ? (this.eDate = event.detail.value) : (this.sDate = event.detail.value)
      },
      // 时间校验
      validTime () {
        let [sHour , sMinite] = this.sDate.split(':')
        let [eHour , eMinite] = this.eDate.split(':')
        sHour = parseInt(sHour)
        sMinite = parseInt(sMinite)
        
        eHour = parseInt(eHour)
        eMinite = parseInt(eMinite)
        
        if (sHour > eHour || (sHour === eHour && sMinite > eMinite)) {
          return false
        }
        return true
      },
      
      
      
      handleCancel () {
        this.$emit('close')
      },
      cancel(e){
        console.log(e.time)//取消事件 =>12:30-17:30
      },
      getRealPx(w) {
        var real = 0;
        try {
          var scale = this.windowWidth / 1920
          real = Math.floor(scale * w)
          return real
        } catch (e) {
          return real
        }
      },
    }
  }
</script>

<style lang="scss">
.t-modal-broadcast {
  width: 343.75rpx;
  height: 274.6093rpx;
  box-sizing: border-box;
  background: #0B0A30;
  border: 0.3906rpx solid #1D2388;
  display: flex;
  flex-direction: column;
  
  .add-modal-broad {
    width: 171.875rpx;
    height: 101.5625rpx;//274.6093rpx;
    box-sizing: border-box;
    background: #0B0A30;
    border: 0.3906rpx solid #1D2388;
    .submit-area {
      width: 100%;
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
        & + text {
          margin-left: 3.9062rpx;
        }
      }
    }
    .form-control {
      display: flex;
      align-items: center;
      padding: 11.7187rpx 11.7187rpx 0;
      .label {
        color: #5DA0FE;
        font-size: 5.4687rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
      }
      .value {
        display: flex;
        flex: 1;
        input {
          flex: 1;
          border: 0.3906rpx solid #4E58ED;
          height: 13.2812rpx;
          display: block;
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #5DA0FE;
          padding: 0 6.25rpx;
          box-sizing: border-box;
        }
        .upload {
          background: #3B46E2;
          color: #FFFFFF;
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          padding: 0 3.9062rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
  
  
  .flex-box {
    display: flex;
    flex: 1;
    .left {
      width: 93.75rpx;
      border-right: 0.3906rpx solid #1D2388;
      padding: 6.25rpx 3.9062rpx;
      .title {
        font-size: 5.4687rpx;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
      }
      
      .left-scroll {
        // border: 1px solid red;
        height: 183.5937rpx;
        .device-item {
          width: 100%;// 85.9375rpx;
          height: 54.6875rpx;//46.875rpx;
          background: #120F41;
          border: 0.3906rpx solid #4E58ED;
          position: relative;
          display: flex;
          flex-direction: column;
          margin: 0 auto 3.125rpx;
          box-sizing: border-box;
          &.active {
            border-color: #e7743a;
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
            width: 98%;
            margin: 0 auto 1.1718rpx;
            text {
              display: block;
            }
          }
        }
      }
      
      .filter {
        padding: 1.9531rpx 0;
        text {
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #286BC8;
          display: inline-block;
          height: 8.9843rpx;
          line-height: 8.9843rpx;
          padding: 0 1.9531rpx;
          & + text {
            margin-left: 6.25rpx;
          }
          &.active {
            // color: #FFFFFF;
            font-weight: bold;
            text-decoration: underline;
          }
        }
      }
      
      .input-area {
        input {
          width: 100%;
          height: 13.2812rpx;
          background: #120F41 url(../../static/modal/laneIndicator/sousuo.png) 74.2187rpx center / 7.8125rpx auto no-repeat;
          border: 0.3906rpx solid #4E58ED;
          display: block;
          margin: 5.0781rpx auto 0;
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #5DA0FE;
          padding: 0 12.8906rpx 0 6.25rpx;
          box-sizing: border-box;
        }
      }
      .operation {
        height: 11.7187rpx;
        display: flex;
        align-items: center;
        margin-top: 5.4687rpx;
        text {
          display: inline-block;
          height: 11.7187rpx;
          line-height: 11.7187rpx;
          width: 19.5312rpx;
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
            margin-left: 3.5156rpx;
          }
        }
        .sel-btn {
          height: 11.7187rpx;
          line-height: 11.7187rpx;
          background: url(../../static/modal/laneIndicator/unselected.png) left center / 5.4687rpx auto no-repeat;
          padding-left: 7.8125rpx;
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #286BC8;
          margin-left: 3.9062rpx;
          &.active {
            background-image: url(../../static/modal/laneIndicator/selected.png);
          }
        }
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .submit-area {
        width: 100%;
        padding-right: 3.9062rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
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
          & + text {
            margin-left: 3.9062rpx;
          }
        }
      }
      .content-area {
        width: 115.625rpx;
        height: 107.4218rpx;
        .area-scroll {
          height: 68.3593rpx;
          background: #050425;
          box-sizing: border-box;
          padding: 1.9531rpx 3.9062rpx 0;
          .audio-item {
            display: flex;
            border-bottom: 0.3906rpx dashed #12105E;
            height: 12.8906rpx;
            align-items: center;
            .checkbox {
              width: 5.8593rpx;
              height: 5.8593rpx;
              box-sizing: border-box;
              background: #050425;
              border: 0.3906rpx solid #4E58ED;
              position: relative;
              
              .checked {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: none;
              }
              &.active {
                background: #262477;
                .checked {
                  display: block;
                }
              }
            }
            .text {
              flex: 1;
              // line-height: 68.3593rpx;
              padding: 0 4.2968rpx;
              font-size: 4.6875rpx;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #5DA0FE;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .listen-btn {
              width: 15.625rpx;
              height: 7.8125rpx;
              line-height: 7.8125rpx;
              text-align: center;
              background: #0B0A30;
              border: 0.3906rpx solid #3B46E2;
              border-radius: 1.5625rpx;
              font-size: 4.6875rpx;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #3B46E2;
              &.del-btn {
                border-color: #E7743A;
                color: #E7743A;
              }
              & + .listen-btn {
                margin-left: 3.125rpx;
              }
            }
          }
        }
        .info {
          background: #050425;
          height: 19.5312rpx;
          line-height: 19.5312rpx;
          text-align: center;
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #3B46E2;
        }
        .control-content {
          height: 87.8906rpx;
          background: #050425;
          box-sizing: border-box;
          padding: 9.375rpx 7.0312rpx;
        }
        .control-part1 {
          display: flex;
          justify-content: space-between;
          text {
            width: 31.25rpx;
            height: 11.7187rpx;
            line-height: 11.7187rpx;
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
          }
        }
        
        .control-time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3.9062rpx;
          .separation {
            font-size: 4.6875rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #286BC8;
          }
          uni-picker {
            display: inline-block;
            width: 44.9218rpx;
            height: 10.9375rpx;
            line-height: 10.9375rpx;
            background: #050425;
            border: 0.3906rpx solid #4E58ED;
            color: #286BC8;
            text-align: center;
          }
        }
        
        .control-part2 {
          display: flex;
          margin-top: 3.9062rpx;
          text {
            width: 31.25rpx;
            height: 11.7187rpx;
            line-height: 11.7187rpx;
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
        }
        
        .area-top {
          height: 18.75rpx;
          position: relative;
          .button {
            position: absolute;
            top: 5.4687rpx;
            right: 0;
            width: 31.25rpx;
            height: 9.375rpx;
            line-height: 8.5937rpx;
            text-align: center;
            box-sizing: border-box;
            border-radius: 4.6875rpx;
            background: #0B0A30;
            border: 0.3906rpx solid #4E58ED;
            font-size: 4.6875rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5DA0FE;
          }
          .title {
            font-size: 5.4687rpx;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #5DA0FE;
            padding-left: 7.0312rpx;
            height: 18.75rpx;
            line-height: 18.75rpx;
            position: relative;
          }
          .num {
            font-size: 4.6875rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5DA0FE;
            display: inline-block;
            background: #262477;
            border-radius: 3.9062rpx;
            padding: 0 3.5156rpx;
            height: 7.8125rpx;
            line-height: 7.8125rpx;
            margin-left: 4.2968rpx;
          }
          &::before {
            content: '';
            width: 1.1718rpx;
            height: 3.9062rpx;
            position: absolute;
            top: 8.2031rpx;
            left: 2.7343rpx;
            background: #4E58ED;
          }
        }
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
    padding-left: 19.9218rpx;
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
