<template>
  <div>
    <iframe :src='iframeUrl'
            v-if="iframeUrl"
            class="myframe"
            frameborder="0"
            scrolling="auto"
            style="position:absolute;bottom: 0;left: 0;z-index:1"/>
    <!--    <div id="container" width="100%" height="100%">-->
    <!--      <div class="btn">-->
    <!--        <div size="mini" @click="reset()">复位</div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <dev-info v-if="devInfoVisible"-->
    <!--              @refreshData="updateUI"-->
    <!--              @openLight="openLight"-->
    <!--              @setLight="setLight"-->
    <!--              ref="devInfo"-->
    <!--              @close="close"-->
    <!--    />-->

    <!--    <dev-details ref="devDetails" @close="close"/>-->

    <!--    <div class="mydialog" v-if="lightDialog">-->
    <!--      <img id="close" @click="close" src="../../assets/3d/u1033.png" alt/>-->
    <!--      <div class="title">-->
    <!--        <div class="icon">-->
    <!--          <img src="../../assets/3d/u1042.png" alt/>-->
    <!--        </div>-->
    <!--        <div class="label">单灯控制</div>-->
    <!--      </div>-->
    <!--      <div class="content2">-->
    <!--        <table>-->
    <!--          <tr>-->
    <!--            <td style="width:80px">设备状态:</td>-->
    <!--            <td>-->
    <!--              <el-switch-->
    <!--                  active-value="1"-->
    <!--                  inactive-value="0"-->
    <!--                  @change="changeLight"-->
    <!--                  v-model="lightInfo.switchStatus"-->
    <!--              ></el-switch>-->
    <!--            </td>-->
    <!--          </tr>-->
    <!--          <tr>-->
    <!--            <td>设备亮度:</td>-->
    <!--            <td>-->
    <!--              <el-slider style="width:200px" v-model="lightInfo.brightnessVal"-->
    <!--                         @input="setLight"></el-slider>-->
    <!--            </td>-->
    <!--          </tr>-->
    <!--        </table>-->
    <!--        <div class="footer">-->
    <!--          <div class="btn1" @click="close">取消</div>-->
    <!--          <div class="btn1" @click="submit">确定</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="mydialog" v-if="fanDialog">-->
    <!--      <img id="close" @click="close2" src="../../assets/3d/u1033.png" alt/>-->
    <!--      <div class="title">-->
    <!--        <div class="icon">-->
    <!--          <img src="../../assets/3d/u1042.png" alt/>-->
    <!--        </div>-->
    <!--        <div class="label">风扇控制</div>-->
    <!--      </div>-->
    <!--      <div class="content2">-->
    <!--        <table>-->
    <!--          <tr>-->
    <!--            <td>运行状态</td>-->
    <!--            <td>-->
    <!--              <el-radio-group @change="change" v-model="controls">-->
    <!--                <el-radio label="0">关闭</el-radio>-->
    <!--                <el-radio label="1">正转</el-radio>-->
    <!--                <el-radio label="2">反转</el-radio>-->
    <!--              </el-radio-group>-->
    <!--            </td>-->
    <!--          </tr>-->
    <!--        </table>-->
    <!--        <div class="footer">-->
    <!--          <div class="btn1" @click="close2">取消</div>-->
    <!--          <div class="btn1" @click="submit2">确定</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--弹窗-->
    <modal-control :classify-number="classifyNumber"
                   v-model="showModal"
                   :tunnel-id="tunnelId"/>
  </div>
</template>

<script>
import DevInfo from '../../components/3d/DevInfo';
import DevDetails from '../../components/3d/DevDetails';
import screenfull from 'screenfull';
import View from '../../assets/3d/index';
import ModalControl from '../../components/2d/modal-control';

// Array.prototype.remove = function (val) {
//   var index = this.indexOf(val);
//   if (index > -1) {
//     this.splice(index, 1);
//   }
// };

