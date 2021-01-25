<template>
  <div class="tunnel-container">
    <div class="title">
      {{ tunnelInfo.belongsStretch }} - {{ tunnelInfo.tunnelName }}
    </div>
    <div class="map" id="map" v-drag ref="orderBox" @scroll="orderScroll"
    :style="mapStyle">
      <!--2d背景图-->
      <div
        class="tunnel-2d"
        ref="2d"
        id="2d"
        :style="tunnel2dStyle"
      >
        <!--类型是左洞或者双洞，展示左洞的图-->
        <template
          v-if="
            tunnelInfo.singleDoubleType === 3 ||
            tunnelInfo.singleDoubleType === 2
          "
        >
          <div
            class="tunnel-wall"
            style="height: 30px"
            :style="{
              width: tunnelStyle.leftWidth,
              marginLeft: tunnelStyle.leftMargin,
            }"
          ></div>
          <div
            class="tunnel-line"
            :style="{
              width: tunnelStyle.leftWidth,
              marginLeft: tunnelStyle.leftMargin,
            }"
          >
            <div class="line-side"></div>
            <template v-for="(v, i) in tunnelInfo.laneNums">
              <div
                class="line-road"
                v-if="i !== 0"
                :style="{
                  margin: `${
                    tunnelStyle.contentHeight / tunnelInfo.laneNums
                  }px 0`,
                }"
              ></div>
            </template>
            <div class="line-side"></div>
          </div>
        </template>

        <!--类型是双洞，在中间放个间隔-->
        <div
          v-if="tunnelInfo.singleDoubleType === 3"
          style="height: 30px"
        ></div>

        <!--类型是右洞或者双洞，展示右洞的图-->
        <template
          v-if="
            tunnelInfo.singleDoubleType === 3 ||
            tunnelInfo.singleDoubleType === 1
          "
        >
          <div
            class="tunnel-line"
            :style="{
              width: tunnelStyle.rightWidth,
              marginLeft: tunnelStyle.rightMargin,
            }"
          >
            <div class="line-side"></div>
            <template v-for="(v, i) in tunnelInfo.laneNums">
              <div
                class="line-road"
                v-if="i !== 0"
                :style="{
                  margin: `${
                    tunnelStyle.contentHeight / tunnelInfo.laneNums
                  }px 0`,
                }"
              ></div>
            </template>
            <div class="line-side"></div>
          </div>
          <div
            class="tunnel-wall"
            style="height: 30px"
            :style="{
              width: tunnelStyle.rightWidth,
              marginLeft: tunnelStyle.rightMargin,
            }"
          ></div>
        </template>

        <!--设备列表-->
        <template v-for="item in deviceList">
          <el-popover placement="top" trigger="hover">
            <div class="popover">
              <p>
                设备名称：{{ item.deviceName }}({{
                  item.deviceCommunicationsStateName
                }})
              </p>
              <p>设备桩号：{{ item.pileNumberStr }}</p>
              <p v-if="item.workMode != null">
                当前模式：{{ item.workModeName }}
              </p>
              <p v-if="item.sensorValText != null">
                当前数据：{{ item.sensorValText }}
              </p>
            </div>
            <img
              slot="reference"
              class="icon"
              :class="{ middle: item.orientationLocation === 11 }"
              :style="getDeviceStyle(item)"
              @click.stop="showDetail(item)"
              v-show="
                (!wait || waitShowList[item.id]) &&
                (showActiveType === 'all' ||
                  item.classifyNumber === showActiveType)
              "
              :src="`/static/image/tunnel/${item.deviceTypeCode}_${
                item.deviceCommunicationsState
              }${item.workMode != null ? '_' + item.workMode : ''}.png`"
            />
          </el-popover>
        </template>

        <!-- 隧道空洞、人行横洞、车辆横洞、配电房、水泵房 -->
        <template
          v-if="tunnelInfo.emptyrecordList"
          v-for="empty in tunnelInfo.emptyrecordList"
        >
          <div :style="getEmptyStyle(empty)">
            <span v-if="empty.emptyType === 3" style="font-size: 14px"
              >水泵房</span
            >
            <span
              v-if="empty.emptyType === 4 || empty.emptyType === 5"
              style="font-size: 14px"
              >配电房</span
            >
          </div>
        </template>
      </div>
      <div v-if="
            tunnelInfo.singleDoubleType === 3 ||
            tunnelInfo.singleDoubleType === 2
          "
        v-for="(item, index) in tunnelBunntntt"
        :key="index+'a'"
        :style="divLeftRight(index)"
      >

        <span class="iconTextLeft"
          v-for="(item, i) in tunnelInfo.laneNums"
          :style="backleft(i,2)">
          <span style="margin-left: -0.15rem"
                  class="el-icon-back iconLeft"
                  v-for="(item, i) in tunnelInfo.laneNums"
                  :key="i+'b'"

          ></span>
          {{ tunnelInfo.leftHoleDirection }}</span>
      </div>
      <div v-if="
      tunnelInfo.singleDoubleType === 3 ||
      tunnelInfo.singleDoubleType === 1
      "
        v-for="(item, index) in tunnelBunntntt"
        :key="index+'c'"
        :style="divLeftRight(index)"
      >
        <span class="iconTextRight"
          v-for="(item, i) in tunnelInfo.laneNums"
          :style="backleft(i,1)">
          {{ tunnelInfo.rightHoleDirection }}
          <i class="el-icon-right iconLeft"
           v-for="(item, i) in tunnelInfo.laneNums"
           :key="i+'d'"
           ></i></span>

      </div>
    </div>
    <div v-if="
            tunnelInfo.singleDoubleType === 3 ||
            tunnelInfo.singleDoubleType === 2
          " class="direction left">
      <img class="img" src="../../assets/images/tunnel/tunnel-direction.png" />
      <div class="text">{{ this.tunnelInfo.leftHoleDirection }}</div>
    </div>
    <div v-if="
            tunnelInfo.singleDoubleType === 3 ||
            tunnelInfo.singleDoubleType === 1
          " class="direction right">
      <img
        class="img"
        src="../../assets/images/tunnel/tunnel-direction-right.png"
      />
      <div class="text">{{ this.tunnelInfo.rightHoleDirection }}</div>
    </div>

    <div class="tunnelBunntn" v-if="this.tunnelInfo.showMode === 1">
      <el-button
        v-for="(item, index) in tunnelBunntn"
        :key="index"
        :class="{ active: buttonClass === index }"
        @click="movebutton(index)"
        >k{{ item }}</el-button
      >
    </div>
    <slot name="controls"></slot>
  </div>
</template>
<script>
export default {
  services: ["_2d", "tunnel"],
  props: {
    showActiveType: {
      type: String | Number,
      default: "all",
    }, // 正在展示的type
    wait: Boolean,
    fullScreen: Boolean,
  },
  data() {
    return {
      waitShowList: {},
      tunnelId: this.$route.query.tunnelId,
      deviceList: [],
      modal: false,
      //隧道基本信息
      outerWidth: 0,
      outerWidthout:0,
      buttonClass: 0,
      gapX: 0,
      tunnelBunntntt: [],
      tunnelInfo: {},
      tunnelToDTimer: null,
      maxEndMapStakeMark: 0,
      minStartMapStakeMark: 0
    };
  },
  computed: {
    tunnelBunntn() {
      let {
        leftHoleLength,
        rightHoleLength,
        endStakeMark,
        endStakeMarkRight,
        laneNums,
        startStakeMark,
        startStakeMarkRight,
      } = this.tunnelInfo;
      let beginMark = this.minStartMapStakeMark / 1000; //获取最小桩号
      let endMark = this.maxEndMapStakeMark / 1000; //获取最大桩号
      let bottom = [];
      let a = Math.floor(beginMark);
      let b = Math.floor(endMark);
      //console.log(endStakeMarkRight/ 1000);
      for (let i = a; i < b; i++) {
        bottom.push(i);
      }
      return bottom;
      //sconsole.log(beginMark, endMark);
    },
    // 隧道2d背景图的样式
    tunnelStyle() {
      // 如果不是双洞类型，就不用比较距离和长短
      let {
        leftHoleLength,
        rightHoleLength,
        endStakeMark,
        endStakeMarkRight,
        laneNums,
        startStakeMark,
        startStakeMarkRight,
      } = this.tunnelInfo;
      let config = {
        sideHeight: 6, // 左右两边的线的宽度
        padding: 10, // 背景的padding
        lineHeight: 2, // 中间的线的宽度
        contentHeight: this.fullScreen ? 130 : 100, // 中间内容的高度
        center: 30, // 两个洞连接处的高度
      };
      config.tunnelLine =
      config.contentHeight +
      config.padding * 2 +
      config.sideHeight * 2 +
      (laneNums - 1) * config.lineHeight; // 一个洞的高度
        var beginMark = Math.min(startStakeMark, startStakeMarkRight); //获取最小桩号
      var endMark = Math.max(endStakeMark, endStakeMarkRight); //获取最大桩号

      let mapLength =  this.maxEndMapStakeMark - this.minStartMapStakeMark;
      let maxHoleLength = endMark - beginMark; //最大长度 Math.max(leftHoleLength, rightHoleLength);

      leftHoleLength = endStakeMark - startStakeMark; //左洞长度
      rightHoleLength = endStakeMarkRight - startStakeMarkRight; //右洞长度
      //console.log('leftHoleLength',leftHoleLength);
      //console.log(rightHoleLength);
      let maxEndStakeMark = Math.max(endStakeMark, endStakeMarkRight);
      let minStartStakeMark = Math.max(startStakeMark, startStakeMarkRight);
      let minEndStakeMark = Math.min(endStakeMark, endStakeMarkRight);
      let stakeDistance = Math.abs(endStakeMark - endStakeMarkRight);
      //let stakeLeftDistance = Math.abs(endStakeMark - endStakeMarkRight);

      var maxLength = endMark - beginMark;

      var lengthV = (100 / maxHoleLength);
      //计算方式
      /*
          1、得到最小设备桩号和最大设备桩号
          2、得到画布长度：最大设备桩号-最小设备桩号
          3、得到%1所表示的桩号长度 100/画布长度
          3、左洞画布长度等于：(左洞结束桩号-左洞开始桩号)*%1所表示的桩号长度
          4、左洞画布距离左侧长度：(最大桩号-左洞结束桩号)*%1所表示的桩号长度
      */

      //地图显示区域宽度，固定模式时值等于长度100%，分段模式时候的值等于长度1000米
      //let outerWidth = document.getElementById("map").offsetWidth;
      let outerWidth = document.body.clientWidth / 100 * 60;
      //分段模式时候的值的比例
      let mapScaleMode1 = outerWidth / 1000;
      // console.log('mapScaleMode1',mapScaleMode1)

      //左边间隔 隧道开始桩号 减去 设备开始桩号
      let leftMar = startStakeMark - this.minStartMapStakeMark > 0 ? minStartStakeMark - this.minStartMapStakeMark : 0;
      let rightMar = startStakeMarkRight - this.minStartMapStakeMark  > 0 ? startStakeMarkRight - this.minStartMapStakeMark : 0;
      //console.log('minStartStakeMark - this.minStartMapStakeMark',minStartStakeMark - this.minStartMapStakeMark)
      //console.log('startStakeMarkRight - this.minStartMapStakeMark',startStakeMarkRight - this.minStartMapStakeMark)

      //分段模式显示时候 按outerWidth(地图显示区域)等于长度1000米的比例计算得到 PX
      if(this.tunnelInfo.showMode === 1)
      {
        if (this.tunnelInfo.singleDoubleType !== 3) {
          return {
            ...config,
            leftWidth: mapScaleMode1 * leftHoleLength + "px",
            leftMargin: mapScaleMode1 * leftMar + "px",
            rightWidth: mapScaleMode1 * rightHoleLength + "px",
            rightMargin: mapScaleMode1 * rightMar + "px",
            leftStakeMark: endStakeMark || endStakeMarkRight,
            maxlength: leftHoleLength || rightHoleLength,
          };
        }
        else {
          let res = {
            ...config,
            leftWidth: mapScaleMode1 * leftHoleLength + "px",
            leftMargin: mapScaleMode1 * leftMar + "px",
            rightWidth: mapScaleMode1 * rightHoleLength + "px",
            rightMargin: mapScaleMode1 * rightMar + "px",
            leftStakeMark: minStartStakeMark
          };
          // 计算出画布总宽度(米)
          if (leftHoleLength > rightHoleLength) {
            res.maxLength =
                    leftHoleLength +
                    (endStakeMark > endStakeMarkRight ? 0 : stakeDistance);
          } else {
            res.maxLength =
                    rightHoleLength +
                    (endStakeMarkRight > endStakeMark ? 0 : stakeDistance);
          }

          res.maxLength = endMark - beginMark;
          return res;
        }
      }
      //分段模式显示时候 按outerWidth(地图显示区域)等于100%的比例计算得到 %
      else {
        if (this.tunnelInfo.singleDoubleType !== 3) {
          return {
            ...config,
            leftWidth: '100%',
            leftMargin: 0,
            rightWidth: '100%',
            rightMargin: 0,
            leftStakeMark: endStakeMark || endStakeMarkRight,
            maxlength: leftHoleLength || rightHoleLength
          };
        }
        else {
          let res = {
            ...config,
            leftWidth: (leftHoleLength / mapLength)*100 + '%',
            leftMargin: (leftMar / mapLength)*100 + '%',
            rightWidth: (rightHoleLength / mapLength)*100 + '%',
            rightMargin: (rightMar / mapLength)*100 + '%',
            leftStakeMark: minStartStakeMark
          };

          if (leftHoleLength > rightHoleLength) {
            res.maxLength =
                    leftHoleLength +
                    (endStakeMark > endStakeMarkRight ? 0 : stakeDistance);
          } else {
            res.maxLength =
                    rightHoleLength +
                    (endStakeMarkRight > endStakeMark ? 0 : stakeDistance);
          }

          res.maxLength = endMark - beginMark;
          return res;
        }
      }
    },
    mapStyle() {
      if (this.tunnelInfo.showMode === 0) {
        return {
        };
      }
      else if (this.tunnelInfo.showMode === 1)
      {
        return {
          overflowX: "scroll",
          overflowY: "hidden"
        };
      }
    },
    tunnel2dStyle() {
      if (this.tunnelInfo.showMode === 0) {
        return {
          width: "100%"
        };
      }
      else if (this.tunnelInfo.showMode === 1)
      {
        return {
          width: this.outerWidth+"px"
        };
      }
    }
  },

  watch: {
    async $route() {
      await this.findTunnelBaseInfo();
      this.listDeviceBaseOfTunnelPage();
    },
  },

  beforeDestroy() {
    clearInterval(this.tunnelToDTimer);
    this.tunnelToDTimer = null;
  },

  async mounted() {
    await this.listDeviceBaseOfTunnelPage();
    await this.findTunnelBaseInfo();
    await this.outerWidths();
    document.addEventListener("scroll", this.Scroll);
    this.tunnelToDTimer = setInterval(async () => {
      await this.listDeviceBaseOfTunnelPage();
      await this.findTunnelBaseInfo();
      //await this.outerWidths();
    }, 5 * 1000);
    ///////窗口改变的时候 重新计算隧道宽度
    window.onresize = () => {
      return (() => {
        setTimeout(()=>{
          this.outerWidths();
        }, 3000);
      })();
    };
  },
  methods: {
    //Scroll监听移动
    divLeftRight(i) {
      //console.log(this.outerWidth)
      switch (i) {
        case 0:
          return {
            position: "absolute",
            top: 0,
            left: this.outerWidth / 2 + i * (this.outerWidth / 2) + "px",
          };
        default: {
          return {
            position: "absolute",
            top: 0,
            left: i * this.outerWidth + this.outerWidth / 2 + "px",
          };
        }
      }
    },
    backleft(i,leftRightFlag) {
      let { laneNums,singleDoubleType } = this.tunnelInfo;
      const {
        leftStakeMark,
        maxLength,
        sideHeight,
        padding,
        lineHeight,
        contentHeight,
        center,
        tunnelLine,
      } = this.tunnelStyle;

      const defaultTop =
              padding +
              sideHeight +
              contentHeight / laneNums / 2 +
              (i) * (contentHeight / laneNums + 2);
      let top = defaultTop;

      // 如果是双洞的话，设备位置还得根据左右洞位置调整
      if (singleDoubleType === 3) {
        if (leftRightFlag === 1) {
          // 左洞要加上右洞+卷闸门的高度
          top += tunnelLine + center;
        }

        if (leftRightFlag === 2) {
          // 右洞的话设备位置从上到下应该是10~0，所以这里从上到下计算的高度要用整个洞的高度减掉，就可以调转过来了
          top = tunnelLine - top;
        }
      }
      //单左洞
      else if(singleDoubleType === 2) {
        // 右洞的话设备位置从上到下应该是10~0，所以这里从上到下计算的高度要用整个洞的高度减掉，就可以调转过来了
        top = tunnelLine - top;
      }
      //单右洞
      else if(singleDoubleType === 1) {
        // 右洞要-卷闸门的高度
        top = top - center;
      }

      return {
        top: top + 30 + "px",
        zIndex: 8
      };

      // switch (laneNums) {
      //   case 2:
      //     return {
      //       top: 67 + i * 50 + "px",
      //       zIndex: 8,
      //     };
      //
      //   case 3:
      //     return {
      //       top: 57 + i * 35 + "px",
      //       zIndex: 8,
      //     };
      // }
    },
    orderScroll(e) {
      let abs = Math.round(this.$refs.orderBox.scrollLeft / this.outerWidth);
      this.buttonClass = abs;
    },

    //点击移动
    movebutton(i) {
      document.getElementById("map").scrollLeft = i * this.outerWidth;
      this.buttonClass = i;
    },
    //获取初始宽度
    outerWidths() {
      let mapLength =  this.maxEndMapStakeMark - this.minStartMapStakeMark;
      //console.log('this.tunnelBunntntt',this.tunnelBunntntt)
      let outerWidths = document.body.clientWidth / 100 * 60;

      this.outerWidthout = outerWidths;
      //console.log(outerWidths);
      this.outerWidth = outerWidths;
       //console.log(outerWidth)
      if(this.tunnelInfo.showMode === 1)
      {
        this.tunnelBunntntt = Math.round(mapLength / 1000) ;
      }
      else
      {
        this.tunnelBunntntt = 1 ;
      }
    },
    showWait(id) {
      this.waitShowList = { ...this.waitShowList, [id]: true };
    },

    clearWait() {
      this.waitShowList = {};
    },

    // 计算空洞位置
    getEmptyStyle(item) {
      const { length, pileNumber, leftRightFlag } = item,
        {
          singleDoubleType,
          // endStakeMarkRight,
          // startStakeMarkRight,
          endStakeMark,
          endStakeMarkRight,
          startStakeMark,
          startStakeMarkRight,
        } = this.tunnelInfo;
      const { leftStakeMark, maxLength, tunnelLine, center } = this.tunnelStyle;
      let mapLength =  this.maxEndMapStakeMark - this.minStartMapStakeMark;
      var beginMark = Math.min(startStakeMark, startStakeMarkRight); //获取最小桩号
      var endMark = Math.max(endStakeMark, endStakeMarkRight); //获取最大桩号
      let rightHoleLength = (endMark - beginMark) / 10; //最大长度 Math.max(leftHoleLength, rightHoleLength);
      //let rightHoleLength = (endStakeMarkRight - startStakeMarkRight) / 10; //左洞长度
        let maxEndStakeMark = Math.max(endStakeMark, endStakeMarkRight);
        let minStartStakeMark = Math.max(startStakeMark, startStakeMarkRight);
        let minEndStakeMark = Math.min(endStakeMark, endStakeMarkRight);
        let leftMar =Math.round(minStartStakeMark /1000)-Math.round(beginMark /1000);
        let rightMar = Math.round(maxEndStakeMark /1000)-Math.round(minEndStakeMark /1000);
       // let outerWidths = document.getElementById("2d").scrollWidth;
      //地图显示区域宽度，固定模式时值等于长度100%，分段模式时候的值等于长度1000米
      let outerWidth = document.body.clientWidth / 100 * 60;
      //分段模式时候的值的比例
      let mapScaleMode1 = outerWidth / 1000;
      // console.log('mapScaleMode1',mapScaleMode1)

      let defaultLeft = 0
      //计算设备位置+10
      //分段模式显示时候 按outerWidth(地图显示区域)等于长度1000米的比例计算得到 PX
      if(this.tunnelInfo.showMode === 1) {
        defaultLeft =  mapScaleMode1 * ((pileNumber-this.minStartMapStakeMark)) + 10 + 'px';
      }
      //分段模式显示时候 按outerWidth(地图显示区域)等于100%的比例计算得到 %
      else{
        defaultLeft = (((pileNumber-this.minStartMapStakeMark) + 10)/ mapLength) * 100 + '%';
      }
      //console.log('maxLength',maxLength)
      // emptyType  空洞类型（0空洞、1人行横洞、2车行横洞 3水泵房 4洞外配电房 5洞内配电房）
      // rotateDegree  旋转度数
      // leftRightFlag 1 右洞 2 左洞 3 中间

      switch (item.emptyType) {
        // 0 空洞
        case 0:
          // console.log(singleDoubleType)
          // console.log(leftRightFlag)
          // console.log( singleDoubleType === 3 && leftRightFlag == 2)
          return {
            position: "absolute",
            top:
              singleDoubleType === 3 && leftRightFlag === "2"
                ? tunnelLine + center + 30 + "px"
                : "0",
            height: tunnelLine + 30 + "px",
            width: (length / maxLength) * 100 + "%",
            left: `${defaultLeft}`,
            background: "#142470",
            zIndex: 9,
          };

        case 1:
          // 1 人行横洞
          return {
            position: "absolute",
            top: "calc(50% - 35px)",
            height: "70px",
            width: "20px",
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            transform: `rotate(${item.rotateDegree}deg)`,
          };

        case 2:
          // 2 车行横洞
          return {
            position: "absolute",
            top: "calc(50% - 35px)",
            height: "70px",
            width: "50px",
            left:
              item.rotateDegree >= 30
                ? `calc(${defaultLeft} - 25px)`
                : `${defaultLeft}`,
            background: "#3a5a8b",
            transform: `rotate( ${item.rotateDegree}deg)`,
          };
        case 3:
          // 水泵房
          return {
            position: "absolute",
            top:
              singleDoubleType === 3 && leftRightFlag === "2"
                ? tunnelLine + center + 30 + "px"
                : "0",
            width: "50px",
            height: "50px",
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            zIndex: 9,
            color: "#ccc",
            lineHeight: "50px",
            textAlign: "center",
          };

        case 4:
          // 洞外配电房
          return {
            position: "absolute",
            top: `calc(50% - 30px)`,
            height: "60px",
            width: "80px",
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            zIndex: 9,
            color: "#ccc",
            lineHeight: "60px",
            textAlign: "center",
          };
        case 5:
          // 洞内配电房
          return {
            position: "absolute",
            top: `calc(50% - 15px)`,
            height: "30px",
            width: "80px",
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            zIndex: 9,
            color: "#ccc",
            lineHeight: "30px",
            textAlign: "center",
          };
      }
    },

    // 计算设备位置
    getDeviceStyle(device) {
      // 0 左  10 右  1 车道1  2 车道2  3 车道3  4 车道4 ~~~ 9 车道
      // -1 左外面  11 横洞  12 右外面  13 右外面1  14 右外面2  15右外面3
      // 16 横洞左  17 横洞中  18 横洞右
      const { orientationLocation } = device;
      const {
        laneNums,
        singleDoubleType,
        // endStakeMarkRight,
        // startStakeMarkRight,
        endStakeMark,
        endStakeMarkRight,
        startStakeMark,
        startStakeMarkRight,
      } = this.tunnelInfo;

      let mapLength =  this.maxEndMapStakeMark - this.minStartMapStakeMark;
      var beginMark = Math.min(startStakeMark, startStakeMarkRight); //获取最小桩号
      var endMark = Math.max(endStakeMark, endStakeMarkRight); //获取最大桩号
      let rightHoleLength = (endMark - beginMark) / 10; //最大长度 Math.max(leftHoleLength, rightHoleLength);
       let maxEndStakeMark = Math.max(endStakeMark, endStakeMarkRight);
        let minStartStakeMark = Math.max(startStakeMark, startStakeMarkRight);
        let minEndStakeMark = Math.min(endStakeMark, endStakeMarkRight);

       // let outerWidths = document.getElementById("2d").scrollWidth;
      //地图显示区域宽度，固定模式时值等于长度100%，分段模式时候的值等于长度1000米
      //let outerWidth = document.getElementById("map").offsetWidth;
      let outerWidth = document.body.clientWidth / 100 * 60;
      //分段模式时候的值的比例
      let mapScaleMode1 = outerWidth / 1000;
      // console.log('mapScaleMode1',mapScaleMode1)


     const {
        leftStakeMark,
        maxLength,
        sideHeight,
        padding,
        lineHeight,
        contentHeight,
        center,
        tunnelLine,
      } = this.tunnelStyle;

      const defaultTop =
        padding +
        sideHeight +
        contentHeight / laneNums / 2 +
        (device.orientationLocation - 1) * (contentHeight / laneNums + 2);

      // padding + 固定高度 + 线条数量*2 + height6/2
      const rightDistance =
        padding +
        sideHeight +
        contentHeight +
        (laneNums - 1) * lineHeight +
        sideHeight / 2;

      let top = 0;

      const signallampScale =
        device.classifyNumber === "signallamp" ? "1" : 2 / laneNums;

      // const defaultTransform = `translate(-50%, -50%) scale(${2 / laneNums}) ${device.classifyNumber === 'laneIndicator' && device.leftRightFlag === 2 ? 'rotate(180deg)' : ''}`
      const defaultTransform = `translate(-50%, -50%) scale(${signallampScale}) ${
        device.classifyNumber === "laneIndicator" && device.leftRightFlag === 2
          ? "rotate(180deg)"
          : ""
      }`;
      //计算设备位置+10
      let defaultLeft = 0;
      //console.log('device.pileNumber-this.minStartMapStakeMark',mapScaleMode1)
      //分段模式显示时候 按outerWidth(地图显示区域)等于长度1000米的比例计算得到 PX
      if(this.tunnelInfo.showMode === 1) {
        defaultLeft =  mapScaleMode1 * ((device.pileNumber-this.minStartMapStakeMark)) + 10 + 'px';
      }
      //分段模式显示时候 按outerWidth(地图显示区域)等于100%的比例计算得到 %
      else{
        defaultLeft = (((device.pileNumber-this.minStartMapStakeMark) + 10)/ mapLength) * 100 + '%';
      }
      console.log(rightDistance);
      switch (orientationLocation) {
        case 0:
          // 左边
          // padding + height6/2
          top = padding + sideHeight / 2;
          break;
        case 10:
          // 右边
          top = rightDistance;
          break;
        case 13:
          // 右外面1
          top = rightDistance + 27;
          break;
        case 14:
          // 右外面2
          top = rightDistance + 27;
          break;
        case 15:
          // 15右外面3
          top = rightDistance + 27;
          break;
        default:
          top = defaultTop;
      }

      // 如果是双洞的话，设备位置还得根据左右洞位置调整
      if (singleDoubleType === 3) {
        if (device.leftRightFlag === 1) {
          // 左洞要加上右洞+卷闸门的高度
          top += tunnelLine + center;
        }

        if (device.leftRightFlag === 2) {
          // 右洞的话设备位置从上到下应该是10~0，所以这里从上到下计算的高度要用整个洞的高度减掉，就可以调转过来了
          top = tunnelLine - top;
        }
      }
      //单左洞
      else if(singleDoubleType === 2) {
        // 右洞的话设备位置从上到下应该是10~0，所以这里从上到下计算的高度要用整个洞的高度减掉，就可以调转过来了
        top = tunnelLine - top;
      }
      //单右洞
      else if(singleDoubleType === 1) {
        // 右洞要-卷闸门的高度
        top = top - center;
      }

      const defaultStyle = {
        transform: defaultTransform,
        top: `${top + 30}px`,
        left: `${defaultLeft}`,
        zIndex: device.sortInt || 10,
      };

      // 横洞左
      if (device.orientationLocation === 16) {
        return {
          ...defaultStyle,
          top: "calc(50% - 8px)",
          left: `calc(${defaultLeft} + 15px)`,
        };
      }

      // 横洞中
      if (device.orientationLocation === 17) {
        return {
          ...defaultStyle,
          top: "50%",
        };
      }

      // 横洞右
      if (device.orientationLocation === 18) {
        return {
          ...defaultStyle,
          top: "calc(50% + 8px)",
          left: `calc(${defaultLeft} - 15px)`,
        };
      }

      return defaultStyle;
    },

    // 隧道基本信息
    findTunnelBaseInfo() {
      return this.$service.tunnel.getById(this.tunnelId).then((res) => {
        this.tunnelInfo = res;
        //console.log('res',res)
        //console.log('this.tunnelInfo.showMode',this.tunnelInfo.showMode)
        if(!this.tunnelInfo.showMode || this.tunnelInfo.showMode==null)
        {
          this.tunnelInfo.showMode = 0;
        }
        // 对比设备与隧道的起止桩号 获取隧道地图的长度
        let maxEndStakeMark = 0;
        let minStartStakeMark = 0;
        // 双洞
        if(this.tunnelInfo.singleDoubleType === 3){
          maxEndStakeMark = Math.max(this.tunnelInfo.endStakeMark, this.tunnelInfo.endStakeMarkRight);
          minStartStakeMark = Math.min(this.tunnelInfo.startStakeMark, this.tunnelInfo.startStakeMarkRight);
        }
        // 单左洞
        else if(this.tunnelInfo.singleDoubleType === 2){
          maxEndStakeMark = this.tunnelInfo.endStakeMark;
          minStartStakeMark = this.tunnelInfo.startStakeMark;
        }
        // 单右洞
        else if(this.tunnelInfo.singleDoubleType === 1){
          maxEndStakeMark = this.tunnelInfo.endStakeMarkRight;
          minStartStakeMark = this.tunnelInfo.startStakeMarkRight;
        }

        if(this.maxEndMapStakeMark>0){
          this.maxEndMapStakeMark = Math.max(maxEndStakeMark, this.maxEndMapStakeMark);
        }
        else{
          this.maxEndMapStakeMark = maxEndStakeMark;
        }
        if(this.minStartMapStakeMark>0){
          this.minStartMapStakeMark = Math.min(minStartStakeMark, this.minStartMapStakeMark);}
        else{
          this.minStartMapStakeMark = minStartStakeMark;
        }
      });
    },

    // 隧道的设备列表
    listDeviceBaseOfTunnelPage() {
      this.$service._2d.getTunnelDevices(this.tunnelId).then((res) => {
        const supportList = [
          "signallamp",
          "laneIndicator",
          "urgentphone",
          "broadcast",
          "conflagration",
          "guidelight",
          "lighting",
          "waterlevel",
          "electronicfence",
          "environment",
          "tunneldoor",
          "draughtfan",
          "video",
          "intelligenceboard",
        ];
        let list = res.filter((v) => {
          let support = supportList.includes(v.classifyNumber);
          if (!support) console.warn("不支持显示设备", v);
          return support; // positionFlag为空不显示
        });
        this.deviceList = list;
        // 对比设备与隧道的起止桩号 获取隧道地图的长度
        for(let index  in this.deviceList){
          if(this.maxEndMapStakeMark>0){
            this.maxEndMapStakeMark = Math.max(this.deviceList[index].pileNumber, this.maxEndMapStakeMark);
          }
          else{
            this.maxEndMapStakeMark = this.deviceList[index].pileNumber;
          }
          if(this.minStartMapStakeMark>0){
            this.minStartMapStakeMark = Math.min(this.deviceList[index].pileNumber, this.minStartMapStakeMark);}
          else{
            this.minStartMapStakeMark = this.deviceList[index].pileNumber;
          }
        }
        this.$emit("loaded", res);
      });
    },
    showDetail(item) {
      this.$emit("detail", item);
    },
  },
};
</script>
<style lang="less" scoped>
.icon {
  position: absolute;
  cursor: pointer;

  &.middle {
    //background: rgb(126, 214, 243);
    background: #3a5a8b;
    padding: 10px;
  }
}

.tunnel-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: white;
  line-height: 48px;
  text-align: center;
}

.map {
  width: 80%;
  margin-top: 36px;
  position: relative;
  display: flex;
  align-items: center;
  /*justify-content: center;*/
  &::-webkit-scrollbar {
    width: 0.2rem !important;
    height: 0.10666667rem;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: rgba(24, 116, 174, 1) !important;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  }
  .tunnel-2d {
    .tunnel-line {
      //background: rgb(126, 214, 243);
      background: #3a5a8b;
      padding: 10px 6px; /*no*/
      position: relative;
      z-index: 1;
    }

    .line-side {
      // 道路两边的线
      height: 6px; /*no*/
      //background: #fff;
      background: #ccc;
    }

    .line-road {
      // 中间的线
      height: 2px; /*no*/
      //background: #fff;
      background: #ccc;
    }
  }
}
.direction {
  position: absolute;
  font-size: 18px;
  font-weight: bold;
  color: white;

  &.left {
    top: 20%;
    left: 7%;
    transform: translateX(-100%);
  }

  &.right {
    bottom: 44%;
    right: 7%;
    transform: translateX(100%);
  }
}
.full-2d{
  .direction {
    &.left {
      top: 250px;
      left: 7%;
      transform: translateX(-100%);
    }
    &.right {
      top: 500px;
      right: 9%;
      transform: translateX(100%);
    }
  }
}
.iconTextLeft,.iconTextRight {
  transform: translate(0%, -50%) scale(1);
  position: absolute;
  width: 2rem;
  color: #9babc5;
  font-size: 0.1rem;
  line-height: 0.23rem;
  vert-align: middle;
  margin-left: 0.2rem;
}
.iconLeft {
  position: absolute;
  color: #9babc5;
  transform: translate(0%, -8%) scale(1);
}
.el-icon-right:before,.el-icon-back:before {
  line-height: 0rem;
  font-size: 0.14rem;
}
i {
  display: inline-block;
  width: 10px;
  height: 10px;

  border-radius: 50%;
}

.oni {
  background: green;
}

.offi {
  background: red;
}

.tunnel-wall {
  height: 30px;
  background-image: url("/static/image/tunnel/wall.png");
  background-size: 15px;
  opacity: 0.7;
}
.tunnelBunntn {
  display: inline;
}
.tunnelBunntn {
  margin-top: 20px;
  button {
    height: 0.4rem;
    line-height: 0.1rem;
    font-size: 14px;
  }
}
  /deep/.el-button .el-button--default:focus {
    background-color: none;
    color: none;
  }
  /deep/.el-button:focus,
  .el-button:hover {
    background-color: none;
    color: none;
  }
.active {
  background-color: #337cf3;
  color: #c1d9ff;
}
</style>
