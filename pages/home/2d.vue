<template>
  <div v-if="displayMode === '2d'" class="page">
    <!--左边-->
    <div class="left">
      <!--隧道图-->
      <div class="block wide map">
        <!--控制3d和2d-->
        <div class="switcher-wrapper">
          <el-radio-group v-model="displayMode" size="medium">
            <el-radio-button label="2d">2d</el-radio-button>
            <el-radio-button label="full2d">2d全屏</el-radio-button>
            <el-radio-button label="3d" v-if="threeDStatus === '1'">3d</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 隧道信息 -->
        <tunnel-component
            @detail="doShowModalDevice"
            ref="tunnel"
            :showActiveType="showActiveType"
        >
          <div slot="controls" class="buttons">
            <div
                class="button-item"
                v-for="(item, index) in deviceTypes"
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
      </div>

      <!-- 隧道左右洞视频 -->
      <div class="videos">
        <div class="video">
          <VideoRtsp
              click-to-play
              :can-play="!showModal"
              v-if="videoList.length"
              :title="videoList[0].firstVedioName"
              :bg-height="400"
              :width="500"
              :deviceConfig="videoList[0].deviceConfig"
          />
        </div>

        <div class="spacer"></div>

        <div class="video">
          <VideoRtsp
              click-to-play
              :can-play="!showModal"
              v-if="videoList.length > 1"
              :title="videoList[1].firstVedioName"
              :bg-height="400"
              :width="500"
              :deviceConfig="videoList[1].deviceConfig"
          />
        </div>
      </div>
    </div>

    <!--右边-->
    <div class="block right">
      <!-- 隧道事件信息 -->
      <!--      <tunnel-event-info @loaded="onLoadTunnelData" _2d></tunnel-event-info>-->
      <tunnel-event-info @loaded="onLoadTunnelData" _2d/>

      <TipsTitle title="隧道关键参数" style="margin-top: 30px;"></TipsTitle>
      <div class="stats">
        <div class="stat-wrap">
          <div class="label">亮度(cd/m2)</div>
          <div class="stat brightness">
            <template v-if="tunnelData.singleDoubleType === 3">
              <div class="num">左洞：{{ tunnelData.brightNessLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelData.brightNessRight || 0 }}</div>
            </template>
            <div class="num" v-else>
              {{ tunnelData.brightNessLeft || tunnelData.brightNessRight || 0 }}
            </div>
          </div>
        </div>
        <div class="stat-wrap">
          <div class="label">CO/VI(ppm/m)</div>
          <div class="stat co">
            <template v-if="tunnelData.singleDoubleType === 3">
              <div class="num">左洞：{{ tunnelData.viLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelData.viRight || 0 }}</div>
            </template>
            <div class="num" v-else>
              {{ tunnelData.viLeft || tunnelData.viRight || 0 }}
            </div>
          </div>
        </div>
        <div class="stat-wrap">
          <!--狮子笼专用-->
          <div class="label">风速(m/s)</div>
          <div class="stat vi">
            <template v-if="tunnelData.singleDoubleType === 3">
              <div class="num">
                左洞：{{
                  tunnelData.windSpeedLeft || tunnelData.windDirectionLeft || 0
                }}
              </div>
              <div class="num">
                右洞：{{
                  tunnelData.windSpeedRight ||
                  tunnelData.windDirectionRight ||
                  0
                }}
              </div>
            </template>
            <div class="num" v-else>
              {{ tunnelData.windSpeedLeft || tunnelData.windSpeedRight || 0 }}
            </div>
          </div>
        </div>

        <!--
        <div class="stat-wrap">
          <div class="label">风速(m/s)</div>
          <div class="stat vi">
            <template v-if="tunnelData.singleDoubleType===3">
              <div class="num">左洞：{{ tunnelData.windSpeedLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelData.windSpeedRight || 0 }}</div>
            </template>
            <div class="num" v-else>{{ tunnelData.windSpeedLeft || tunnelData.windSpeedRight || 0 }}</div>
          </div>
        </div>

        <div class="stat-wrap">
          <div class="label">风向</div>
          <div class="stat brightness direction">
            <template v-if="tunnelData.singleDoubleType===3">
              <div class="num">左洞：{{ tunnelData.windDirectionLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelData.windDirectionRight || 0 }}</div>
            </template>
            <div class="num" v-else>{{ tunnelData.windDirectionLeft || tunnelData.windDirectionRight || 0 }}</div>
          </div>
        </div>
        !-->
      </div>
    </div>

    <!--弹窗-->
    <modal-control
        :device-name="showModalDeviceName"
        :classify-number="showModalClassify"
        v-model="showModal"
        @update="$refs.tunnel.listDeviceBaseOfTunnelPage()"
        :tunnel-id="tunnelId"
    />
  </div>

  <div v-else-if="displayMode === '3d'">
    <three-d-view ref="ThreeDViewRef"
                  :tunnel-info="tunnelInfo"
                  :tunnel-devices="deviceList"
                  @on-load="on3DLoad"/>

    <div class="switcher-wrapper threed">
      <el-radio-group v-model="displayMode" size="medium">
        <div class="page-list">
          <el-radio-button label="2d">2d</el-radio-button>
          <el-radio-button label="full2d">2d全屏</el-radio-button>
          <el-radio-button label="3d" v-if="threeDStatus === '1'"
          >3d
          </el-radio-button
          >
        </div>
      </el-radio-group>
    </div>
  </div>

  <div v-else-if="displayMode === 'full2d'" class="full-2d">
    <!--控制3d和2d-->
    <div class="switcher-wrapper threed">
      <el-radio-group v-model="displayMode" size="medium">
        <div class="page-list">
          <el-radio-button label="2d">2d</el-radio-button>
          <el-radio-button label="full2d">2d全屏</el-radio-button>
          <el-radio-button label="3d" v-if="threeDStatus === '1'">3d</el-radio-button>
        </div>
      </el-radio-group>
    </div>

    <tunnel-component @detail="doShowModalDevice"
                      full-screen
                      ref="tunnel"
                      :showActiveType="showActiveType"/>
    <div class="buttons">
      <div class="button-item"
           v-for="(item, index) in deviceTypes"
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

    <!--弹窗-->
    <modal-control
        :device-name="showModalDeviceName"
        :classify-number="showModalClassify"
        v-model="showModal"
        @update="$refs.tunnel.listDeviceBaseOfTunnelPage()"
        :tunnel-id="tunnelId"
    />
  </div>