export default {
  components: {ModalControl, DevInfo, DevDetails},
  props: {
    tunnelId: {
      type: String,
      default: ''
    },
    tunnelDevices: {
      type: Array,
      default: () => []
    },
    tunnelData: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    // classifyNumber() {
    //   return {
    //     19: 'video',
    //     5: 'conflagration',
    //     8: 'tunneldoor'
    //   }[this.showModalType];
    // }
  },
  data() {
    return {
      iframeUrl: `/static/3d/index.html`,
      classifyNumber: ''
      // tunnelId: this.$route.query.tunnelId,
      // controls: '0',
      // lightDialog: false,
      // fanDialog: false,
      // devVisible: false,
      // devInfoVisible: false,
      // lightInfo: {},
      // fanInfo: {},
      // showModal: false,
      // showModalTitle: '',
      // showModalType: ''
    };
  },
  services: ['_2d', 'tunnel'],
  methods: {
    initTunnel() {
      window.addEventListener("message", function(event){
        var revMsg = event.data;
        switch(revMsg.msgType){
          case "loaded": // 初始化完成，可以添加设备主体和设备
            var msg = {
              msgType:"loadTunnel",
              msgData:{
                tunnelId:"a32932b8-7355-4de5-adf9-034075c89d2c", // 隧道id
                leftHoleLength:1056, // 左洞长度（米）
                rightHoleLength:1107, // 右洞长度（米）
                endStakeMark:710213,  // 左洞结束桩号（桩号米）
                endStakeMarkRight:710253, // 右洞结束桩号（桩号米）
                laneNums:3,  // 车道数（个）
                startStakeMark:709157,  // 左洞开始桩号（桩号米）
                startStakeMarkRight:709146,  // 右洞开始桩号（桩号米）
                leftHoleDirection: "岳阳方向", // 左洞方向
                rightHoleDirection: "湘潭方向", // 右洞方向
                singleDoubleType: 3, // 单双洞类型（1单右洞 2单左洞 3双洞）
              }
            }
            window.frames[0].postMessage(msg); // 添加隧道

            ////////////////////////////////////////////////////////////////////////
            // 测试消防器材
            for(var i =0; i < 10; ++i){
              var msg1 = {
                msgType:"addDevice",
                msgData:{
                  id:"6703006a-9b93-4147-9e78-ef53483a2d8"+i, // 设备id
                  deviceTypeCode:"conflagration", // 设备类型  火灾消防
                  orientationLocation:0, //位置类型
                  leftRightFlag:1,// 左右洞标识（1右洞，2左洞）
                  pileNumber:709160 + i *50,// 设备桩号
                  deviceName:"火灾消防设备", // 设备名称
                  deviceCommunicationsState:0, // 设备状态
                  deviceCommunicationsStateName:"正常",// 设备状态描述
                }
              }
              window.frames[0].postMessage(msg1); // 添加设备
            }
            ////////////////////////////////////////////////////////////////////////
            // 测试风机
            var msg2 = {
              msgType:"addDevice",
              msgData:{
                id:"1703006a-9b93-4147-9e78-ef53483a2d8", // 设备id
                deviceTypeCode:"draughtfan", // 设备类型  火灾消防
                orientationLocation:1, //位置类型
                leftRightFlag:1,// 左右洞标识（1右洞，2左洞）
                pileNumber:709157,// 设备桩号
                deviceName:"风机1", // 设备名称
                deviceCommunicationsState:0, // 设备状态
                deviceCommunicationsStateName:"正常",// 设备状态描述
              }
            }
            window.frames[0].postMessage(msg2); // 添加设备

            ////////////////////////////////////////////////////////////////////////
            // 测试情报板M
            var msg3 = {
              msgType:"addDevice",
              msgData:{
                id:"1703006a-9b93-4147-9e78-3", // 设备id
                deviceTypeCode:"intelligenceboard", // 设备类型  情报板
                deviceSubtypeCode:"M",  // 设备子类型  情报板M
                orientationLocation:0, //位置类型 情报板M位置固定居中 此参数无效
                leftRightFlag:1,// 左右洞标识（1右洞，2左洞）
                pileNumber:709130,// 设备桩号
                deviceName:"情报板M", // 设备名称
                deviceCommunicationsState:0, // 设备状态
                deviceCommunicationsStateName:"正常",// 设备状态描述
                contentText:"道路千万条,安全第一条,行车不规范,亲人两行泪", // 显示文本
              }
            }
            window.frames[0].postMessage(msg3); // 添加设备

            ////////////////////////////////////////////////////////////////////////
            // 测试情报板F
            var msg4 = {
              msgType:"addDevice",
              msgData:{
                id:"1703006a-9b93-4147-9e78-4", // 设备id
                deviceTypeCode:"intelligenceboard", // 设备类型  情报板
                deviceSubtypeCode:"F",  // 设备子类型  情报板F
                orientationLocation:0, //位置类型 情报板F位置固定靠右 此参数无效
                leftRightFlag:1,// 左右洞标识（1右洞，2左洞）
                pileNumber:709120,// 设备桩号
                deviceName:"情报板M", // 设备名称
                deviceCommunicationsState:0, // 设备状态
                deviceCommunicationsStateName:"正常",// 设备状态描述
                contentText:"众志成城\n抗击疫情", // 显示文本
              }
            }
            window.frames[0].postMessage(msg4); // 添加设备
            ////////////////////////////////////////////////////////////////////////
            // 照明灯
            var msg5 = {
              msgType:"addDevices",
              msgData:new Array(),
            }
            for(var i =0; i < 10; ++i){
              var data = {
                id:"1703006a-9b93-4147-9e78-5" + i, // 设备id
                deviceTypeCode:"lighting", // 设备类型  照明灯
                orientationLocation:0, //位置类型 照明灯应该只有0和10两种位置
                leftRightFlag:1,// 左右洞标识（1右洞，2左洞）
                pileNumber:709160 + i * 5,// 设备桩号
                deviceName:"照明灯", // 设备名称
                deviceCommunicationsState: i%2, // 设备状态
                deviceCommunicationsStateName:"正常",// 设备状态描述
              }
              msg5.msgData.push(data);
            }
            window.frames[0].postMessage(msg5); // 添加设备
            ////////////////////////////////////////////////////////////////////////
            // 照明灯回路
            var msg6 = {
              msgType:"addDevice",
              msgData:{
                id:"1703006a-9b93-4147-9e78-6", // 设备id
                deviceTypeCode:"lightingloop", // 设备类型  照明灯
                orientationLocation:10, //位置类型 照明灯应该只有0和10两种位置
                leftRightFlag:1,// 左右洞标识（1右洞，2左洞）
                pileNumber:709170,// 设备桩号
                deviceName:"照明灯", // 设备名称
                deviceCommunicationsState:0, // 设备状态
                deviceCommunicationsStateName:"正常",// 设备状态描述
              }
            }
            window.frames[0].postMessage(msg6); // 添加设备

            break;

          case "clickDevice": // 点击选择某设备
            console.log("click device:" + revMsg.msgData);
            break;
        }
      });
    }
    // doShowModal(type) {
    //   this.showModal = true;
    //   this.showModalType = type;
    // },
    // change(value) {
    //   const id = this.fanInfo.fanId - 1;
    //   if (value != '0') {
    //     if (window.view.canRoateList.indexOf(id) < 0)
    //       window.view.canRoateList.push(id);
    //   } else {
    //     // let arr = [];
    //     window.view.canRoateList.remove(id);
    //   }
    // },
    // async submit2() {
    //   this.reset();
    // },
    // changeLight(status) {
    //   window.view.changeLight(status);
    // },
    // reset() {
    //   this.lightDialog = false;
    //   this.fanDialog = false;
    //   window.view.reset();
    // },
    // async submit() {
    //   this.reset();
    // },
    // close() {
    //   window.view.resetLightInfo();
    //   this.lightDialog = false;
    //   this.reset();
    // },
    // close2() {
    //   this.fanDialog = false;
    //   this.reset();
    // },
    // devInfoHandle() {
    //   this.devInfoVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs.devInfo.init();
    //   });
    // },
    // openLight(id, flag) {
    //   window.view.openLight(id, flag);
    // },
    // setLight(vlaue) {
    //   window.view.setLight(vlaue);
    // },
    // updateUI() {
    // },
    // buttoncli: function () {
      // if (!screenfull.enabled) {
      //   this.$message({
      //     message: "you browser can not work",
      //     type: "warning"
      //   });
      //   return false;
      // }
      // screenfull.toggle();
    // },

    // setTrafficLight(type) {
    //   window.view.setTrafficLight(type);
    // },
    // setCheliangLight(type) {
    //   window.view.setCheliangLight(type);
    // },
    // fnGetQueryString(key) {
    //   //正则获取url后面的参数值，如?env=dev&exp=123中可以通过fnGetQueryString('exp')=>得到123
    //   let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    //   let result = window.location.search.substr(1).match(reg);
    //   return result ? decodeURIComponent(result[2]) : false;
    // },
    // setFengji() {
    //   window.view.canRotated = !window.view.canRotated;
    //   window.view.setFengji();
    // },
    // devInfoHandle() {
    //   this.devInfoVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs.devInfo.init();
    //   });
    // },
    // devHandle(name, id) {
    //   this.devVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs.devDetails.init(name, id);
    //   });
    // }
  },
  async mounted() {

  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.myframe {
  width: 100vw;
  height: 90vh;
  top: 100px;
}

.mydialog {
  position: fixed;
  right: 100px;
  // bottom: 0;
  margin: 25vh auto;
  width: 400px;
  height: 200px;
  background: url("../../assets/3d/u2682.png") no-repeat;
  background-size: 100% 100%;
  z-index: 10000;
  color: white;

  #close {
    position: absolute;
    right: 10px;
    top: -10px;
    cursor: pointer;
  }

  .title {
    display: flex;
    margin-top: 5px;

    .icon {
      margin-left: 20px;
      margin-right: 5px;

      img {
        margin-top: 2px;
        position: absolute;
      }
    }

    .label {
      margin-left: 20px;
    }
  }

  .content2 {
    padding: 10px 20px;
    color: #00ffff;

    td {
      padding: 10px;
    }

    .footer {
      display: flex;
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }

  .btn1 {
    // width: 200px;
    text-align: center;
    cursor: pointer;
    margin-left: 15px;
    padding: 0px 25px;
    border-radius: 20px;
    background: linear-gradient(
            245deg,
            rgba(22, 167, 254, 1) 0%,
            rgba(22, 167, 254, 1) 0%,
            rgba(15, 75, 168, 1) 100%,
            rgba(15, 75, 168, 1) 100%
    );
  }

  input {
    background: transparent;
    border: 1px solid #00ffff;
    color: white;
  }
}

.info {
  position: absolute;
  top: 100px;
  left: 100px;
  color: white;
}

#container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.btn {
  position: absolute;
  padding: 10px;
  display: flex;
  align-items: center;

  div {
    margin: 10px;
    color: #ffffff;

    padding: 0px 10px;
    cursor: pointer;
    border: 1px solid #00ffff;
    border-radius: 20px;

    &:hover {
      color: #00ffff;
    }
  }
}
</style>
