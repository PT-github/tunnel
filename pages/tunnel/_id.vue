<template>
  <div class="content">
    <!-- 头部 -->
    <div class="header">
      <span class="header-left">{{ title }}</span>
      <div class="header-center">
        <span
          class="text-2d"
          :class="{active: showActiveType === 'all'}"
          @click="showActiveDevice('all')"
        >2D总控</span>
        <template v-for="(item, index) in list">
          <span
            :class="{active: showActiveType === item.id}"
            :key="index + '_' + item.id"
            @click="showActiveDevice(item.id)"
          >{{ item.bookClassifyName }}</span>
        </template>
      </div>
      <div class="header-right">
        <span
          class="operation"
          @click="showTunnel = true"
        >切换隧道</span>
        <!-- <span class="operation" @click="handleSwitchTunnel(0)">返回首页</span> -->
        <span
          class="operation"
          @click="showActiveDevice('all')"
        >返回首页</span>
        <span
          class="operation"
          @click="logout"
        >退出</span>
        <div
          class="tunnel-list-container"
          v-show="showTunnel"
          @click="showTunnel = false"
        >
          <div class="tunnel-list">
            <div
              class="tunnel-list-item"
              :class="{active: currentTunnelIndex === index}"
              v-for="(item, index) in tunnelList"
              :key="item.id + '_tunnelList_' + index"
              @click.stop="handleSwitchTunnel(index)"
            >
              <div class="name">
                <span>{{ item.tunnelName }}</span>
              </div>
              <div class="des">
                <span>左洞：{{item.leftHoleLength}}米,右洞：{{item.rightHoleLength}}米</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="center">
      <!-- 暂时隐藏 -->
      <!-- <t-title class="l-title" :isFold="isFold" @is-fold="handleFold"></t-title> -->

      <!-- 左侧报警预测 -->
      <!-- 暂时隐藏 -->
      <!-- <div class="left-panel" :class="{ active: isFold }">
        <div class="left-top">
          <t-left-top-item text="今日事件报警" total="23"></t-left-top-item>
          <t-left-top-item text="今日设备报警" total="23"></t-left-top-item>
        </div>
        <t-left-title>事件报警</t-left-title>
        <div class="event-panel">
          <t-event-warn></t-event-warn>
          <t-event-warn></t-event-warn>
          <t-event-warn></t-event-warn>
          <t-event-warn></t-event-warn>
          <t-event-warn></t-event-warn>
          <t-event-warn></t-event-warn>
        </div>
        <t-left-title type="1">设备报警</t-left-title>
        <div class="device-panel">
          <t-device-warn></t-device-warn>
          <t-device-warn></t-device-warn>
          <t-device-warn></t-device-warn>
          <t-device-warn></t-device-warn>
        </div>
      </div> -->

      <!-- 中间切换头部 -->
      <div class="top-panel">
        <div class="icon icon-left" @click="switchTunnel(0)">
          <img src="../../assets/tunnel/xiangzuo@2x.png">
        </div>
        <div class="top-title">
          <span class="name">{{tunnelInfoData.belongsStretch}}-{{ tunnelInfoData.tunnelName }}</span>
          <span class="des">左洞长：{{ tunnelInfoData.leftHoleLength }}m,右洞长：{{ tunnelInfoData.rightHoleLength }}m</span>
        </div>
        <div class="icon icon-right" @click="switchTunnel(1)">
          <img src="../../assets/tunnel/xiangyou@2x.png">
        </div>
      </div>

      <!-- 中间隧道 -->
      <div class="center-panel">
        <t-tunnel :tunnelInfoData="tunnelInfoData" :tunnelDevices="tunnelDevices" :showActiveType="showActiveType" :showActiveclassifyNumber="showActiveclassifyNumber" @detail="doShowModalDevice"></t-tunnel>
      </div>

      <!-- 中间底部切换 -->
      <div class="bottom-panel" v-show="showActiveType === 'all'">
        <div v-for="(item, index) in tunnelDeviceTypes" @click="doShowModal(item.classifyNumber)" class="sel-button"
          :key="'list_' + item.classifyNumber">
          <!-- <img :src="require(`../../assets/tunnel/icon/${item.classifyNumber}.png`)" mode="widthFix"> -->
          <img :src="`${config.imagePrefix}/type/${item.classifyNumber}.png`" mode="widthFix">
          <span>{{ item.classifyName }}</span>
        </div>
      </div>
      
      <div class="bottom-panel" v-show="classfyIdNameMap[showActiveType] === '照明设备'">
        <div @click="showSeriesModal = true" class="sel-button">
          <img :src="`${config.imagePrefix}/type/lighttime.png`" mode="widthFix">
          <span>时序模式</span>
        </div>
        <div @click="doShowModal('lighting')" class="sel-button">
          <img :src="`${config.imagePrefix}/type/lightmanual.png`" mode="widthFix">
          <span>手动模式</span>
        </div>
        <div @click="showSmartModal = true" class="sel-button">
          <img :src="`${config.imagePrefix}/type/lightintelligence.png`" mode="widthFix">
          <span>智能模式</span>
        </div>
        <div @click="showEmergencyModal = true" class="sel-button">
          <img :src="`${config.imagePrefix}/type/lightemergency.png`" mode="widthFix">
          <span>应急模式</span>
        </div>
      </div>

      <!-- 右侧预警 -->
      <!-- 暂时隐藏 -->
      <!-- <div class="right-panel">
        <t-title :isFold="isFold" @is-fold="handleFold2">预警检测</t-title>
        <div class="prewarn-panel" :class="{ active: isFold2 }">
          <t-device-warn type="1"></t-device-warn>
          <t-device-warn type="1"></t-device-warn>
        </div>
      </div> -->

      <div class="right-cicle-control" @click="circleShow = !circleShow">
        <span>{{ circleShow ? '隐藏' : '统计' }}</span>
      </div>
      <!-- 右侧圆图 -->
      <div class="right-circle" v-show="circleShow">
        <div class="button-view" :class="'active_' + activeTab">
          <div class="bg"></div>
          <span class="txt cll" :class="{active: activeTab === 1}" @click="handleChange(1)">车流量</span>
          <span class="txt fsfx"  :class="{active: activeTab === 2}" @click="handleChange(2)">风速风向</span>
          <span class="txt gq"  :class="{active: activeTab === 3}" @click="handleChange(3)">光强</span>
          <span class="txt covi"  :class="{active: activeTab === 4}" @click="handleChange(4)">CO/Vi</span>
          <span class="txt jnyd"  :class="{active: activeTab === 5}" @click="handleChange(5)">节能用电</span>
          <span class="txt xfsb"  :class="{active: activeTab === 6}" @click="handleChange(6)">消防水泵</span>
          <span class="txt sdhj"  :class="{active: activeTab === 7}" @click="handleChange(7)">隧道环境</span>
        </div>
        
        <div :show-scrollbar="true" class="msg-info" :scroll-y="true">
          <!-- 车流量 -->
          <template v-if="activeTab === 1">
            <div class="form-list">
              <div class="form-control" v-if="trafficVolume.leftRightFlag === 3 || trafficVolume.leftRightFlag === 2">
                <span class="label">左洞</span>
                <span class="value">{{ trafficVolume.statLeftValue }}</span>
              </div>
              <div class="form-control" v-if="trafficVolume.leftRightFlag === 3 || trafficVolume.leftRightFlag === 1">
                <span class="label">右洞</span>
                <span class="value">{{ trafficVolume === 3 ? trafficVolume.statRightValue : trafficVolume.statLeftValue }}</span>
              </div>
            </div>
          </template>
          <!-- 风速风向 -->
          <template v-else-if="activeTab === 2">
            <div class="form-list">
              <div class="form-control" v-for="(item, index) in sensorList" :key="'sensorList_' + index">
                <span class="label">{{ item.name }}</span>
                <span class="value">{{ item.sensorValText }}</span>
              </div>
            </div>
          </template>
          <!-- 光强 -->
          <template v-else-if="activeTab === 3">
            <div class="form-list">
              <div class="form-control" v-for="(item, index) in luminometerData" :key="'luminometerData_' + index">
                <span class="label">{{ item.name }}</span>
                <span class="value">{{ item.sensorValText }}</span>
              </div>
            </div>
          </template>
          <!-- COVI -->
          <template v-else-if="activeTab === 4">
            <div class="form-list">
              <div class="form-control" v-for="(item, index) in coViData" :key="'coViData_' + index">
                <span class="label">{{ item.name }}</span>
                <span class="value">{{ item.sensorValText }}</span>
              </div>
            </div>
          </template>
          <!-- 节能用电 -->
          <template v-else-if="activeTab === 5">
            <div class="power">
              <span class="info-title">本年电量</span>
              <span v-if="energyConsum.leftRightFlag !== 2">右洞：{{ energyConsum.byRightValue }}KW</span>
              <span v-if="energyConsum.leftRightFlag !== 1">左洞：{{ energyConsum.byLeftValue }}KW</span>
              <span v-if="energyConsum.leftRightFlag === 3">对比节能：{{ energyConsum.byContrastValue }}%</span>
              <span class="info-title">本月用量</span>
              <span v-if="energyConsum.leftRightFlag !== 2">右洞：{{ energyConsum.bmRightValue }}KW</span>
              <span v-if="energyConsum.leftRightFlag !== 1">左洞：{{ energyConsum.bmLeftValue }}KW</span>
              <span v-if="energyConsum.leftRightFlag === 3">对比节能：{{ energyConsum.bmContrastValue }}%</span>
            </div>
          </template>
          <!-- 消防水泵 -->
          <template v-else-if="activeTab === 6">
            <div class="form-list">
              <div class="form-control" v-for="(item, index) in waterlevelData" :key="'waterlevelData_' + index">
                <span class="label">{{ item.name }}</span>
                <span class="value">{{ item.sensorValText }}</span>
              </div>
            </div>
          </template>
          <!-- 隧道环境 -->
          <template v-else-if="activeTab === 7">
            <div class="form-list">
              <div class="form-control" v-for="(item, index) in humidityTemperatureData" :key="'humidityTemperatureData_' + index">
                <span class="label">{{ item.name }}</span>
                <span class="value">{{ item.sensorValText }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <!-- 时序模式 -->
      <t-modal-control v-model="showSeriesModal">
        <t-modal-series title="时序模式" :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['lighting']" @close="showSeriesModal = false"/>
      </t-modal-control>
      
      <!-- 智能模式 -->
      <t-modal-control v-model="showSmartModal">
        <t-modal-smart title="智能模式" :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['lighting']" @close="showSmartModal = false"/>
      </t-modal-control>
      
      <!-- 应急模式 -->
      <t-modal-control v-model="showEmergencyModal">
        <t-modal-emergency title="应急模式" :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['lighting']" @close="showEmergencyModal = false"/>
      </t-modal-control>


      <t-modal-control v-model="showModal">
        <!--照明-->
        <template v-if="showModalClassify==='lighting'">
          <t-modal-lighting :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['lighting']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-lighting>
        </template>
        
        <!-- 车道指示器 -->
        <template v-else-if="showModalClassify==='laneIndicator'">
          <t-modal-laneIndicator :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['laneIndicator']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-laneIndicator>
        </template>
        
        <!--信号灯-->
        <template v-else-if="showModalClassify==='signallamp'">
          <t-modal-signallamp :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['signallamp']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-signallamp>
        </template>
        
        <!--电话-->
        <template v-else-if="showModalClassify==='urgentphone'">
          <t-modal-urgentphone :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['urgentphone']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-urgentphone>
        </template>
        
        <!--火灾-->
        <template v-else-if="showModalClassify==='conflagration'">
          <t-modal-conflagration :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['conflagration']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-conflagration>
        </template>
        
        <!--水位-->
        <template v-else-if="showModalClassify==='waterlevel'">
          <t-modal-waterlevel :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['waterlevel']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-waterlevel>
        </template>
        
        <!--风机-->
        <template v-else-if="showModalClassify==='draughtfan'">
          <t-modal-draughtfan :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['draughtfan']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-draughtfan>
        </template>
        
        <!--广播-->
        <template v-else-if="showModalClassify==='broadcast'">
          <t-modal-broadcast :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['broadcast']" @close="handleClose" @update-device="handleUpdateDevice" @update-devices="handleUpdateDevices"></t-modal-broadcast>
        </template>
        
        <!--横洞卷闸门-->
        <template v-else-if="showModalClassify==='tunneldoor'">
          <t-modal-tunneldoor :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['tunneldoor']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-tunneldoor>
        </template>
        
        <!--发电机-->
        <template v-else-if="showModalClassify==='dynamotor'">
          <t-modal-dynamotor :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['dynamotor']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-dynamotor>
        </template>
        
        <!--环境-->
        <template v-else-if="showModalClassify==='environment'">
          <t-modal-environment :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['environment']" @close="handleClose" @update-devices="handleUpdateDevices"></t-modal-environment>
        </template>
        
        <!--视频-->
        <template v-else-if="showModalClassify==='video'">
          <t-modal-video :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['video']" @close="handleClose"></t-modal-video>
        </template>
        
        <!--情报板-->
        <template v-if="showModalClassify==='intelligenceboard'">
          <t-modal-intelligenceboard :tunnelId="tunnelInfoData.id" :tunnelInfoData="tunnelInfoData" :classifyId="classifyFormat['intelligenceboard']" @close="handleClose" @update-device="handleUpdateDevice" @update-devices="handleUpdateDevices"></t-modal-intelligenceboard>
        </template>
      </t-modal-control>

    </div>
  </div>
</template>

<script>
// import TipsTitle from "../../components/index/tips-title";
// import TunnelComponent from "@/components/2d/tunnel";
// import VideoRtsp from "../../components/video/video-rtsp";
// import TunnelEventInfo from "../../components/home/tunnel-event-info";
// import ModalControl from "../../components/2d/modal-control";

// import TunnelEvent from "@/components/2d/event";
import * as config from "@/utils/constant";
import TTunnel from "../../components/t-tunnel/t-tunnel";
import tModalControl from "../../components/tunnel-new/t-modal-control/t-modal-control";
import tModalSeries from "../../components/tunnel-new/t-modal-series/t-modal-series";
import tModalSmart from "../../components/tunnel-new/t-modal-smart/t-modal-smart";
import tModalEmergency from "../../components/tunnel-new/t-modal-emergency/t-modal-emergency";
import tModalLighting from "../../components/tunnel-new/t-modal-lighting/t-modal-lighting";
import tModalLaneIndicator from "../../components/tunnel-new/t-modal-laneIndicator/t-modal-laneIndicator";
import tModalSignallamp from "../../components/tunnel-new/t-modal-signallamp/t-modal-signallamp";
import tModalUrgentphone from "../../components/tunnel-new/t-modal-urgentphone/t-modal-urgentphone";
import tModalConflagration from "../../components/tunnel-new/t-modal-conflagration/t-modal-conflagration";
import tModalWaterlevel from "../../components/tunnel-new/t-modal-waterlevel/t-modal-waterlevel";
import tModalDraughtfan from "../../components/tunnel-new/t-modal-draughtfan/t-modal-draughtfan";
import tModalBroadcast from "../../components/tunnel-new/t-modal-broadcast/t-modal-broadcast";
import tModalTunneldoor from "../../components/tunnel-new/t-modal-tunneldoor/t-modal-tunneldoor";
import tModalDynamotor from "../../components/tunnel-new/t-modal-dynamotor/t-modal-dynamotor";
import tModalEnvironment from "../../components/tunnel-new/t-modal-environment/t-modal-environment";
// import tModalVideo from "../../components/tunnel-new/t-modal-video/t-modal-video";
import tModalIntelligenceboard from "../../components/tunnel-new/t-modal-intelligenceboard/t-modal-intelligenceboard";
export default {
  components: {
    TTunnel,
    tModalControl,
    tModalSeries,
    tModalSmart,
    tModalEmergency,
    tModalLighting,
    tModalLaneIndicator,
    tModalSignallamp,
    tModalUrgentphone,
    tModalConflagration,
    tModalWaterlevel,
    tModalDraughtfan,
    tModalBroadcast,
    tModalTunneldoor,
    tModalDynamotor,
    tModalEnvironment,
    // tModalVideo,
    tModalIntelligenceboard,
  },
  services: ["_2d", "tunnel", "tunnel_2d"],
  events: {
    onDeviceStatusChange: "deviceStatusChange"
  },
  name: "Tunnel2D",
  data() {
    return {
      showSmartModal: false, //智能模式
      showEmergencyModal: false, // 应急模式
      showSeriesModal: false, // 时序模式
      showTunnel: false,
      showSingleDeviceModal: false,
      singleModalData: {
        title: "", //标题
        classifyNumber: "", // 类别
        data: {} // 设备数据
      },
      singleDeviceOthers: [
        "video",
        "dynamotor",
        "tunneldoor",
        "lighting",
        "laneIndicator",
        "signallamp",
        "urgentphone",
        "waterlevel",
        "conflagration",
        "draughtfan",
        "environment"
      ], // 使用同一模板的设备类别

      list: [], // 所有设备分类
      config,
      activeTab: 1,
      circleShow: false,
      title: "湘高信科隧道智能管控平台",
      // 隧道列表
      tunnelList: [],
      // 当前隧道
      tunnelInfoData: {
        tunnelName: ""
      },
      currentTunnelIndex: 0,

      // 设备列表
      tunnelDevices: [],

      // 隧道的设备类型
      tunnelDeviceTypes: [],

      // 隧道支持控制的设备类型
      tunnelSupports: [
        "dynamotor",
        "signallamp",
        "laneIndicator",
        "urgentphone",
        "broadcast",
        "conflagration",
        "lighting",
        "waterlevel",
        "environment",
        "tunneldoor",
        "draughtfan",
        "video",
        "intelligenceboard"

        // 'guidelight',
        // 'electronicfence',
      ],

      // 当前显示的设备类型
      showActiveType: "all",
      showActiveclassifyNumber: "all",
      // 是否显示弹窗控制
      showModal: false,
      // 弹窗显示选中的设备名
      showModalDeviceName: "",
      // 弹窗显示选中的设备匪类
      showModalClassify: "",

      // 车流量
      trafficVolume: {
        leftRightFlag: "", // 1右 2左 3双
        statLeftValue: "", // 单洞显示改值
        statRightValue: ""
      },

      // 隧道环境
      energyConsum: {
        tunnelId: null,
        leftRightFlag: null,
        bmLeftValue: null,
        byLeftValue: null,
        bmRightValue: null,
        byRightValue: null,
        bmLeftContrastValue: null,
        byLeftContrastValue: null,
        bmRightContrastValue: null,
        byRightContrastValue: null,
        bmContrastValue: null,
        byContrastValue: null
      },

      // 风速风向
      sensorList: [],

      // 光强
      luminometerData: [],

      // covi数据
      coViData: [],

      // 消防水泵数据
      waterlevelData: [],

      // 隧道环境数据
      humidityTemperatureData: []
    };
  },
  computed: {
    classifyFormat() {
      let obj = {};
      this.tunnelDeviceTypes.forEach(item => {
        obj[item.classifyNumber] = item.id;
      });
      return obj;
    },
    classifyNameFormat() {
      let obj = {};
      this.tunnelDeviceTypes.forEach(item => {
        obj[item.classifyNumber] = item.classifyName;
      });
      return obj;
    },
    classfyIdNameMap() {
      let obj = {};
      this.list.forEach(item => {
        obj[item.id] = item.bookClassifyName;
      });
      return obj;
    }
  },
  onLoad() {},
  async created() {
    await this.getTunnelList();
    await this.getTunnelInfo(this.tunnelInfoData.id);
    await Promise.all([
      this.getAppointListAll(),
      this.getTunnelDeviceTypes(),
      this.getTunnelDevice(),
      this.initCircleData()
    ]);
  },
  async mounted() {
    let self = this;
    this.windowWidth = this.$el.offsetWidth
    console.log(this.windowWidth, '====')
    // uni.connectSocket({
    //   url: `${config.ws}/${this.$store.state.myUserInfo.userId}`,
    //   header: {
    //     "content-type": "application/json"
    //   },
    //   method: "GET"
    // });
    // uni.onSocketOpen(function(res) {
    //   console.log("WebSocket连接已打开！");
    // });
    // uni.onSocketError(function(res) {
    //   console.log("WebSocket连接打开失败，请检查！");
    // });

    // uni.onSocketMessage(function(res) {
    //   // TODO
    //   console.log("收到服务器内容：" + res);
    //   try {
    //     let data = JSON.parse(res);
    //     self.handleDevice(data);
    //     // self.handleDevice(data.deviceWarningNotify || data.deviceWarningNotifyList)
    //   } catch (e) {
    //     //TODO handle the exception
    //   }
    // });
  },
  methods: {
    handleDevice(res) {
      if (res.deviceWarningNotify) {
        // 单个设备
        let data = res.deviceWarningNotify;
        for (let i = 0; i < this.tunnelDevices.length; i++) {
          if (this.tunnelDevices[i].id === data.deviceId) {
            this.$set(
              this.tunnelDevices,
              i,
              Object.assign({}, this.tunnelDevices[i], data)
            );
            break;
          }
        }
      } else if (
        res.deviceWarningNotifyList &&
        res.deviceWarningNotifyList.length
      ) {
        // 多个设备
        let obj = {},
          list = res.deviceWarningNotifyList;
        list.forEach(item => {
          obj[item.deviceId] = item;
        });
        for (let i = 0; i < this.tunnelDevices.length; i++) {
          if (obj[this.tunnelDevices[i].id]) {
            this.$set(
              this.tunnelDevices,
              i,
              Object.assign(
                {},
                this.tunnelDevices[i],
                obj[this.tunnelDevices[i].id]
              )
            );
            break;
          }
        }
      }
    },
    // 单个设备刷新
    handleUpdateDevice(data) {
      if (data && data.id) {
        this.$service.tunnel_2d
          .deviceStatusChange({
            deviceId: data.id
          })
          .then(res => {
            console.log("====设备执行成功，主动告知服务器====");
            console.log(res);
            console.log("====设备执行成功，主动告知服务器====");
          });
      }
    },
    handleUpdateDevices(list, classifyNumber) {
      // if (list && list.length) {
      this.$service.tunnel_2d
        .deviceStatusClassChange({
          tunnelId: this.tunnelInfoData.id,
          classifyId: this.classifyFormat[
            classifyNumber || this.showModalClassify
          ]
        })
        .then(res => {
          console.log("====批量--设备执行成功，主动告知服务器====");
          console.log(res);
          console.log("====批量--设备执行成功，主动告知服务器====");
        });
      // }
    },
    logout() {
      this.$service.tunnel_2d.loginOut().then(res => {
        this.$store.commit("logout");
        // uni.navigateTo({
        //   url: "/pages/login/login"
        // });
      });
    },
    // 头部分类 筛选
    showActiveDevice(type) {
      this.showActiveType = type;
      this.showActiveclassifyNumber = "all";
    },
    getAppointListAll() {
      return this.$service.tunnel_2d.getAppointListAll().then(res => {
        this.list = res.data;
      });
    },
    handleClose() {
      this.showModal = false;
    },
    handleSingleClose() {
      this.showSingleDeviceModal = false;
    },
    handleChange(idx) {
      if (this.activeTab === idx) {
        return;
      }
      this.activeTab = idx;
    },
    // 初始化右侧圆圈数据
    async initCircleData() {
      return Promise.all([
        this.getTunnelTrafficVolume(),
        this.getDataSensorInfo(),
        this.getLuminometer(),
        this.getCoVi(),
        this.getEnergyConsum(),
        this.getWaterlevel(),
        this.getHumidityTemperature()
      ]);
    },

    // 获取车流量
    getTunnelTrafficVolume() {
      return this.$service.tunnel_2d
        .getTunnelTrafficVolume({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          let data = res.data;
          this.trafficVolume.leftRightFlag = data.leftRightFlag;
          this.trafficVolume.statLeftValue = data.statLeftValue;
          this.trafficVolume.statRightValue = data.statRightValue;
        });
    },
    // 查询控制的数值-风速风向
    getDataSensorInfo() {
      return this.$service.tunnel_2d
        .getDataSensorInfo({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          let data = res.data;
          this.sensorList = data.map(v => {
            let pileNumber = v.pileNumber;
            let name =
              "K" +
              Math.floor(pileNumber / 1000) +
              "+" +
              Math.floor(pileNumber % 1000);
            return Object.assign(v, { name });
          });
        });
    },
    // 查询控制的数值-光强
    getLuminometer() {
      return this.$service.tunnel_2d
        .getLuminometer({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          let data = res.data;
          this.luminometerData = data.map(v => {
            let pileNumber = v.pileNumber;
            let name =
              "K" +
              Math.floor(pileNumber / 1000) +
              "+" +
              Math.floor(pileNumber % 1000);
            return Object.assign(v, { name });
          });
        });
    },
    // 查询 - COVI
    getCoVi() {
      return this.$service.tunnel_2d
        .getCoVi({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          let data = res.data;
          this.coViData = data.map(v => {
            let pileNumber = v.pileNumber;
            let name =
              "K" +
              Math.floor(pileNumber / 1000) +
              "+" +
              Math.floor(pileNumber % 1000);
            return Object.assign(v, { name });
          });
        });
    },
    // 查询 节能用电
    getEnergyConsum() {
      return this.$service.tunnel_2d
        .getEnergyConsum({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          let data = res.data;
          this.energyConsum.tunnelId = data.tunnelId;
          this.energyConsum.leftRightFlag = data.leftRightFlag;
          this.energyConsum.bmLeftValue = data.bmLeftValue;
          this.energyConsum.byLeftValue = data.byLeftValue;
          this.energyConsum.bmRightValue = data.bmRightValue;
          this.energyConsum.byRightValue = data.byRightValue;
          this.energyConsum.bmLeftContrastValue = data.bmLeftContrastValue;
          this.energyConsum.byLeftContrastValue = data.byLeftContrastValue;
          this.energyConsum.bmRightContrastValue = data.bmRightContrastValue;
          this.energyConsum.byRightContrastValue = data.byRightContrastValue;
          this.energyConsum.bmContrastValue = data.bmContrastValue;
          this.energyConsum.byContrastValue = data.byContrastValue;
        });
    },
    // 查询-消防水泵
    getWaterlevel() {
      return this.$service.tunnel_2d
        .getWaterlevel({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          let data = res.data;
          this.waterlevelData = data.map(v => {
            let pileNumber = v.pileNumber;
            let name =
              "K" +
              Math.floor(pileNumber / 1000) +
              "+" +
              Math.floor(pileNumber % 1000);
            return Object.assign(v, { name });
          });
        });
    },
    // 查询-隧道环境
    getHumidityTemperature() {
      return this.$service.tunnel_2d
        .getHumidityTemperature({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          let data = res.data;
          this.humidityTemperatureData = data.map(v => {
            let pileNumber = v.pileNumber;
            let name =
              "K" +
              Math.floor(pileNumber / 1000) +
              "+" +
              Math.floor(pileNumber % 1000);
            return Object.assign(v, { name });
          });
        });
    },

    doShowModalDevice(device) {
      let showClassifyNumber = [
        "intelligenceboard",
        "broadcast",
        ...this.singleDeviceOthers
      ];
      if (showClassifyNumber.indexOf(device.classifyNumber) !== -1) {
        this.singleModalData.title = device.deviceName + device.pileNumberStr;
        this.singleModalData.classifyNumber = device.classifyNumber;
        this.$set(this.singleModalData, "data", device);
        this.$nextTick(function() {
          this.showSingleDeviceModal = true;
        });
      }
    },

    // 点击控制类型 显示弹窗
    doShowModal(classifyNumber, deviceName) {
      this.showActiveclassifyNumber = classifyNumber;
      if (classifyNumber === "all") {
        this.showActiveType = classifyNumber;
        return;
      }
      const showModalClassifyNumber = [
        "intelligenceboard",
        "video",
        "environment",
        "dynamotor",
        "tunneldoor",
        "lighting",
        "draughtfan",
        "laneIndicator",
        "signallamp",
        "urgentphone",
        "conflagration",
        "waterlevel",
        "broadcast"
      ];
      if (showModalClassifyNumber.indexOf(classifyNumber) !== -1) {
        this.showModal = true;
        this.showModalDeviceName = deviceName;
        this.showModalClassify = classifyNumber;
      }
    },

    // 获取隧道下的设备和情报板数据
    getTunnelDevice() {
      return Promise.all([
        this.$service.tunnel_2d.getTunnelDevice({
          tunnelId: this.tunnelInfoData.id
        }),
        this.$service.tunnel_2d.getIntelligenceBoardList({
          classifyNumber: "intelligenceboard",
          tunnelId: this.tunnelInfoData.id
        })
      ]).then(list => {
        let deviceList = list[0].data;
        let intelligenceboardList = list[1] ? list[1].data || [] : [],
          intelligenceboardKeyMap = {};
        for (let i = 0; i < intelligenceboardList.length; i++) {
          if (
            intelligenceboardList[i].boardlatestissue &&
            intelligenceboardList[i].boardlatestissue.content
          ) {
            try {
              let content = JSON.parse(
                intelligenceboardList[i].boardlatestissue.content
              ).data;
              if (content.length === 1) {
                content = [...content, ...content, ...content, ...content];
              } else if (content.length < 3) {
                content = [...content, ...content];
              }
              intelligenceboardKeyMap[
                intelligenceboardList[i].id
              ] = content.map(item => item.text.trim()); // 情报板节目列表
            } catch (e) {
              //TODO handle the exception
              console.log(
                `情报板ID${intelligenceboardList[i].id}`,
                "解析情报板节目单信息失败",
                e
              );
            }
          }
        }
        this.$set(
          this,
          "tunnelDevices",
          deviceList
            .filter(v => {
              let support = this.tunnelSupports.includes(v.classifyNumber);
              if (intelligenceboardKeyMap[v.id]) {
                v.content = intelligenceboardKeyMap[v.id];
              }
              if (!support) console.warn("不支持显示设备", v);
              return support; // positionFlag为空不显示
            })
            .map(item => {
              if (item.sensorValTextShow) {
                try {
                  let arry = [],
                    sensorValTextShow = JSON.parse(item.sensorValTextShow);
                  for (let props in sensorValTextShow) {
                    arry.push({ name: props, value: sensorValTextShow[props] });
                  }
                  item.sensorValTextList = arry;
                } catch (e) {
                  //TODO handle the exception
                  console.log("设备解析sensorValTextShow字段报错");
                }
              }
              return item;
            })
        );
        // .then(res => {
        //   this.$set(this, 'tunnelDevices', res.filter(v => {
        //     let support = this.tunnelSupports.includes(v.classifyNumber);
        //     if (!support) console.warn('不支持显示设备', v);
        //     return support; // positionFlag为空不显示
        //   }))
        // })
      });
    },

    // 获取隧道的设备类型
    getTunnelDeviceTypes() {
      return this.$service.tunnel_2d
        .getDeviceClassify({
          tunnelId: this.tunnelInfoData.id
        })
        .then(res => {
          const deviceTypeis = res.data.filter(
            item =>
              item.classifyName !== "控制器" &&
              item.classifyName !== "诱导灯" &&
              item.classifyName !== "电子围栏" &&
              item.classifyNumber !== "other"
          );

          // this.tunnelDeviceTypes = [{
          //   classifyName: '全部',
          //   classifyNumber: 'all'
          // }, ].concat(deviceTypeis)
          this.$set(
            this,
            "tunnelDeviceTypes",
            [
              {
                classifyName: "全部",
                classifyNumber: "all"
              }
            ].concat(deviceTypeis)
          );
        });
    },

    async handleSwitchTunnel(index) {
      this.currentTunnelIndex = index;
      this.showTunnel = false;
      await this.getTunnelInfo(this.tunnelList[this.currentTunnelIndex].id);
      await this.getTunnelDeviceTypes();
      await this.getTunnelDevice();
      await this.initCircleData();
    },

    async switchTunnel(v) {
      let index = this.currentTunnelIndex;
      switch (v) {
        // 向前
        case 0:
          index = index === 0 ? this.tunnelList.length - 1 : index - 1;
          break;
        // 向后
        default:
          index = index === this.tunnelList.length - 1 ? 0 : index + 1;
          break;
      }
      this.currentTunnelIndex = index;
      await this.getTunnelInfo(this.tunnelList[this.currentTunnelIndex].id);
      await this.getTunnelDeviceTypes();
      await this.getTunnelDevice();
      await this.initCircleData();
    },
    // 获取隧道详情
    getTunnelInfo(id) {
      return this.$service.tunnel_2d
        .getTunnelDetail({
          id
        })
        .then(res => {
          this.$set(this, "tunnelInfoData", res.data);
        });
    },
    // 获取隧道列表 并设置默认隧道信息
    getTunnelList() {
      return this.$service.tunnel_2d
        .getTunnelList({
          page: 1,
          pageSize: 100
        })
        .then(res => {
          this.tunnelList = res.data.records;
          this.$set(this, "tunnelInfoData", this.tunnelList[3]);
          this.currentTunnelIndex = 3;
          // this.$set(this, 'tunnelInfoData', this.tunnelList[0])
          // this.currentTunnelIndex = 0
        });
    },

    handleClick() {
      console.log("111");
    },
    handleFold(v) {
      this.isFold = v;
    },
    handleFold2(v) {
      this.isFold2 = v;
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  font-size: 16px;
  font-family: Microsoft YaHei;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  height: 100vh;
  background: url(../../assets/tunnel/bg.png) center / 86px repeat;
  overflow: hidden;
  .center {
    width: 1920px;
    height: calc(100% - 60px);
    position: relative;

    .l-title {
      position: absolute;
      top: 53px;
      left: 14px;
    }

    .center-panel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .right-cicle-control {
      position: absolute;
      right: 30px;
      bottom: 40px;
      border: 1px solid red;
      width: 80px;
      height: 40px;
      text-align: center;
      border: 1px solid #0568ee;
      color: #ffffff;
      line-height: 40px;
      background-color: #0568ee;
    }
    .right-circle {
      position: absolute;
      right: 20px;
      bottom: 98px;
      width: 330px;
      height: 330px;
      z-index: 100;
      background: rgba(0, 0, 0, 0.7) url(../../assets/tunnel/bg-inner.png) center
        center / 250px auto no-repeat;
      border-radius: 50%;
      .button-view {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        .bg {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: url(../../assets/tunnel/bg1.png) center center / 275px auto
            no-repeat;
          transition: transform 0.1s;
        }
        &.active_1 {
          .bg {
            transform: rotate(0);
          }
        }
        &.active_2 {
          .bg {
            transform: rotate(-51deg);
          }
        }
        &.active_3 {
          .bg {
            transform: rotate(-105deg);
          }
        }
        &.active_4 {
          .bg {
            transform: rotate(-154deg);
          }
        }
        &.active_5 {
          .bg {
            transform: rotate(-205deg);
          }
        }
        &.active_6 {
          .bg {
            transform: rotate(-258deg);
          }
        }
        &.active_7 {
          .bg {
            transform: rotate(-308deg);
          }
        }
        .txt {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          position: absolute;
          &.active {
            color: #4995fe;
          }
        }
        .cll {
          left: 137px;
          top: 7px;
        }
        .fsfx {
          left: 17px;
          top: 63px;
          transform: rotate(-50deg);
        }
        .gq {
          left: -3px;
          top: 187px;
          transform: rotate(-103deg);
        }

        .covi {
          left: 70px;
          top: 290px;
          transform: rotate(26deg);
        }

        .jnyd {
          left: 198px;
          top: 295px;
          transform: rotate(-22deg);
        }

        .xfsb {
          right: -18px;
          top: 192px;
          transform: rotate(102deg);
        }

        .sdhj {
          right: 15px;
          top: 64px;
          transform: rotate(50deg);
        }
      }
      .msg-info {
        width: 195px;
        height: 195px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        padding: 20px;
        box-sizing: border-box;

        span {
          font-size: 14px;
          font-weight: 400;
          color: #ffffff;
          display: block;
          line-height: 14px;
        }

        .info-title {
          font-size: 16px;
          font-weight: bold;
          color: #4b95fa;
          margin: 0;
          padding: 4px 0;
          line-height: 16px;
        }
        .power {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          span {
            height: 23px;
            line-height: 23px;
          }
        }
        .form-list {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          .form-control {
            display: flex;
            height: 25px;
            line-height: 25px;
            .label,
            .value {
              flex: 1;
              font-size: 14px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: center;
            }
            .value {
              padding-left: 5px;
              font-size: 14px;
              box-sizing: border-box;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .table-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          .table-header,
          .table-tr {
            display: flex;
            span {
              flex: 1;
              text-align: center;
            }
          }
        }
      }
    }

    .right-panel {
      width: 313px;
      height: 300px;
      position: absolute;
      bottom: 23px;
      right: 0;

      .prewarn-panel {
        margin-top: 20px;
        height: 0;
        transition: height 0.1s linear;
        box-sizing: border-box;
        overflow: hidden;

        &.active {
          height: 120px;
        }

        .t-device-warn + .t-device-warn {
          margin-top: 15px;
        }
      }
    }

    .bottom-panel {
      width: 1600px;
      height: 99px;
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      background: url(../../assets/tunnel/bottom-bg.png) center / 1600px 99px no-repeat;
      display: flex;
      justify-content: space-around;

      .sel-button {
        width: 85px;
        height: 99px;
        background-position: center 12px;
        background-repeat: no-repeat;
        background-size: 60px auto;
        font-size: 14px;
        font-weight: 400;
        color: #5da0fe;
        text-align: center;
        flex-shrink: 0;

        img {
          width: 60px;
          display: block;
          margin: 10px auto 2px;
        }
      }
    }

    .top-panel {
      width: 580px;
      height: 60px;
      border: 1px solid #072d66;
      background-color: #0a0443;
      display: flex;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 42px;
      z-index: 1;

      .icon {
        width: 60px;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        img {
          width: 26px;
          height: 26px;
          margin: 0 auto;
        }
      }

      .top-title {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .icon-left {
        border-right: 1px solid #072d66;
      }

      .icon-right {
        border-left: 1px solid #072d66;
      }

      .name {
        font-size: 24px;
        font-weight: bold;
        color: #4995fe;
        line-height: 24px;
        text-align: center;
        padding: 8px 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .des {
        font-size: 16px;
        font-weight: 400;
        color: #4995fe;
        line-height: 15px;
        text-align: center;
      }
    }

    .left-panel {
      height: 0;
      position: absolute;
      top: 115px;
      left: 17px;
      transition: height 0.2s linear;
      // background: red;
      width: 320px;
      overflow: hidden;

      &.active {
        height: 840px;
      }

      .left-top {
        display: flex;

        .t-left-top-item + .t-left-top-item {
          margin-left: 11px;
        }
      }

      .event-panel {
        display: flex;
        flex-wrap: wrap;

        .t-event-warn {
          margin-bottom: 17px;

          &:nth-child(2n + 1) {
            margin-right: 11px;
          }
        }
      }

      .device-panel {
        .t-device-warn {
          margin-bottom: 15px;
        }
      }
    }
  }

  .header {
    width: 1920px;
    height: 57px;
    background: url(../../assets/tunnel/top_bg@2x.png) left bottom / 1920px 50px
      no-repeat;
    position: relative;
  }

  .header-left {
    font-size: 22px;
    font-weight: bold;
    color: #88b9fd;
    line-height: 55px;
    height: 50px;
    margin-top: 20px;
    padding-left: 61px;
    background: url(../../assets/tunnel/lo.png) 21px center / 30px
      30px no-repeat;
  }

  .header-center {
    display: flex;
    position: absolute;
    top: 7px;
    left: 474px;
    right: 400px;
    justify-content: space-between;

    span {
      font-weight: 400;
      color: #dfeef3;
      line-height: 50px;
      position: relative;
      &.active {
        color: #4995fe;
        font-weight: bold;
      }
    }

    .text-2d {
      padding: 0 28px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 18px;
        width: 21px;
        height: 14px;
        background: url(../../assets/tunnel/2D.png) center / 21px 14px
          no-repeat;
      }

      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 18px;
        width: 21px;
        height: 14px;
        background: url(../../assets/tunnel/2D.png) center / 21px 14px
          no-repeat;
      }
    }
  }

  .header-right {
    display: flex;
    position: absolute;
    top: 7px;
    right: 0;
    width: 330px;
    justify-content: space-around;

    .tunnel-list-container {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 100;
    }
    .tunnel-list {
      position: absolute;
      top: 57px;
      right: 100px;
      z-index: 1;
      border: 1px solid #072d66;
      border-radius: 8px;
      background-color: #0a0443;
      padding: 18px 28px;
      .name {
        font-size: 24px;
        font-weight: bold;
        color: #4995fe;
        line-height: 24px;
        padding: 8px 0;
      }
      .des {
        font-size: 16px;
        font-weight: 400;
        color: #4995fe;
        line-height: 15px;
      }
      .tunnel-list-item {
        &:not(:last-child) {
          padding-bottom: 15px;
          border-bottom: 1px solid #4696d3;
        }
        &:not(:first-child) {
          padding-top: 10px;
        }
        &.active {
          .name,
          .des {
            color: #ffffff;
          }
        }
      }
    }

    .operation {
      font-size: 14px;
      font-weight: 400;
      color: #4995fe;
      line-height: 50px;
      padding-left: 27px;
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 18px auto;

      &:nth-child(1) {
        background-image: url(../../assets/tunnel/weibiaoti.png);
      }

      &:nth-child(2) {
        background-image: url(../../assets/tunnel/home.png);
      }

      &:nth-child(3) {
        background-image: url(../../assets/tunnel/out.png);
      }
    }
  }
}
</style>
<style lang="scss">
.el-message, .el-notification, .el-message-box__wrapper {
  z-index: 1100000 !important;
}
.my-loading {
  z-index: 1090000 !important;
}
</style>