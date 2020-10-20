<template>
  <div v-if="displayMode==='2d'" class="page">
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
        <tunnel-component @detail="doShowModalDevice" ref="tunnel" :showActiveType="showActiveType">
          <div slot="controls" class="buttons">
            <div class="button-item" v-for="(item, index) in deviceTypes" :key="index"
                 @click="doShowModal(item.classifyNumber)">
              <div class="img-wrap">
                <img class="img"
                     :src="require('../../assets/images/warning/icons/'+item.classifyNumber+'.png')">
              </div>
              <p>{{ item.classifyName }}</p>
            </div>
          </div>
        </tunnel-component>
      </div>
      <div class="videos">
        <div class=" video">
          <VideoRtsp click-to-play :can-play="!showModal" v-if="videoList.length"
                     :title="videoList[0].firstVedioName"
                     :bg-height="400"
                     :width="500"
                     :deviceConfig="videoList[0].deviceConfig"></VideoRtsp>
        </div>
        <div class="spacer"></div>
        <div class=" video">
          <VideoRtsp click-to-play :can-play="!showModal" v-if="videoList.length>1"
                     :title="videoList[1].firstVedioName"
                     :bg-height="400"
                     :width="500"
                     :deviceConfig="videoList[1].deviceConfig"></VideoRtsp>
        </div>
      </div>
    </div>
    <!--右边-->
    <div class="block right">
      <!-- 隧道事件信息 -->
      <tunnel-event-info @loaded="onLoadTunnelData" _2d></tunnel-event-info>

      <TipsTitle title="隧道关键参数" style="margin-top: 30px;"></TipsTitle>
      <div class="stats">
        <div class="stat-wrap">
          <div class="label">亮度(cd/m2)</div>
          <div class="stat brightness">
            <template v-if="tunnelData.singleDoubleType===3">
              <div class="num">左洞：{{ tunnelData.brightNessLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelData.brightNessRight || 0 }}</div>
            </template>
            <div class="num" v-else>{{ tunnelData.brightNessLeft || tunnelData.brightNessRight || 0 }}</div>
          </div>
        </div>
        <div class="stat-wrap">
          <div class="label">CO/VI(ppm/m)</div>
          <div class="stat co">
            <template v-if="tunnelData.singleDoubleType===3">
              <div class="num">左洞：{{ tunnelData.viLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelData.viRight || 0 }}</div>
            </template>
            <div class="num" v-else>{{ tunnelData.viLeft || tunnelData.viRight || 0 }}</div>
          </div>
        </div>
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
      </div>
    </div>

    <!--弹窗-->
    <modal-control :device-name="showModalDeviceName" :classify-number="showModalClassify" v-model="showModal"
                   @update="$refs.tunnel.listDeviceBaseOfTunnelPage()" :tunnel-id="tunnelId"></modal-control>

  </div>
  <div v-else-if="displayMode==='3d'">
    <div style="width:100%;">
      <iframe :src='iframeUrl' v-if="iframeUrl" class="myframe" frameborder="0" scrolling="auto"
              style="position:absolute;bottom: 0;left: 0;z-index:1"></iframe>
    </div>
    <div class="switcher-wrapper threed">
      <el-radio-group v-model="displayMode" size="medium">
        <div class="page-list">
          <el-radio-button label="2d">2d</el-radio-button>
          <el-radio-button label="full2d">2d全屏</el-radio-button>
          <el-radio-button label="3d" v-if="threeDStatus === '1'">3d</el-radio-button>
        </div>
      </el-radio-group>
    </div>
  </div>
  <div v-else-if="displayMode==='full2d'" class="full-2d">
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
    <tunnel-component @detail="doShowModalDevice" full-screen ref="tunnel"
                      :showActiveType="showActiveType"></tunnel-component>
    <div class="buttons">
      <div class="button-item" v-for="(item, index) in deviceTypes" :key="index"
           @click="doShowModal(item.classifyNumber)">
        <div class="img-wrap">
          <img class="img"
               :src="require('../../assets/images/warning/icons/'+item.classifyNumber+'.png')">
        </div>
        <p>{{ item.classifyName }}</p>
      </div>
    </div>
    <!--弹窗-->
    <modal-control :device-name="showModalDeviceName" :classify-number="showModalClassify" v-model="showModal"
                   @update="$refs.tunnel.listDeviceBaseOfTunnelPage()" :tunnel-id="tunnelId"></modal-control>
  </div>
</template>

<script>
import TunnelComponent from '../../components/2d/tunnel';
import TipsTitle from '../../components/index/tips-title';
import VideoRtsp from '../../components/video/video-rtsp';
import TunnelEventInfo from '../../components/home/tunnel-event-info';
import ModalControl from '../../components/2d/modal-control';

export default {
  components: {TunnelComponent, TipsTitle, VideoRtsp, TunnelEventInfo, ModalControl},
  services: ['_2d'],
  watch: {
    '$route': function () {
      location.reload();
    }
  },
  data() {
    return {
      displayMode: '2d',
      deviceList: [],
      videoList: [],
      deviceTypes: [],
      showModal: false,   // 弹窗
      showModalClassify: '',  // 弹窗的设备分类
      showModalDeviceName: null,   // 弹窗选中的设备名
      showActiveType: 'all',
      iframeUrl: `/home/3d?tunnelId=${this.$route.query.tunnelId}`,
      tunnelId: '',
      tunnelData: {},
      threeDStatus: '0'
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.tunnelId = this.$route.query.tunnelId;
      this.$service._2d.getTunnelVideos(this.tunnelId).then(res => {   // 获取隧道视频
        this.videoList = res;
      });
      this.$service._2d.getTunnelDeviceTypes(this.tunnelId).then(res => {  // 获取隧道设备类型
        this.deviceTypes = [{classifyName: '全部', classifyNumber: 'all'}].concat(res);
      });

      // 获取是否显示3D
      this.$service._2d.getTunnelShow3D().then(res => {
        const threeDInfo = [...res].find(item => item.name === 'Show3D')
        // value === '1' 开启
        if (threeDInfo && threeDInfo.value) this.threeDStatus = threeDInfo.value

      })
    },
    onLoadTunnelData(e) {
      this.tunnelData = e;

      console.log(e)
    },
    doShowModalDevice(device) {
      this.doShowModal(device.classifyNumber, device.deviceName);
    },
    doShowModal(classifyNumber, deviceName) {
      this.showActiveType = classifyNumber;
      if (classifyNumber === 'all') return;
      this.showModal = true;
      this.showModalDeviceName = deviceName;
      this.showModalClassify = classifyNumber;
    }
  }
};
</script>

<style scoped lang="less">

.myframe {
  width: 100vw;
  height: 90vh;
  top: 100px;
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
        color: #C1D9FF;
        line-height: 20px;
        text-align: center;
      }

      &.brightness {
        background: url("../../assets/images/warning/icons/brightness.png") no-repeat;
        background-size: 100% 100%;
      }

      &.co {
        background: url("../../assets/images/warning/icons/co.png") no-repeat;
        background-size: 100% 100%;
      }

      &.vi {
        background: url("../../assets/images/warning/icons/vi.png") no-repeat;
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
