<template>
  <div class="page">
    <!--    <div class="page">-->
    <div class="left" style="position: relative">
      <!--隧道图-->
      <div class="block wide map" :class="{'full-2': tunnelStatus === 'TunnelFullView'}">
        <!--控制3d和2d-->
        <div class="switcher-wrapper">
          <el-radio-group v-model="tunnelStatus" size="medium">
            <el-radio-button label="TunnelTwoView">2d</el-radio-button>
            <el-radio-button label="TunnelFullView">2d全屏</el-radio-button>
            <el-radio-button label="TunnelThreeView" v-if="threeDStatus === '1'"
            >3d
            </el-radio-button
            >
          </el-radio-group>
        </div>
        <!-- <slot /> -->

        <!-- 隧道信息 -->
        <section>
          <tunnel-component
              @detail="doShowModalDevice"
              @details="doShowModalDevices"
              ref="TunnelRef"
              :show-active-type="showActiveType"
              :tunnel-status="tunnelStatus"
              :tunnel-info-data="tunnelInfoData"
              :tunnel-devices="tunnelDevices"
              @on-load="on3DLoad"
              @on-update="onUpdate"
          >
            <div slot="controls" class="buttons">
              <div
                  class="button-item"
                  v-for="(item, index) in tunnelDeviceTypes"
                  :key="index"
                  @click="doShowModal(item.classifyNumber)"
              >
                <div class="img-wrap">
                  <img
                      class="img"
                      :src="
                      require('../../assets/images/warning/icons/' +
                        item.classifyNumber +
                        '.png')
                    "
                  />
                </div>
                <p>{{ item.classifyName }}</p>
              </div>
            </div>
          </tunnel-component>
        </section>
      </div>

      <!-- 隧道左右洞视频 -->
      <div class="videos" v-if="tunnelStatus === 'TunnelTwoView'">
        <div class="video">
          <VideoRtsp
              click-to-play
              :can-play="!showModal"
              v-if="tunnelVideos.length"
              :title="tunnelVideos[0].firstVedioName"
              :bg-height="400"
              :width="500"
              :deviceConfig="tunnelVideos[0].deviceConfig"
          />
        </div>

        <div class="spacer"></div>

        <div class="video">
          <VideoRtsp
              click-to-play
              :can-play="!showModal"
              v-if="tunnelVideos.length > 1"
              :title="tunnelVideos[1].firstVedioName"
              :bg-height="400"
              :width="500"
              :deviceConfig="tunnelVideos[1].deviceConfig"
          />
        </div>
      </div>

      <!--弹窗-->
      <modal-control
          :device-name="showModalDeviceName"
          :classify-number="showModalClassify"
          :tunnel-id.sync="tunnelId"
          :is-three-model="tunnelStatus === 'TunnelThreeView'"
          v-model="showModal"
          @update="onUpdate"
          @close="onClose"
          @position="on3DPosition"
      />
    </div>

    <div class="" v-if="tunnelStatus === 'TunnelTwoView'">
      <tunnel-event :tunnel-id="tunnelId"/>
    </div>

    <!--    </div>-->
  </div>
</template>

<script>
import TipsTitle from '../../components/index/tips-title'
import TunnelComponent from '@/components/2d/tunnel'
import VideoRtsp from '../../components/video/video-rtsp'
import TunnelEventInfo from '../../components/home/tunnel-event-info'
import ModalControl from '../../components/2d/modal-control'


import TunnelEvent from '@/components/2d/event'

