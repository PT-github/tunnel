<template>
  <div class="">

    <div class="page">

      <div class="left block" style="position: relative">
        <!--控制3d和2d-->
        <div class="switcher-wrapper">
          <el-radio-group v-model="displayMode" size="medium">
            <el-radio-button label="2d">2d</el-radio-button>
            <el-radio-button label="full2d">2d全屏</el-radio-button>
            <el-radio-button label="3d" v-if="threeDStatus === '1'">3d</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 2d -->
        <tunnel-two-view :tunnel-info-id="tunnelId" @on-chose-device="doShowModalDevice"/>

        <!-- 2d 全屏  -->
      </div>

      <div class="right">
        sdf
      </div>

    </div>

    <!--弹窗-->
        <modal-control
            :device-name="showModalDeviceName"
            :classify-number="showModalClassify"
            v-model="showModal"
            @update="$refs.tunnel.listDeviceBaseOfTunnelPage()"
            :tunnel-info-id.sync="tunnelId"
        />
  </div>

  <!--  <div v-else-if="displayMode === '3d'">-->
  <!--    <tunnel-three-view ref="TunnelThreeViewRef"-->
  <!--                  :tunnel-info="tunnelInfo"-->
  <!--                  :tunnel-devices="tunnelDevices"-->
  <!--                  @on-load="on3DLoad"/>-->

  <!--    <div class="switcher-wrapper threed">-->
  <!--      <el-radio-group v-model="displayMode" size="medium">-->
  <!--        <div class="page-list">-->
  <!--          <el-radio-button label="2d">2d</el-radio-button>-->
  <!--          <el-radio-button label="full2d">2d全屏</el-radio-button>-->
  <!--          <el-radio-button label="3d" v-if="threeDStatus === '1'"-->
  <!--          >3d-->
  <!--          </el-radio-button-->
  <!--          >-->
  <!--        </div>-->
  <!--      </el-radio-group>-->
  <!--    </div>-->
  <!--  </div>-->


</template>

<script>
import TunnelComponent from '../../components/2d/tunnel'
import TipsTitle from '../../components/index/tips-title'
import VideoRtsp from '../../components/video/video-rtsp'
import TunnelEventInfo from '../../components/home/tunnel-event-info'
import ModalControl from '../../components/2d/modal-control'

import TunnelTwoView from '@/components/2d/index'
import TunnelThreeView from '@/components/3d/index'

export default {
  components: {
    TunnelTwoView,
    TunnelThreeView,
    TunnelComponent,
    TipsTitle,
    VideoRtsp,
    TunnelEventInfo,
    ModalControl,
  },
  services: ['_2d', 'tunnel'],
  watch: {
    $route: function () {
      location.reload()
    },
  },

  data() {
    return {
      displayMode: '2d',
      // displayMode: '3d',

      videoList: [],
      deviceTypes: [],
      showModal: false, // 弹窗
      showModalClassify: '', // 弹窗的设备分类
      showModalDeviceName: null, // 弹窗选中的设备名
      showActiveType: 'all',
      tunnelId: '',
      tunnelData: {},
      tunnelDevices: [],
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

  mounted() {
    this.tunnelId = this.$route.params.id
    this.init()

    // this.listDeviceBaseOfTunnelPage()

    if (this.displayMode === '3d') this.$refs.TunnelThreeViewRef.initEvent()

    // this.homeTimer = setInterval(() => {
    //   this.init()
    // }, 5 * 1000)
    // initEvent

  },
  methods: {
    async on3DLoad() {
      // console.log(11111)
      await this.listDeviceBaseOfTunnelPage()
      this.$refs.TunnelThreeViewRef.initInfo()
    },

    // 隧道的设备列表
    async listDeviceBaseOfTunnelPage() {
      // 隧道信息
      await this.$service.tunnel.getById(this.tunnelId).then((res) => {
        this.tunnelInfo = res;
      })

      // 隧道设备列表
      await this.$service._2d.getTunnelDevices(this.tunnelId).then((res) => {
        const supportList = [
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
        ]

        this.tunnelDevices = res.filter((v) => {
          let support = supportList.includes(v.classifyNumber)
          if (!support) console.warn('不支持显示设备', v)
          return support // positionFlag为空不显示
        })


        // this.tunnelDevices = list
        // 对比设备与隧道的起止桩号 获取隧道地图的长度
        // for (let index in this.tunnelDevices) {
        //   if (this.maxEndMapStakeMark > 0) {
        //     this.maxEndMapStakeMark = Math.max(
        //         this.tunnelDevices[index].pileNumber,
        //         this.maxEndMapStakeMark
        //     )
        //   } else {
        //     this.maxEndMapStakeMark = this.tunnelDevices[index].pileNumber
        //   }
        //   if (this.minStartMapStakeMark > 0) {
        //     this.minStartMapStakeMark = Math.min(
        //         this.tunnelDevices[index].pileNumber,
        //         this.minStartMapStakeMark
        //     )
        //   } else {
        //     this.minStartMapStakeMark = this.tunnelDevices[index].pileNumber
        //   }
        // }

        // console.log(this.tunnelDevices)


        // this.$emit('loaded', res)
      })


    },

    init() {
      // 隧道视频
      this.$service._2d.getTunnelVideos(this.tunnelId).then((res) => {

        this.videoList = res
      })


      // 隧道设备类型
      this.$service._2d.getTunnelDeviceTypes(this.tunnelId).then((res) => {

        const deviceTypeis = res.filter(
            (item) =>
                item.classifyName !== '控制器' &&
                item.classifyName !== '诱导灯' &&
                item.classifyName !== '电子围栏' &&
                item.classifyNumber !== 'other'
        )

        this.deviceTypes = [
          {classifyName: '全部', classifyNumber: 'all'},
        ].concat(deviceTypeis)

        // console.log(res, 'device types')
        // console.log(deviceTypeis, 'device types filter')
        // console.log(this.deviceTypes)
      })

      // 获取是否显示3D
      this.$service._2d.getTunnelShow3D().then((res) => {
        const threeDInfo = [...res].find((item) => item.name === 'Show3D')
        // value === '1' 开启
        if (threeDInfo && threeDInfo.value) this.threeDStatus = threeDInfo.value
      })
    },

    onLoadTunnelData(e) {
      this.tunnelData = e
      // console.log(e)
    },

    doShowModalDevice(device) {
      this.doShowModal(device.classifyNumber, device.deviceName)
    },

    doShowModal(classifyNumber, deviceName) {
      this.showActiveType = classifyNumber
      if (classifyNumber === 'all') return
      this.showModal = true
      this.showModalDeviceName = deviceName
      this.showModalClassify = classifyNumber
    },
  },
}
</script>

<style scoped lang="less">


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

.full-2d {
  display: flex;
  height: calc(100vh - 126px);
  flex-direction: column;
  justify-content: space-between;
  padding: 50px 0 0;

  .buttons {
    margin-top: 70px;
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
    margin-top: 20px;
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
