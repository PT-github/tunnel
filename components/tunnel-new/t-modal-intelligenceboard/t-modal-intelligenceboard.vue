<!-- 情报板 -->
<template>
  <div class="t-modal-intelligenceboard">
    <div class="header">
      <span>可变情报板设置</span>
      <span class="close" @click="handleCancel">x</span>
    </div>

    <div class="flex-box">
      <div class="left" v-if="!type">
        <div class="title">
          <span>可变情报板列表</span>
        </div>

        <div class="operation">

          <span :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)"
            v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</span>
          <span :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)"
            v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</span>
          <div class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 3.9062rpx;"
            @click="handleAllSelect(1)">
            全选
          </div>
          <div class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
            反选
          </div>
        </div>

        <div class="input-area">
          <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
        </div>

        <div :show-scrollbar="true" scroll-y="true" class="left-scroll">
          <div class="device-item" v-for="(item, index) in deviceList" :key="item.id + '_' + index"
            :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
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
        <div class="right-title">
          <span
            class="name">可变情报板：{{ currentDevice.deviceName || ''  + '('+ currentDevice.pileNumberStr || '' + ')' }}</span>
          <span class="count">节目：{{ selectedQbBoardList.length }}个</span>
          <span class="device-status">{{ currentDevice.deviceCommunicationsState === 0 ? '在线' : '离线' }}</span>
        </div>
        <div class="swiper-box">
          <Preview :list="selectedQbBoardList" :deviceData="currentDevice" :fontSize="fontSize"></Preview>
        </div>

        <div class="card-box">
          <div class="card-group">
            <div class="title">
              <span>模板列表</span>
              <span class="num">{{ deviceQbBoardList.length }}</span>
            </div>

            <div class="area-scroll" scroll-y="true">
              <div class="audio-item" v-for="(item, index) in deviceQbBoardList"
                :key="'deviceQbBoardList_' + index + '_' + item.id" @click="selectDeviceQbBoard(item)">
                <div class="checkbox" :class="{active: checkedDeviceQbBoardIds.indexOf(item.id) !== -1}">
                  <!-- <icon class="checked" :size="getRealPx(12)" color="#2B79E3" type="success_no_circle" /> -->
                  <span class="el-icon-check checked"></span>
                </div>
                <div class="text">
                  <span>{{ item.templetName }}</span>
                </div>
                <div class="listen-btn del-btn" @click.stop="handleDelete(item)">
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-group">
            <div class="title">
              <span>节目单列表</span>
              <span class="num">{{ selectedQbBoardList.length }}</span>
            </div>

            <div class="area-scroll" scroll-y="true">
              <div class="audio-item" v-for="(item, index) in selectedQbBoardList" @click="handleSelectProgram(item)">
                <div class="checkbox" :class="{active: selectedQbBoardIds.indexOf(item.id) !== -1}">
                  <!-- <icon class="checked" :size="getRealPx(12)" color="#2B79E3" type="success_no_circle" /> -->
                  <span class="el-icon-check checked"></span>
                </div>
                <div class="text">
                  <span>{{ item.templetName }}</span>
                </div>
                <div class="listen-btn del-btn" @click.stop="handleDeleteSelected(item)">
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Edit :colors="colors" :backgroundColors="backgroundColors" :horizontal="horizontal" :vertical="vertical"
          :font="font" :fontSize="fontSize" :resolutionPowers="resolutionPower" :currentDevice="currentDevice"
          @update-list="updateList" @update-board="handleUpdateBoard"></Edit>

        <div class="submit-area">
          <span @click="handleCancel">取消</span>
          <span class="active" @click="handleSubmit">执行</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Preview from './preview.vue'
  import Edit from './edit.vue'
  import {
    guid
  } from '../../../utils/tools.js'
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name: "t-modal-intelligenceboard",
    components: {
      Preview,
      Edit
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
      return {

        deviceQbBoardList: [], // 播放单列表
        checkedDeviceQbBoardList: [], // 已选的播放列表

        exitQbBoardList: [], // 设备正在播放的节目列表

        currentDevice: {}, // 当前点击的设备

        selectedQbBoardIds: [], // 当前选择的节目列表

        userAddList: [], // 用户手动添加的

        colors: [],
        backgroundColors: [],
        horizontal: [],
        vertical: [],
        font: [],
        fontSize: [],
        resolutionPower: [],



        show: false,
        pathArr: null,
        showAddModal: false,

        // windowWidth: wx.getSystemInfoSync().windowWidth,

        form: {
          // workMode: null, // 工作模式
          leftRightFlag: null, // 左右洞标识
          deviceName: null, // 设备名称或桩号
          tunnelId: null, // 隧道ID
          classifyNumber: 'intelligenceboard' // 分类
        },

        checkedAll: null, // 全选1/反选0
        deviceList: [],
        checkedList: [], // 已选设备列表
        workMode: [], // 控制模式
        workModeChecked: null, // 已选控制模式


        checkedBroadList: [], // 已选广播列表

        controlType: 1, // 控制 播放：1；停止播放：0；停止定时播放：2
        isSetTime: true, // 是否定时播放

        uploadForm: {
          boardcastFileName: '',
          boardcastFilePath: '',
          boardcastFileType: 2, // 广播文件类型2:报警广播 3:通知广播
        },
        deviceTypeCode: 'intelligenceboard'
      };
    },
    computed: {
      // 隧道单双洞
      singleDoubleType() {
        return this.tunnelInfoData.singleDoubleType
      },
      // 过滤条件 左/右洞
      leftRightFlag() {
        return this.form.leftRightFlag
      },
      checkedDeviceQbBoardIds() {
        return this.checkedDeviceQbBoardList.map(item => item.id)
      },
      // 节目列表 设备已有的+用户勾选的+底部手动添加
      selectedQbBoardList() {
        return this.exitQbBoardList.concat(...this.checkedDeviceQbBoardList, ...this.userAddList)
      }
    },
    async created() {
      this.form.tunnelId = this.tunnelId
      await this.getDic()
      if (!this.type) {
        await this.getDeviceList()
      } else {
        this.checkedList.push(this.deviceData.id)
        this.currentDevice = this.deviceData
      }
      await Promise.all([
        this.getDeviceQbBoardList(),
        this.getDeviceQbByDeviceId()
      ])
      // await this.getWarnBroadcastList()
      // await this.getNoticeBroadcastList()
    },
    methods: {
      handleSubmit() {
        let obj = {
          deviceIds: '',
          data: []
        }
        if (!this.checkedList.length) {
          return this.$message.warning("请选择设备")
        }
        obj.deviceIds = this.checkedList.join(',')
        if (!this.selectedQbBoardIds.length) {
          return this.$message.warning("请选择节目")
        }
        for (let i = 0; i < this.selectedQbBoardList.length; i++) {
          if (this.selectedQbBoardIds.indexOf(this.selectedQbBoardList[i].id) !== -1) {
            let item = this.selectedQbBoardList[i]
            obj.data.push({
              "backgroundColor": item.backgroundColor || '',
              "bmpName": item.bmpName,
              "bmps": item.bmps,
              "bold": item.bold,
              "color": item.color || '',
              "emergeFlag": item.emergeFlag,
              "emergeSpeed": item.emergeSpeed,
              "fontName": item.fontName,
              "fontSize": item.fontSize,
              "horizontal": item.horizontal,
              "imgUrls": item.imgUrls,
              "interval": item.interval + '',
              "intervalShow": item.intervalShow,
              "italics": parseInt(item.italics),
              "monopoly": item.monopoly,
              "point": item.point,
              "releaseType": item.releaseType,
              "releaseTypeName": item.releaseTypeName,
              "rowHeight": item.rowHeight,
              "showImg": item.showImg,
              "spacing": item.spacing,
              "templateType": item.templateType,
              "text": item.text,
              "vertical": item.vertical
            })
          }
        }

        this.$service.tunnel_2d.oprateDeviceQbBoard(obj).then(res => {
          if (res.status === 1) {
            this.$notifySuccess()
            if (this.checkedList.length === 1) {
              this.$emit('update-device', {id: this.checkedList[0]})
            } else {
              this.$emit('update-devices', [], 'intelligenceboard')
            }
            this.handleCancel()
          }
        })
      },
      // 添加节目单
      handleUpdateBoard(obj) {
        this.userAddList.push({
          id: guid(),
          ...obj,
          templetName: obj.text,
        })
      },
      updateList() {
        this.getDeviceQbBoardList()
      },
      // 删除播放文件
      handleDelete(item) {
        let self = this
        this.$showConfirm("请确认是否删选择的节目信息，删除后不能恢复！").then(
          () => {
            self.$service.tunnel_2d.deleteDeviceQbBoardTmepinfo({
              tempId: item.id
            }).then(res => {
              if (res.status === 1) {
                this.$notifySuccess()
                for (let i = 0; i < self.deviceQbBoardList.length; i++) {
                  if (self.deviceQbBoardList[i].id === item.id) {
                    self.deviceQbBoardList.splice(i, 1)
                    break;
                  }
                }
              }
            })
          }
        );

      },
      handleSelectProgram(item) {
        let idx = this.selectedQbBoardIds.indexOf(item.id)
        if (idx !== -1) {
          this.selectedQbBoardIds.splice(idx, 1)
        } else {
          this.selectedQbBoardIds.push(item.id)
        }
      },
      // 删除节目列表中的文件
      handleDeleteSelected(item) {
        // exitQbBoardList 设备正在播放的节目列表
        // checkedDeviceQbBoardList 用户自己勾选的文件
        for (let i = 0; i < this.exitQbBoardList.length; i++) {
          if (item.id === this.exitQbBoardList[i].id) {
            this.exitQbBoardList.splice(i, 1)
            return
          }
        }
        for (let i = 0; i < this.checkedDeviceQbBoardList.length; i++) {
          if (item.id === this.checkedDeviceQbBoardList[i].id) {
            this.checkedDeviceQbBoardList.splice(i, 1)
            return
          }
        }
        for (let i = 0; i < this.userAddList.length; i++) {
          if (item.id === this.userAddList[i].id) {
            this.userAddList.splice(i, 1)
            return
          }
        }
      },
      // 选择播放文件
      selectDeviceQbBoard(item) {
        let idx = this.checkedDeviceQbBoardIds.indexOf(item.id)
        if (idx === -1) {
          // let list = typeof data.content === 'string' ? JSON.parse(data.content).data : []
          // for (let i = 0; i < list.length; i++) {
          //   this.exitQbBoardList.push({
          //     id: guid(),
          //     templetName: list[i].text.trim(),
          //     ...list[i]
          //   })
          // }
          let {
            templetText
          } = item
          try {
            templetText = JSON.parse(templetText)
            this.checkedDeviceQbBoardList.push({
              ...item,
              templetName: templetText.text,
              ...templetText
            })
          } catch (e) {
            this.$message.warning("解析该文件失败")
            //TODO handle the exception
          }

        } else {
          this.checkedDeviceQbBoardList.splice(idx, 1)
        }
      },



      async init () {
        // 清空已勾选的播放表
        // this.checkedDeviceQbBoardList.splice(0, this.checkedDeviceQbBoardList.length)
        await Promise.all([
          this.getDeviceQbBoardList(),
          this.getDeviceQbByDeviceId()
        ])
      },

      // 获取设备节目单
      getDeviceQbByDeviceId() {
        this.exitQbBoardList.splice(0, this.exitQbBoardList.length)
        return this.$service.tunnel_2d.getDeviceQbByDeviceId({
          deviceId: this.currentDevice.id
        }).then(res => {
          let data = res.data
          try {
            let list = typeof data.content === 'string' ? JSON.parse(data.content).data : []
            for (let i = 0; i < list.length; i++) {
              this.exitQbBoardList.push({
                id: guid(),
                templetName: list[i].text.trim(),
                ...list[i]
              })
            }
          } catch (e) {
            console.log('解析节目单失败', e)
          }
        })
      },

      // 获取播放列表
      getDeviceQbBoardList() {
        this.deviceQbBoardList.splice(0, this.deviceQbBoardList.length)
        return this.$service.tunnel_2d.getDeviceQbBoardList({
          resolutionPower: this.currentDevice.resolutionPower, // 分辨率
          templetName: null
        }).then(res => {
          res && res.data && res.data.length && this.deviceQbBoardList.push(...res.data)
        })
      },

      // 获取设备列表
      getDeviceList() {
        this.userAddList.splice(0, this.userAddList.length)
        this.deviceList.splice(0, this.deviceList.length)
        this.checkedList.splice(0, this.checkedList.length) // 清空已选的设备
        return this.$service.tunnel_2d.getIntelligenceBoardList(this.form).then(res => {
          if (res && res.data) {
            this.deviceList.push(...res.data)
            this.checkedList.push(res.data[0].id) // 默认选中第一个
            // this.$set(this, 'currentDevice', {...res.data[0],
            //     resolutionPower: '96*32'})
            this.$set(this, 'currentDevice', res.data[0])
          }
        })
      },
      // 设备选择
      handleSelect(item) {
        if (this.currentDevice.id !== item.id) {
          this.$set(this, 'currentDevice', item)
          this.init()
        }
        let idx = this.checkedList.indexOf(item.id)
        if (idx === -1) {
          this.checkedList.push(item.id)
        } else {
          this.checkedList.splice(idx, 1)
        }
      },

      getDic() {
        return Promise.all([
          this.$service.tunnel_2d.listChildrenByParentValue({
            value: 'vertical'
          }).then(res => {
            this.vertical.push(...res.data)
          }),
          this.$service.tunnel_2d.listChildrenByParentValue({
            value: 'horizontal'
          }).then(res => {
            this.horizontal.push(...res.data)
          }),
          this.$service.tunnel_2d.listChildrenByParentValue({
            value: 'resolutionPower'
          }).then(res => {
            this.resolutionPower.push(...res.data)
          }),
          this.$service.tunnel_2d.listChildrenByParentValue({
            value: 'fontSize'
          }).then(res => {
            this.fontSize.push(...res.data)
          }),
          this.$service.tunnel_2d.listChildrenByParentValue({
            value: 'font'
          }).then(res => {
            this.font.push(...res.data)
          }),
          this.$service.tunnel_2d.listChildrenByParentValue({
            value: 'bgColor'
          }).then(res => {
            this.backgroundColors.push(...res.data)
          }),
          this.$service.tunnel_2d.listChildrenByParentValue({
            value: 'fontColor'
          }).then(res => {
            this.colors.push(...res.data)
          })
        ])
      },




      // 勾选广播
      selectBroad(item) {
        let index = this.checkedBroadIds.indexOf(item.id)
        if (index === -1) {
          this.checkedBroadList.push(item)
        } else {
          this.checkedBroadList.splice(index, 1)
        }
      },
      // 删除已选广播
      removeSelected(id) {
        for (let i = 0; i < this.checkedBroadList.length; i++) {
          if (this.checkedBroadList[i].id === id) {
            this.checkedBroadList.splice(i, 1)
            return
          }
        }
      },
      // 全选/反选
      handleAllSelect(code) {
        if (this.checkedAll === code) {
          this.checkedAll = null
          switch (code) {
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
          switch (code) {
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
      switchLeftRight(f) {
        if (this.form.leftRightFlag === f) {
          this.form.leftRightFlag = null
        } else {
          this.form.leftRightFlag = f
        }
        this.getDeviceList()
      },
      switchWorkMode(workMode) {
        if (this.form.workMode === workMode) {
          this.form.workMode = null
        } else {
          this.form.workMode = workMode
        }
        this.getDeviceList()
      },
      // 报警
      getWarnBroadcastList() {
        this.warnList.splice(0, this.warnList.length)
        return this.$service.tunnel_2d.getDeviceCriticalBroadcastList({
          boardcastFileType: 2
        }).then(res => {
          this.warnList.push(...res.data)
        })
      },
      // 通知
      getNoticeBroadcastList() {
        this.noticeList.splice(0, this.noticeList.length)
        return this.$service.tunnel_2d.getDeviceCriticalBroadcastList({
          boardcastFileType: 3
        }).then(res => {
          this.noticeList.push(...res.data)
        })
      },
      bindTimeChange(event, f) {
        f ? (this.eDate = event.detail.value) : (this.sDate = event.detail.value)
      },
      // 时间校验
      validTime() {
        let [sHour, sMinite] = this.sDate.split(':')
        let [eHour, eMinite] = this.eDate.split(':')
        sHour = parseInt(sHour)
        sMinite = parseInt(sMinite)

        eHour = parseInt(eHour)
        eMinite = parseInt(eMinite)

        if (sHour > eHour || (sHour === eHour && sMinite > eMinite)) {
          return false
        }
        return true
      },



      handleCancel() {
        this.$emit('close')
      },
      cancel(e) {
        console.log(e.time) //取消事件 =>12:30-17:30
      },
      getRealPx(w) {
        // var real = 0;
        // try {
        //   var scale = this.windowWidth / 1920
        //   real = Math.floor(scale * w)
        //   return real
        // } catch (e) {
        //   return real
        // }
        return w
      },
    }
  }
</script>

<style lang="scss">
  .t-modal-intelligenceboard {
  width: 1030px; //880px;
  height: 800px; //703px;
  box-sizing: border-box;
  background: #0B0A30;
  border: 1px solid #1D2388;
  display: flex;
  flex-direction: column;

  .flex-box {
    display: flex;
    flex: 1;

    .left {
      width: 240px;
      border-right: 1px solid #1D2388;
      padding: 16px 10px;
      flex-shrink: 0;

      .title {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
      }

      .left-scroll {
        // border: 1px solid red;
        margin-top: 5px;
        height: 500px;

        .device-item {
          width: 100%; // 220px;
          height: 140px; //120px;
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

          &+span {
            margin-left: 16px;
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

          &+span {
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
      flex-direction: column;
      padding: 0 16px;
      overflow: hidden;

      .submit-area {
        width: 100%;
        padding-right: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;

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

          &+span {
            margin-left: 10px;
          }
        }
      }

      .card-box {
        display: flex;
        overflow: hidden;

        .card-group {
          flex: 1;
          flex-shrink: 0;
          overflow: hidden;
          width: 0;

          &:first-child {
            margin-right: 12px;
          }

          .area-scroll {
            height: 225px; //175px;
            background: #050425;
            box-sizing: border-box;
            padding: 5px 10px 0;

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
                  color: #5DA0FE;
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

                &+.listen-btn {
                  margin-left: 8px;
                }
              }
            }
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

            &::before {
              content: '';
              width: 3px;
              height: 10px;
              position: absolute;
              top: 21px;
              left: 7px;
              background: #4E58ED;
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
          }
        }
      }

      .swiper-box {
        height: 90px;
        background: #120F41;
        border: 1px solid #4E58ED;
        box-sizing: border-box;
      }

      .right-title {
        height: 50px;
        display: flex;
        align-items: center;

        span {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #5DA0FE;
        }

        .name {
          flex: 1;
        }

        .count {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #3B46E2;
          line-height: 0;
          margin-right: 10px;
        }

        .device-status {
          width: 57px;
          height: 24px;
          line-height: 22px; //24px;
          box-sizing: border-box;
          background: #0B0A30;
          border: 1px solid #4E58ED;
          border-radius: 12px;
          font-weight: 400;
          text-align: center;
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