export default {
  components: {
    TunnelEvent,
    TunnelComponent,
    TipsTitle,
    VideoRtsp,
    TunnelEventInfo,
    ModalControl,
  },
  services: ['_2d', 'tunnel'],
  data() {
    return {
      tunnelStatus: 'TunnelTwoView',
      tunnelVideos: [],
      tunnelInfoData: {},
      tunnelDevices: [],
      tunnelDeviceTypes: [],
      tunnelSupports: [
        'signallamp',
        'laneIndicator',
        'urgentphone',
        'broadcast',
        'conflagration',
        'guidelight',
        'lighting',
        'waterlevel',
        'electronicfence',
        'environment',
        'tunneldoor',
        'draughtfan',
        'video',
        'intelligenceboard',
      ],
      showModal: false, // 弹窗
      showModalClassify: '', // 弹窗的设备分类
      showModalDeviceName: null, // 弹窗选中的设备名
      showActiveType: 'all',
      tunnelId: this.$route.params.id,
      tunnelData: {},
      tunnelInfo: {},
      threeDStatus: '0',
      homeTimer: null,
      // maxEndMapStakeMark: 0,
      // minStartMapStakeMark: 0,
    }
  },

  beforeDestroy() {
    clearInterval(this.homeTimer)
    this.homeTimer = null
  },

  watch: {
    $route: function () {
      location.reload()
    },
    // tunnelStatus(val) {
    // if (val === 'TunnelThreeView') {
    //   this.$refs.TunnelRef.initEvent()
    // }
    // }
  },

  async mounted() {
    // this.tunnelId = this.$route.params.id
    await this.init()
    this.$refs.TunnelRef.initEvent()
  },
  methods: {
    // 初始化3D
    async on3DLoad() {
      this.$refs.TunnelRef.initInfo()
    },

    // 跳转3D设备位置
    on3DPosition(item) {
      this.$refs.TunnelRef.setPosition(item.origin.id)
    },

    //
    onClose() {
      if (this.tunnelStatus === 'TunnelThreeView') {
        this.$refs.TunnelRef.setFocus()
      }
    },

    async onUpdate() {
      await this.init()
      this.$refs.TunnelRef.setDevice()
      this.$refs.TunnelRef.findTunnelBaseInfo()
      this.$refs.TunnelRef.outerWidths()
    },

    async init() {
      // 隧道信息
      await this.$service.tunnel.getById(this.tunnelId).then((res) => {
        this.tunnelInfoData = res
      })

      // 隧道设备类型
      await this.$service._2d.getTunnelDeviceTypes(this.tunnelId).then((res) => {
        const deviceTypeis = res.filter(
            (item) =>
                item.classifyName !== '控制器' &&
                item.classifyName !== '诱导灯' &&
                item.classifyName !== '电子围栏' &&
                item.classifyNumber !== 'other'
        )

        this.tunnelDeviceTypes = [
          {classifyName: '全部', classifyNumber: 'all'},
        ].concat(deviceTypeis)
      })

      // 获取是否显示3D
      await this.$service._2d.getTunnelShow3D().then((res) => {
        const threeDInfo = [...res].find((item) => item.name === 'Show3D')
        // value === '1' 开启
        if (threeDInfo && threeDInfo.value) this.threeDStatus = threeDInfo.value
      })

      // 隧道设备列表
      await this.$service._2d.getTunnelDevices(this.tunnelId).then((res) => {
        this.tunnelDevices = res.filter((v) => {
          let support = this.tunnelSupports.includes(v.classifyNumber)
          // if (!support) console.warn('不支持显示设备', v)
          return support // positionFlag为空不显示
        })

      })

      // 隧道视频
      await this.$service._2d.getTunnelVideos(this.tunnelId).then((res) => {
        this.tunnelVideos = res
      })

    },

    onLoadTunnelData(e) {
      this.tunnelData = e
    },

    doShowModalDevice(device) {
      this.doShowModal(device.classifyNumber, device.deviceName)
    },
    doShowModalDevices(device) {
      this.doShowModals(device.classifyNumber, device.deviceName)
    },

    doShowModal(classifyNumber, deviceName) {
      //alert(1)
      this.showActiveType = classifyNumber
      if (classifyNumber === 'all') return
      this.showModal = true
      this.showModalDeviceName = deviceName
      this.showModalClassify = classifyNumber
    },
    doShowModals(classifyNumber, deviceName){
      //this.showActiveType = classifyNumber
      if (classifyNumber === 'all') return
      this.showModal = true
      this.showModalDeviceName = deviceName
      this.showModalClassify = classifyNumber
    }
  },
}
</script>

<style scoped lang="less">
.full-2 {
  height: calc(100vh - 135px);
  overflow-y: auto;
}

.switcher-wrapper {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  z-index: 999;

  &.threed {
    right: 60px;
    top: 110px;
  }

  > span {
    font-weight: 400;
    font-style: normal;
    font-size: 22px;
    color: #1e6bc8;
  }
}

.buttons {
  display: flex;
  width: 100%;
  padding: 30px 40px;

  .button-item {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 124, 243, 1);

    .img-wrap {
      width: 60px;
      height: 60px;
      padding: 15px;
      background: rgba(20, 36, 112, 1);
      border: 1px solid rgba(51, 73, 174, 1);
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .img {
      width: 30px;
      height: 30px;
    }
  }
}

.page {
  display: flex;
  padding: 0 17px 17px;

  .left {
    flex: 1;

    .map {
      width: 100%;
      position: relative;
    }
  }

  .stats {
    display: flex;
    padding: 10px;

    .stat-wrap {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .label {
      margin: 20px 0;
      font-size: 16px;
      font-weight: 400;
      color: rgba(44, 115, 229, 1);
      line-height: 17px;
      text-align: center;
    }

    .stat {
      width: 93px;
      height: 93px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-size: 100% 100%;

      .num {
        font-size: 13px;
        font-weight: bold;
        color: #c1d9ff;
        line-height: 20px;
        text-align: center;
      }

      &.brightness {
        background: url('../../assets/images/warning/icons/brightness.png') no-repeat;
        background-size: 100% 100%;
      }

      &.co {
        background: url('../../assets/images/warning/icons/co.png') no-repeat;
        background-size: 100% 100%;
      }

      &.vi {
        background: url('../../assets/images/warning/icons/vi.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .right {
    margin-left: 20px;
    width: 472px;
    padding: 15px;
  }

  .videos {
    margin-top: 15px;
    display: flex;

    .spacer {
      width: 21px;
      height: 100%;
    }

    .video {
      flex: 1;
    }
  }
}
</style>