</template>

<script>
import TunnelComponent from '../../components/2d/tunnel'
import TipsTitle from '../../components/index/tips-title'
import VideoRtsp from '../../components/video/video-rtsp'
import TunnelEventInfo from '../../components/home/tunnel-event-info'
import ModalControl from '../../components/2d/modal-control'

import ThreeDView from './3d'

export default {
  components: {
    ThreeDView,
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
      // displayMode: '2d',
      displayMode: '3d',
      deviceList: [],
      videoList: [],
      deviceTypes: [],
      showModal: false, // 弹窗
      showModalClassify: '', // 弹窗的设备分类
      showModalDeviceName: null, // 弹窗选中的设备名
      showActiveType: 'all',
      tunnelId: '',
      tunnelData: {},
      tunnelInfo: {},
      threeDStatus: '0',
      homeTimer: null,
      maxEndMapStakeMark: 0,
      minStartMapStakeMark: 0,
    }
  },

  beforeDestroy() {
    clearInterval(this.homeTimer)
    this.homeTimer = null
  },

  mounted() {
    this.init()

    this.listDeviceBaseOfTunnelPage()
    // this.homeTimer = setInterval(() => {
    //   this.init()
    // }, 5 * 1000)
    // initEvent
    this.$refs.ThreeDViewRef.initEvent()
  },
  methods: {
    on3DLoad() {

      this.$refs.ThreeDViewRef.initInfo()
    },

    // 隧道的设备列表
    listDeviceBaseOfTunnelPage() {
      this.$service.tunnel.getById(this.$route.query.tunnelId).then((res) => {
        // console.log(res)
        this.tunnelInfo = res;
      })

      this.$service._2d.getTunnelDevices(this.$route.query.tunnelId).then((res) => {
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
        let list = res.filter((v) => {
          let support = supportList.includes(v.classifyNumber)
          if (!support) console.warn('不支持显示设备', v)
          return support // positionFlag为空不显示
        })


        this.deviceList = list
        // 对比设备与隧道的起止桩号 获取隧道地图的长度
        for (let index in this.deviceList) {
          if (this.maxEndMapStakeMark > 0) {
            this.maxEndMapStakeMark = Math.max(
                this.deviceList[index].pileNumber,
                this.maxEndMapStakeMark
            )
          } else {
            this.maxEndMapStakeMark = this.deviceList[index].pileNumber
          }
          if (this.minStartMapStakeMark > 0) {
            this.minStartMapStakeMark = Math.min(
                this.deviceList[index].pileNumber,
                this.minStartMapStakeMark
            )
          } else {
            this.minStartMapStakeMark = this.deviceList[index].pileNumber
          }
        }

        console.log(this.deviceList)


        // this.$emit('loaded', res)
      })
    },

    init() {
      this.tunnelId = this.$route.query.tunnelId
      this.$service._2d.getTunnelVideos(this.tunnelId).then((res) => {
        // 获取隧道视频
        this.videoList = res
      })


      this.$service._2d.getTunnelDeviceTypes(this.tunnelId).then((res) => {
        // 获取隧道设备类型
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
