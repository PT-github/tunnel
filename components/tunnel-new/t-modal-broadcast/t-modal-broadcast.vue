<!-- 隧道广播 -->
<template>
  <div class="t-modal-broadcast">
    <div class="header">
      <span>隧道广播设置</span>
      <span class="close" @click="handleCancel">x</span>
    </div>
    
    <div class="flex-box">
      <div class="left" v-if="!type">
        <div class="title">
          <span>隧道广播列表</span>
        </div>
        
        <div class="operation">
          
          <span :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)" v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</span>
          <span :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)" v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</span>
          <div class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 9px;" @click="handleAllSelect(1)">
            全选
          </div>
          <div class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
            反选
          </div>
        </div>
        
        <div class="input-area">
          <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
        </div>
        
        <div class="filter">
          <span :class="{active: form.workMode === 0}" @click="switchWorkMode(0)">空闲</span>
          <span :class="{active: form.workMode === 1}" @click="switchWorkMode(1)">播放中</span>
        </div>
        
        <div :show-scrollbar="true" scroll-y="true" class="left-scroll">
          <div class="device-item" v-for="(item, index) in deviceList" :key="item.id + '_' + index" :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
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
            <img src="../../../assets/tunnel/no-data.png" mode="widthFix">
            <span>暂无数据</span>
          </div>
        </div>
        
      </div>
      <div class="right">
        <div class="content-area">
          <div class="area-top">
            <div class="title">
              <span>报警广播</span>
              <span class="num">{{ warnList.length }}</span>
            </div>
            <div class="button">
              <span @click="handleAdd(2)">新增广播</span>
            </div>
          </div>
          
          <div class="area-scroll" scroll-y="true" >
            <div class="audio-item" v-for="(item, index) in warnList" :key="item.id + '-' + index" @click="selectBroad(item)">
              <div class="checkbox" :class="{active: checkedBroadIds.indexOf(item.id) !== -1}">
                <span class="el-icon-check checked"></span>
              </div>
              <div class="text">
                <span>{{ item.templetName }}</span>
              </div>
              <div class="listen-btn" @click.stop="listenMp3(item.templetText)">
                <span>试听</span>
              </div>
            </div>
          </div>
          <div class="info">
            <span>点击击以添加到节目单</span>
          </div>
        </div>
        
        <div class="content-area">
          <div class="area-top">
            <div class="title">
              <span>选中播放的广播</span>
            </div>
          </div>
          
          <div :show-scrollbar="true" class="area-scroll" scroll-y="true" style="height: 225px">
            <div class="audio-item" v-for="(item, index) in checkedBroadList" :key="item.id + '-' + index">
              <div class="text">
                <span>{{ item.templetName }}</span>
              </div>
              <div class="listen-btn" @click.stop="listenMp3(item.templetText)">
                <span>试听</span>
              </div>
              <div class="listen-btn del-btn">
                <span @click="removeSelected(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      
        <div class="content-area">
          <div class="area-top">
            <div class="title">
              <span>通知广播</span>
              <span class="num">{{ noticeList.length }}</span>
            </div>
            <div class="button">
              <span @click="handleAdd(3)">新增广播</span>
            </div>
          </div>
          
          <div :show-scrollbar="true" class="area-scroll" scroll-y="true" >
            <div class="audio-item" v-for="(item, index) in noticeList" :key="item.id + '-' + index" @click="selectBroad(item)">
              <div class="checkbox" :class="{active: checkedBroadIds.indexOf(item.id) !== -1}">
                <span class="el-icon-check checked"></span>
              </div>
              <div class="text">
                <span>{{ item.templetName }}</span>
              </div>
              <div class="listen-btn" @click.stop="listenMp3(item.templetText)">
                <span>试听</span>
              </div>
            </div>
          </div>
          <div class="info">
            <span>点击击以添加到节目单</span>
          </div>
        </div>
      
        <div class="content-area">
          <div class="area-top">
            <div class="title">
              <span>控制区域</span>
            </div>
          </div>
          
          <div class="control-content">
            <div class="control-part1">
              <span :class="{active: controlType === 1}" @click="controlType = 1">播放</span>
              <span :class="{active: controlType === 2}" @click="controlType = 2">停止定时</span>
              <span :class="{active: controlType === 0}" @click="controlType = 0">停止播放</span>
            </div>
            
            <div class="control-part2" v-if="controlType === 1">
              <!--  @click="isSetTime = !isSetTime" -->
              <span :class="{ active: isSetTime }">定时播放</span>
              <!-- <span>取消播放</span> -->
            </div>
            
            <div class="control-time" v-if="controlType === 1 && isSetTime">
              <!-- start="09:01" end="21:01" -->
              <picker mode="time" :value="sDate" width="115px" @change="bindTimeChange">
                <div class="uni-input">{{sDate}}</div>
              </picker>
              <span class="separation">至</span>
              <picker mode="time" :value="eDate" width="115px" @change="bindTimeChange2">
                <div class="uni-input">{{eDate}}</div>
              </picker>
            </div>
            
          </div>
          
        </div>
              
        <div class="submit-area">
          <span @click="handleCancel">取消</span>
          <span class="active" @click="handleSubmit">执行</span>
        </div>
      </div>
    </div>
    <t-modal-control v-model="showAddModal">
      <div class="add-modal-broad">
        <div class="header">
          <span>新增{{ uploadForm.boardcastFileType === 2 ? '报警' : '通知' }}广播</span>
          <span class="close" @click="handleHideUploadModal">x</span>
        </div>
        <div class="form-control">
          <div class="label">
            <span>广播名称：</span>
          </div>
          <div class="value">
            <input v-model="uploadForm.boardcastFileName" :disabled="true" type="text" placeholder="请输入广播文件名称" />
          </div>
        </div>
        <div class="form-control" style="padding-bottom: 30px;">
          <div class="label">
            <span>广播文件：</span>
          </div>
          <div class="value">
            <input type="text" v-model="uploadForm.boardcastFilePath" :disabled="true" placeholder="请选择需要上传的广播文件" />
            <!-- <div class="upload" @click="show=true">选择文件</div> -->
            <el-upload
              class="upload-demo"
              ref="upload"
              :show-file-list="false"
              :action="action"
              :headers="headers"
              :data="uploadData"
              :limit="1"
              :file-list="fileList"
              :before-upload="beforeUpload"
              :on-success="handleFileSuccess"
              :on-error="handleFileError">
              <el-button size="small" type="primary">选择文件</el-button>
            </el-upload>
          </div>
        </div>
        <div class="submit-area">
          <span @click="handleHideUploadModal">取消</span>
          <span class="active" @click="handleUpload">保存</span>
        </div>
        <!-- <nk-select-file v-model="show" @confirm="getPath"></nk-select-file> -->
      </div>
    </t-modal-control>
  </div>
