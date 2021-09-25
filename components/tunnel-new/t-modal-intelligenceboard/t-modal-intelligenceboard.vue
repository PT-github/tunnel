<!-- 情报板 -->
<template>
  <view class="t-modal-intelligenceboard">
    <view class="header">
      <text>可变情报板设置</text>
      <text class="close" @tap="handleCancel">x</text>
    </view>

    <view class="flex-box">
      <view class="left" v-if="!type">
        <view class="title">
          <text>可变情报板列表</text>
        </view>

        <view class="operation">

          <text :class="{active: leftRightFlag === 2}" @click="switchLeftRight(2)"
            v-if="singleDoubleType === 3 || singleDoubleType === 2">左洞</text>
          <text :class="{active: leftRightFlag === 1}" @click="switchLeftRight(1)"
            v-if="singleDoubleType === 3 || singleDoubleType === 1">右洞</text>
          <view class="sel-btn" :class="{ active: checkedAll === 1 }" style="margin-left: 3.9062rpx;"
            @click="handleAllSelect(1)">
            全选
          </view>
          <view class="sel-btn" :class="{ active: checkedAll === 0 }" @click="handleAllSelect(0)">
            反选
          </view>
        </view>

        <view class="input-area">
          <input class="input-dom" type="text" v-model="form.deviceName" @blur="getDeviceList" placeholder="设备名称或桩号" />
        </view>

        <scroll-view :show-scrollbar="true" scroll-y="true" class="left-scroll">
          <view class="device-item" v-for="(item, index) in deviceList" :key="item.id + '_' + index"
            :class="{active: checkedList.indexOf(item.id) !== -1}" @click="handleSelect(item)">
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
        <view class="right-title">
          <text
            class="name">可变情报板：{{ currentDevice.deviceName || ''  + '('+ currentDevice.pileNumberStr || '' + ')' }}</text>
          <text class="count">节目：{{ selectedQbBoardList.length }}个</text>
          <text class="device-status">{{ currentDevice.deviceCommunicationsState === 0 ? '在线' : '离线' }}</text>
        </view>
        <view class="swiper-box">
          <Preview :list="selectedQbBoardList" :deviceData="currentDevice" :fontSize="fontSize"></Preview>
        </view>

        <view class="card-box">
          <view class="card-group">
            <view class="title">
              <text>模板列表</text>
              <text class="num">{{ deviceQbBoardList.length }}</text>
            </view>

            <scroll-view class="area-scroll" scroll-y="true">
              <view class="audio-item" v-for="(item, index) in deviceQbBoardList"
                :key="'deviceQbBoardList_' + index + '_' + item.id" @click="selectDeviceQbBoard(item)">
                <view class="checkbox" :class="{active: checkedDeviceQbBoardIds.indexOf(item.id) !== -1}">
                  <icon class="checked" :size="getRealPx(12)" color="#2B79E3" type="success_no_circle" />
                </view>
                <view class="text">
                  <text>{{ item.templetName }}</text>
                </view>
                <view class="listen-btn del-btn" @click.stop="handleDelete(item)">
                  <text>删除</text>
                </view>
              </view>

              <!-- <view class="audio-item">
                <view class="checkbox active">
                  <icon class="checked" :size="getRealPx(12)" color="#2B79E3" type="success_no_circle"/>
                </view>
                <view class="text">
                  <text>模版名称</text>
                </view>
                <view class="listen-btn del-btn" @click.stop="listenMp3(item.templetText)">
                  <text>删除</text>
                </view>
              </view> -->
            </scroll-view>
          </view>

          <view class="card-group">
            <view class="title">
              <text>节目单列表</text>
              <text class="num">{{ selectedQbBoardList.length }}</text>
            </view>

            <scroll-view class="area-scroll" scroll-y="true">
              <view class="audio-item" v-for="(item, index) in selectedQbBoardList" @click="handleSelectProgram(item)">
                <view class="checkbox" :class="{active: selectedQbBoardIds.indexOf(item.id) !== -1}">
                  <icon class="checked" :size="getRealPx(12)" color="#2B79E3" type="success_no_circle" />
                </view>
                <view class="text">
                  <text>{{ item.templetName }}</text>
                </view>
                <view class="listen-btn del-btn" @click.stop="handleDeleteSelected(item)">
                  <text>删除</text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
        <Edit :colors="colors" :backgroundColors="backgroundColors" :horizontal="horizontal" :vertical="vertical"
          :font="font" :fontSize="fontSize" :resolutionPowers="resolutionPower" :currentDevice="currentDevice"
          @update-list="updateList" @update-board="handleUpdateBoard"></Edit>

        <view class="submit-area">
          <text @tap="handleCancel">取消</text>
          <text class="active" @click="handleSubmit">执行</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import config from '../../config/index.js'
  import Preview from './preview.vue'
  import Edit from './edit.vue'
  import {
    guid
  } from '../../util/tools.js'
  export default {
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

        windowWidth: wx.getSystemInfoSync().windowWidth,

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
      uni.showLoading({
        title: '加载中'
      })
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
      uni.hideLoading()
    },
    methods: {
      handleSubmit() {
        let obj = {
          deviceIds: '',
          data: []
        }
        if (!this.checkedList.length) {
          return uni.showToast({
            title: '请选择设备',
            icon: 'none'
          })
        }
        obj.deviceIds = this.checkedList.join(',')
        if (!this.selectedQbBoardIds.length) {
          return uni.showToast({
            title: '请选择节目',
            icon: 'none'
          })
        }
        uni.showLoading({
          title: '加载中'
        })
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

        this.$request.oprateDeviceQbBoard(obj).then(res => {
          if (res.status === 1) {
            uni.showToast({
              icon: 'success',
              title: '执行成功'
            })
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
        uni.showModal({
          title: '提示',
          content: '确认是否删除',
          success: function(ret) {
            if (ret.confirm) {
              uni.showLoading({
                title: '加载中'
              })
              self.$request.deleteDeviceQbBoardTmepinfo({
                tempId: item.id
              }).then(res => {
                if (res.status === 1) {
                  uni.showToast({
                    icon: 'success',
                    title: '删除成功'
                  })
                  for (let i = 0; i < self.deviceQbBoardList.length; i++) {
                    if (self.deviceQbBoardList[i].id === item.id) {
                      self.deviceQbBoardList.splice(i, 1)
                      break;
                    }
                  }
                }
                uni.hideLoading()
              })
            }
          }
        })



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
            uni.showToast({
              title: '解析该文件失败'
            })
            //TODO handle the exception
          }

        } else {
          this.checkedDeviceQbBoardList.splice(idx, 1)
        }
      },



      async init () {
        uni.showLoading({
          title: '加载中'
        })
        // 清空已勾选的播放表
        // this.checkedDeviceQbBoardList.splice(0, this.checkedDeviceQbBoardList.length)
        await Promise.all([
          this.getDeviceQbBoardList(),
          this.getDeviceQbByDeviceId()
        ])
        uni.hideLoading()
      },

      // 获取设备节目单
      getDeviceQbByDeviceId() {
        this.exitQbBoardList.splice(0, this.exitQbBoardList.length)
        return this.$request.getDeviceQbByDeviceId({
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
        return this.$request.getDeviceQbBoardList({
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
        return this.$request.getIntelligenceBoardList(this.form).then(res => {
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
          this.$request.listChildrenByParentValue({
            value: 'vertical'
          }).then(res => {
            this.vertical.push(...res.data)
          }),
          this.$request.listChildrenByParentValue({
            value: 'horizontal'
          }).then(res => {
            this.horizontal.push(...res.data)
          }),
          this.$request.listChildrenByParentValue({
            value: 'resolutionPower'
          }).then(res => {
            this.resolutionPower.push(...res.data)
          }),
          this.$request.listChildrenByParentValue({
            value: 'fontSize'
          }).then(res => {
            this.fontSize.push(...res.data)
          }),
          this.$request.listChildrenByParentValue({
            value: 'font'
          }).then(res => {
            this.font.push(...res.data)
          }),
          this.$request.listChildrenByParentValue({
            value: 'bgColor'
          }).then(res => {
            this.backgroundColors.push(...res.data)
          }),
          this.$request.listChildrenByParentValue({
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
        return this.$request.getDeviceCriticalBroadcastList({
          boardcastFileType: 2
        }).then(res => {
          this.warnList.push(...res.data)
        })
      },
      // 通知
      getNoticeBroadcastList() {
        this.noticeList.splice(0, this.noticeList.length)
        return this.$request.getDeviceCriticalBroadcastList({
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
  .t-modal-intelligenceboard {
    width: 394.5312rpx; //343.75rpx;
    height: 312.5rpx; //274.6093rpx;
    box-sizing: border-box;
    background: #0B0A30;
    border: 0.3906rpx solid #1D2388;
    display: flex;
    flex-direction: column;

    .flex-box {
      display: flex;
      flex: 1;

      .left {
        width: 93.75rpx;
        border-right: 0.3906rpx solid #1D2388;
        padding: 6.25rpx 3.9062rpx;
        flex-shrink: 0;

        .title {
          font-size: 5.4687rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #5DA0FE;
        }

        .left-scroll {
          // border: 1px solid red;
          margin-top: 1.9531rpx;
          height: 195.3125rpx;

          .device-item {
            width: 100%; // 85.9375rpx;
            height: 54.6875rpx; //46.875rpx;
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

            &+text {
              margin-left: 6.25rpx;
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

            &+text {
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
        flex-direction: column;
        padding: 0 6.25rpx;

        .submit-area {
          width: 100%;
          padding-right: 3.9062rpx;
          box-sizing: border-box;
          display: flex;
          justify-content: flex-end;
          margin-top: 4.6875rpx;

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

            &+text {
              margin-left: 3.9062rpx;
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
              margin-right: 4.6875rpx;
            }

            .area-scroll {
              height: 87.8906rpx; //68.3593rpx;
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

                  &+.listen-btn {
                    margin-left: 3.125rpx;
                  }
                }
              }
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

              &::before {
                content: '';
                width: 1.1718rpx;
                height: 3.9062rpx;
                position: absolute;
                top: 8.2031rpx;
                left: 2.7343rpx;
                background: #4E58ED;
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
            }
          }
        }

        .swiper-box {
          height: 35.1562rpx;
          background: #120F41;
          border: 0.3906rpx solid #4E58ED;
          box-sizing: border-box;
        }

        .right-title {
          height: 19.5312rpx;
          display: flex;
          align-items: center;

          text {
            font-size: 5.4687rpx;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #5DA0FE;
          }

          .name {
            flex: 1;
          }

          .count {
            font-size: 4.6875rpx;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #3B46E2;
            line-height: 0;
            margin-right: 3.9062rpx;
          }

          .device-status {
            width: 22.2656rpx;
            height: 9.375rpx;
            line-height: 8.5937rpx; //9.375rpx;
            box-sizing: border-box;
            background: #0B0A30;
            border: 0.3906rpx solid #4E58ED;
            border-radius: 4.6875rpx;
            font-weight: 400;
            text-align: center;
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