</template>

<script>
  import * as config from '@/utils/constant'
  import tModalControl from "../t-modal-control/t-modal-control";
  import picker from '../t-slider/picker'
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name:"t-modal-broadcast",
    components: {
      tModalControl,
      picker
    },
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
      let now = new Date()
      let uploadDate = now.getFullYear() + '' + (now.getMonth() + 1) + '' + now.getDate()
      return {
        uploadData: {
          uploadDate,
          busType: 'BroadCast',
        },
        action: `${config.BASE_SERVER}/tunnel/rest/file/commonUploadFileReturnPath`,
        headers: {
          jwt: this.$store.state.myUserInfo.jwt
        },
        fileList: [],
        show: false,
        pathArr: null,
        showAddModal: false,
        
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
      this.$ctx.showLoading('加载中...');
      if (!this.type) {
        await this.getDeviceList()
      } else {
        this.checkedList.push(this.deviceData.id)
      }
      await this.getWarnBroadcastList()
      await this.getNoticeBroadcastList()
      this.$ctx.hideLoading()
    },
    methods: {
      beforeUpload () {
        this.$ctx.showLoading('正在上传...');
        return true
      },
      handleFileSuccess (res, file) {
        console.log(file, '====')
        if (res.status !== 1) {
          this.$refs.upload.clearFiles()
          this.$message.warning("文件上传失败:" + res.message)
        } else {
          this.$notifySuccess('文件上传成功')
          this.uploadForm.boardcastFilePath = res.data
          this.uploadForm.boardcastFileName = file.name
        }
        this.$ctx.hideLoading()
      },
      handleFileError () {
        this.$message.warning("文件上传失败")
        this.$refs.upload.clearFiles()
        this.$ctx.hideLoading()
      },
      listenMp3 (url) {
        let audio = new Audio()
        audio.src = url
        // audio.play()
        audio.addEventListener('playing', function () {
          console.log('正在播放')
        })
        audio.addEventListener('error', function (e) {
          console.log('播放失败', e)
        })
        audio.play()
      },
      handleHideUploadModal () {
        this.showAddModal = false
        // 清空数据
        this.uploadForm.boardcastFileName = ''
        this.uploadForm.boardcastFilePath = ''
      },
      handleUpload () {
        if (!this.uploadForm.boardcastFileName || !this.uploadForm.boardcastFilePath) {
          return this.$message.warning("请选择广播文件")
        }
        this.$ctx.showLoading('保存中...');
        this.$service.tunnel_2d.saveDeviceCriticalBroadcast(this.uploadForm).then(res => {
          if (res.status === 1) {
            this.$notifySuccess('新增广播成功')
            let refreshFun = this.getNoticeBroadcastList
            if (this.uploadForm.boardcastFileType === 2) {
              refreshFun = this.getWarnBroadcastList
            }
            refreshFun().then(() => {
              this.showAddModal = false
              this.$nextTick(function(){
                this.$ctx.hideLoading()
              })
            })
          } else {
            this.$ctx.hideLoading()
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
          this.$ctx.showLoading('执行中...');
          this.$service.tunnel_2d.criticalBroadTimedPlaybackShop(this.tunnelId).then(res => {
            if (res.status === 1) {
              this.$notifySuccess('已关闭定时播放')
              this.$emit('update-devices', [], 'broadcast')
              this.handleCancel()
              this.$ctx.hideLoading()
            }
          }).catch(() => {
            this.$ctx.hideLoading()
          })
        } else if (this.controlType === 0){
          if (!this.checkedList.length) {
            return this.$message.warning("请选择设备")
          }
          this.$ctx.showLoading('执行中...')
          this.$service.tunnel_2d.closeDeviceCriticalBroadcast(this.checkedList.join(',')).then(res => {
            if (res.status === 1) {
              this.$notifySuccess('已停止播放')
              if (this.checkedList.length === 1) {
                this.$emit('update-device', {id: this.checkedList[0]})
              } else {
                this.$emit('update-devices', [], 'broadcast')
              }
              this.handleCancel()
              this.$ctx.hideLoading()
            }
          }).catch(() => {
            this.$ctx.hideLoading()
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
            return this.$message.warning("请选择设备")
          }
          if (!this.checkedBroadList.length) {
            return this.$message.warning("请选择广播")
          }
          // if (this.isSetTime) {
          if (!this.validTime()) {
            return this.$message.warning("请重新设置时间")
          }
          // } else {
          //   delete obj.sTime
          //   delete obj.eTime
          // }
          this.$ctx.showLoading('执行中...')
          this.$service.tunnel_2d.criticalBroadTimedPlayback(obj).then(res => {
            if (res.status === 1) {
              this.$notifySuccess('定时播放成功')
              if (this.checkedList.length === 1) {
                this.$emit('update-device', {id: this.checkedList[0]})
              } else {
                this.$emit('update-devices', [], 'broadcast')
              }
              this.handleCancel()
              this.$ctx.hideLoading()
            }
          }).catch(() => {
            this.$ctx.hideLoading()
          })
        }
      },
      // 获取设备列表
      getDeviceList () {
        this.deviceList.splice(0, this.deviceList.length)
        this.checkedList.splice(0, this.checkedList.length) // 清空已选的设备
        this.checkedAll = null
        return this.$service.tunnel_2d.getSelectDeviceList(this.form).then(res => {
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
        return this.$service.tunnel_2d.getDeviceCriticalBroadcastList({
          boardcastFileType: 2
        }).then(res => {
          this.warnList.push(...res.data)
        })
      },
      // 通知
      getNoticeBroadcastList () {
        this.noticeList.splice(0, this.noticeList.length)
        return this.$service.tunnel_2d.getDeviceCriticalBroadcastList({
          boardcastFileType: 3
        }).then(res => {
          this.noticeList.push(...res.data)
        })
      },
      bindTimeChange(v){
        this.sDate = v
      },
      bindTimeChange2(v){
        this.eDate = v
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
        return w
      },
    }
  }
</script>

<style lang="scss">
.t-modal-broadcast {
  width: 880px;
  height: 703px;
  box-sizing: border-box;
  background: #0B0A30;
  border: 1px solid #1D2388;
  display: flex;
  flex-direction: column;
  .upload-demo {
    .el-button {
      background: #3B46E2;
      border-color: #3B46E2;
      color: #FFFFFF;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      padding: 0 10px;
      height: 34px;
      line-height: 32px;
      border-radius: 0;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
    }
  }
  
  .add-modal-broad {
    width: 440px;
    height: 260px;//703px;
    box-sizing: border-box;
    background: #0B0A30;
    border: 1px solid #1D2388;
    .submit-area {
      width: 100%;
      padding-right: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      span {
        width: 80px;
        height: 34px;
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
          margin-left: 10px;
        }
      }
    }
    .form-control {
      display: flex;
      align-items: center;
      padding: 30px 30px 0;
      .label {
        color: #5DA0FE;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
      }
      .value {
        display: flex;
        flex: 1;
        > input {
          flex: 1;
          border: 1px solid #4E58ED;
          height: 34px;
          display: block;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #5DA0FE;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .upload {
          background: #3B46E2;
          color: #FFFFFF;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          padding: 0 10px;
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
      width: 240px;
      border-right: 1px solid #1D2388;
      padding: 16px 10px;
      .title {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
      }
      
      .left-scroll {
        // border: 1px solid red;
        height: 470px;
        overflow-y: auto;
        position: relative;
        .device-item {
          width: 100%;// 220px;
          height: 140px;//120px;
          background: #120F41;
          border: 1px solid #4E58ED;
          position: relative;
          display: flex;
          flex-direction: column;
          margin: 0 auto 8px;
          box-sizing: border-box;
          &.active {
            border-color: #e7743a;
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
            width: 98%;
            margin: 0 auto 3px;
            span {
              display: block;
            }
          }
        }
      }
      
      .filter {
        padding: 5px 0;
        span {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #286BC8;
          display: inline-block;
          height: 23px;
          line-height: 23px;
          padding: 0 5px;
          & + span {
            margin-left: 16px;
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
          height: 34px;
          background: #120F41 url(../../../assets/tunnel/modal/laneIndicator/sousuo.png) 190px center / 20px auto no-repeat;
          border: 1px solid #4E58ED;
          display: block;
          margin: 13px auto 0;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #5DA0FE;
          padding: 0 33px 0 16px;
          box-sizing: border-box;
        }
      }
      .operation {
        height: 30px;
        display: flex;
        align-items: center;
        margin-top: 14px;
        span {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          width: 50px;
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
            margin-left: 9px;
          }
        }
        .sel-btn {
          height: 30px;
          line-height: 30px;
          background: url(../../../assets/tunnel/modal/laneIndicator/unselected.png) left center / 14px auto no-repeat;
          padding-left: 20px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #286BC8;
          margin-left: 10px;
          &.active {
            background-image: url(../../../assets/tunnel/modal/laneIndicator/selected.png);
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
        padding-right: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        span {
          width: 80px;
          height: 34px;
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
            margin-left: 10px;
          }
        }
      }
      .content-area {
        width: 296px;
        height: 275px;
        .area-scroll {
          height: 175px;
          background: #050425;
          box-sizing: border-box;
          padding: 5px 10px 0;
          overflow-y: auto;
          .audio-item {
            display: flex;
            border-bottom: 1px dashed #12105E;
            height: 33px;
            align-items: center;
            .checkbox {
              width: 15px;
              height: 15px;
              box-sizing: border-box;
              background: #050425;
              border: 1px solid #4E58ED;
              position: relative;
              
              .checked {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: none;
                color: #2B79E3;
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
              // line-height: 175px;
              padding: 0 11px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #5DA0FE;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .listen-btn {
              width: 40px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background: #0B0A30;
              border: 1px solid #3B46E2;
              border-radius: 4px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #3B46E2;
              &.del-btn {
                border-color: #E7743A;
                color: #E7743A;
              }
              & + .listen-btn {
                margin-left: 8px;
              }
            }
          }
        }
        .info {
          background: #050425;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #3B46E2;
        }
        .control-content {
          height: 225px;
          background: #050425;
          box-sizing: border-box;
          padding: 24px 18px;
        }
        .control-part1 {
          display: flex;
          justify-content: space-between;
          span {
            width: 80px;
            height: 30px;
            line-height: 30px;
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
          }
        }
        
        .control-time {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          .separation {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #286BC8;
          }
          uni-picker {
            display: inline-block;
            width: 115px;
            height: 28px;
            line-height: 28px;
            background: #050425;
            border: 1px solid #4E58ED;
            color: #286BC8;
            text-align: center;
          }
        }
        
        .control-part2 {
          display: flex;
          margin-top: 10px;
          span {
            width: 80px;
            height: 30px;
            line-height: 30px;
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
        }
        
        .area-top {
          height: 48px;
          position: relative;
          .button {
            position: absolute;
            top: 14px;
            right: 0;
            width: 80px;
            height: 24px;
            line-height: 22px;
            text-align: center;
            box-sizing: border-box;
            border-radius: 12px;
            background: #0B0A30;
            border: 1px solid #4E58ED;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5DA0FE;
          }
          .title {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #5DA0FE;
            padding-left: 18px;
            height: 48px;
            line-height: 48px;
            position: relative;
          }
          .num {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #5DA0FE;
            display: inline-block;
            background: #262477;
            border-radius: 10px;
            padding: 0 9px;
            height: 20px;
            line-height: 20px;
            margin-left: 11px;
          }
          &::before {
            content: '';
            width: 3px;
            height: 10px;
            position: absolute;
            top: 21px;
            left: 7px;
            background: #4E58ED;
          }
        }
      }
    }
  }
  
  .header {
    border-bottom: 1px solid #1D2388;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #5DA0FE;
    background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) 19px center / 18px auto no-repeat;
    padding-left: 51px;
    height: 56px;
    line-height: 56px;
    position: relative;
    .close {
      position: absolute;
      width: 33px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      background: #1B195A;
      color: #2B79E3;
      font-size: 22px;
      right: 14px;
      top: 11px;
    }
  }
}
</style>
