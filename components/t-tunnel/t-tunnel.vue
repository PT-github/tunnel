<template>
  <div class="t-tunnel">
    <!-- 路标指示 -->

    <!-- 左洞方向 -->
    <div
      class="center-lb"
      v-if="tunnelInfoData.singleDoubleType === 3 || tunnelInfoData.singleDoubleType === 2"
    >
      <div class="center-lb-bg"></div>
      <div class="center-lb-wz">
        <span>{{ this.tunnelInfoData.leftHoleDirection }}</span>
      </div>
    </div>
    <!-- 右洞方向 -->
    <div
      class="center-lb center-lb2"
      v-if="tunnelInfoData.singleDoubleType === 3 || tunnelInfoData.singleDoubleType === 1"
    >
      <div class="center-lb-bg"></div>
      <div class="center-lb-wz">
        <span>{{ this.tunnelInfoData.rightHoleDirection }}</span>
      </div>
    </div>

    <!-- 2d背景图 -->
    <div
      :show-scrollbar="true"
      class="map"
      :class="{'map-scroll': tunnelInfoData.showMode === 1}"
      ref="orderBox"
      :scroll-left="scrollLeft"
      :scroll-x="scrollX"
      @scroll="handleScroll"
    >
      <!-- <div class="map" ref="orderBox" id="map" :style="mapStyle"> -->
      <div
        class="tunnel-2d"
        ref="2d"
        id="2d"
        :style="tunnel2dStyle"
      >
        <!--类型是左洞或者双洞，展示左洞的图-->
        <template v-if="tunnelInfoData.singleDoubleType === 3 || tunnelInfoData.singleDoubleType === 2">
          <div
            class="tunnel-wall"
            style="height: 50px"
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
            <template v-for="(v, i) in tunnelInfoData.laneNums">
              <div
                class="line-road"
                v-if="i !== 0"
                :key="i+'w'"
                :style="{
                              margin: `${tunnelStyle.contentHeight /
                                tunnelInfoData.laneNums}px 0`,
                            }"
              ></div>
            </template>
            <div class="line-side"></div>
          </div>
        </template>

        <!--类型是单右洞，展示中间间隔与左洞为透明状态-->
        <template v-if="tunnelInfoData.singleDoubleType === 1">
          <div style="opacity:0.2;filter:alpha(opacity=20);">
            <div
              class="tunnel-wall"
              style="height: 50px"
              :style="{
                            width: tunnelStyle.rightWidth,
                            marginLeft: tunnelStyle.rightMargin,
                          }"
            ></div>
            <div
              class="tunnel-line"
              :style="{
                            width: tunnelStyle.rightWidth,
                            marginLeft: tunnelStyle.rightMargin,
                          }"
            >
              <div class="line-side"></div>
              <template v-for="(v, i) in tunnelInfoData.laneNums">
                <div
                  class="line-road"
                  v-if="i !== 0"
                  :key="i+'m'"
                  :style="{
                                margin: `${tunnelStyle.contentHeight /
                                  tunnelInfoData.laneNums}px 0`,
                              }"
                ></div>
              </template>
              <div class="line-side"></div>
            </div>
          </div>
        </template>

        <!--类型是双洞，在中间放个间隔-->
        <div style="height: 50px"></div>

        <!--类型是单左洞，展示中间间隔与右洞为透明状态-->
        <template v-if="tunnelInfoData.singleDoubleType === 2">
          <div style="opacity:0.2;filter:alpha(opacity=20);">
            <div
              class="tunnel-line"
              :style="{
                            width: tunnelStyle.leftWidth,
                            marginLeft: tunnelStyle.leftMargin,
                          }"
            >
              <div class="line-side"></div>
              <template v-for="(v, i) in tunnelInfoData.laneNums">
                <div
                  class="line-road"
                  v-if="i !== 0"
                  :key="i"
                  :style="{
                                margin: `${tunnelStyle.contentHeight /
                                  tunnelInfoData.laneNums}px 0`,
                              }"
                ></div>
              </template>
              <div class="line-side"></div>
            </div>
            <div
              class="tunnel-wall"
              style="height: 50px;"
              :style="{
                            width: tunnelStyle.leftWidth,
                            marginLeft: tunnelStyle.leftMargin,
                          }"
            ></div>
          </div>
        </template>

        <!--类型是右洞或者双洞，展示右洞的图-->
        <template v-if="
                        tunnelInfoData.singleDoubleType === 3 ||
                          tunnelInfoData.singleDoubleType === 1
                      ">
          <div
            class="tunnel-line"
            :style="{
                          width: tunnelStyle.rightWidth,
                          marginLeft: tunnelStyle.rightMargin,
                        }"
          >
            <div class="line-side"></div>
            <template v-for="(v, i) in tunnelInfoData.laneNums">
              <div
                class="line-road"
                v-if="i !== 0"
                :key="i+'r'"
                :style="{
                              margin: `${tunnelStyle.contentHeight /
                                tunnelInfoData.laneNums}px 0`,
                            }"
              ></div>
            </template>
            <div class="line-side"></div>
          </div>
          <div
            class="tunnel-wall"
            style="height: 50px"
            :style="{
                          width: tunnelStyle.rightWidth,
                          marginLeft: tunnelStyle.rightMargin,
                        }"
          ></div>
        </template>

        <!--设备列表-->
        <template v-for="(item, index) in tunnelDevices">
          <img
            class="icon"
            :key="item.id + '_' + index"
            :class="{ middle: item.orientationLocation === 11, [item.deviceTypeCode]: true }"
            :draggable="false"
            :style="getDeviceStyle(item, 'img')"
            @click.stop="[...showDetail(item)]"
            v-show="isShow(item)"
            :src="`${config.imagePrefix}/icon/${item.leftRightFlag}/${item.deviceTypeCode}_${item.deviceCommunicationsState}${item.workMode != null ? '_' + item.workMode : ''}.png`"
          >

          <template v-if="item.sensorValTextList && item.sensorValTextList.length && isShow(item)">
            <div
              class="sensorValText"
              :key="item.id + '_sensorValText_' + index"
              :style="getDeviceStyle(item, 'text')"
              @click.stop="[...showDetail(item)]"
            >
              <div
                class="sensorValTextContainer"
                :key="item.id + '_sensorValTextContainer_' + index"
              >
                <div
                  class="board-item"
                  v-for="(text, idx) in item.sensorValTextList"
                  :key="item.id + '_' + index + '_sensorValTextList_' + idx"
                >
                  <span>{{ text.name + ':' + text.value  }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="item.deviceTypeCode === 'intelligenceboard' && item.content && item.content.length && isShow(item)">
            <div
              class="board"
              :key="item.id + '_board_' + index"
              :style="getDeviceStyle(item)"
              @click.stop="[...showDetail(item)]"
            >
              <div
                class="border-swiper"
                :key="item.id + 'border-swiper_' + index"
              >
                <div
                  class="board-item"
                  v-for="(board, idx) in item.content"
                  :key="item.id + '_' + index + '_' + idx"
                >
                  <span>{{ board }}</span>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- 设备点击弹出设备信息 -->
        <div class="device-popover">
          <div class="device-popover-content">
            <p>
              设备名称：{{ currentDevice.deviceName }}({{ currentDevice.deviceCommunicationsStateName }})
            </p>
            <p>设备桩号：{{ currentDevice.pileNumberStr }}</p>
            <p v-if="currentDevice.workMode !== null">
              当前模式：{{ currentDevice.workModeName }}
            </p>
            <p v-if="currentDevice.sensorValText != null">
              当前数据：{{ currentDevice.sensorValText }}
            </p>
          </div>
        </div>

        <!-- 隧道空洞、人行横洞、车辆横洞、配电房、水泵房 -->
        <template
          v-if="tunnelInfoData.emptyrecordList"
          v-for="(empty, index) in tunnelInfoData.emptyrecordList"
        >
          <div
            :key="index"
            :style="getEmptyStyle(empty)"
          >
            <span
              v-if="empty.emptyType === 3"
              style="font-size: 14px"
            >水泵房</span>
            <span
              v-if="empty.emptyType === 4 || empty.emptyType === 5"
              style="font-size: 14px"
            >配电房</span>
          </div>
        </template>

      </div>

      <div
        v-if="
          tunnelInfoData.singleDoubleType === 3 ||
            tunnelInfoData.singleDoubleType === 2
        "
        v-for="(item, index) in tunnelBunntntt"
        :key="index + 'a'"
        :style="divLeftRight(index)"
      >
        <div
          class="iconTextLeft"
          v-for="(item, i) in tunnelInfoData.laneNums"
          :key="'iconTextLeft_' + i"
          :style="backleft(i, 2)"
        >
          <span>{{ tunnelInfoData.leftHoleDirection }}</span>
          <!-- <cmd-icon type="arrow-left" class="iconLeft"></cmd-icon> -->
          <i class="el-icon-back iconLeft"></i>
        </div>
      </div>

      <div
        v-if="
                    tunnelInfoData.singleDoubleType === 3 ||
                      tunnelInfoData.singleDoubleType === 1
                  "
        v-for="(item, index) in tunnelBunntntt"
        :key="index + 'c'"
        :style="divLeftRight(index)"
      >
        <div
          class="iconTextRight"
          v-for="(item, i) in tunnelInfoData.laneNums"
          :key="i+'s'"
          :style="backleft(i, 1)"
        >
          <!-- <cmd-icon type="arrow-right" class="iconLeft iconLeft2"></cmd-icon> -->
          <i class="el-icon-right iconLeft2"></i>
          <span>{{ tunnelInfoData.rightHoleDirection }}</span>

        </div>
      </div>
      <!-- </div> -->
    </div>

    <div
      class="tunnelBunntn"
      v-if="this.tunnelInfoData.showMode === 1"
    >
      <span
        v-for="(item, index) in tunnelBunntn"
        :key="index"
        :class="{ 'sel-button': true, active: buttonClass === index }"
        @click="movebutton(index)"
      >k{{ item }}
      </span>
    </div>

  </div>
</template>

<script>
import imageConfig from "@/utils/imageConfig.js";
const TUNNEL_STANDARD_LENGTH = 1000; // 1920屏幕时 2D隧道占90% = 1728px （当showMode=1时，1728表示隧道TUNNEL_STANDARD_LENGTH的长度）
import * as config from "@/utils/constant";
export default {
  name: "t-tunnel",
  props: {
    // 隧道ID
    tunnelId: {
      type: String,
      default: ""
    },
    // 隧道信息
    tunnelInfoData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 隧道下的设备
    tunnelDevices: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 过滤显示设备类型
    showActiveType: {
      type: String | Number,
      default: "all"
    },
    showActiveclassifyNumber: {
      type: String | Number,
      default: "all"
    }
  },
  data() {
    return {
      config,
      windowWidth: 0,
      // // 隧道信息
      // tunnelInfoData: {},
      // // 隧道下的设备
      // tunnelDevices: [],
      // 隧道最长长度
      maxEndMapStakeMark: 0,
      // 隧道最短长度
      minStartMapStakeMark: 0,
      // 显示隧道方向数量 （根据隧道长度 每1Km显示一个）
      tunnelBunntntt: 0,
      // 隧道基本信息
      outerWidth: 0,
      outerWidthout: 0,

      currentDevice: {},

      buttonClass: 0,

      scrollLeft: 0,
      old: {
        scrollLeft: 0
      }
    };
  },
  computed: {
    tunnelBunntn() {
      let beginMark = this.minStartMapStakeMark / 1000; //获取最小桩号
      let endMark = this.maxEndMapStakeMark / 1000; //获取最大桩号
      let bottom = [];
      let a = Math.floor(beginMark);
      let b = Math.floor(endMark);
      for (let i = a; i < b; i += TUNNEL_STANDARD_LENGTH / 1000) {
        bottom.push(i);
      }
      return bottom;
    },
    // 隧道2d背景图的样式
    tunnelStyle() {
      // const Tunnel = new TunnelClass(this.tunnelInfoData)
      // return Tunnel().background()
      // 如果不是双洞类型，就不用比较距离和长短
      let {
        leftHoleLength, // 左洞长度
        rightHoleLength, // 右洞长度
        endStakeMark, // 结束桩号
        endStakeMarkRight, // 右洞结束桩号
        laneNums, // 车道数
        startStakeMark, // 开始桩号
        startStakeMarkRight // 右洞开始桩号
      } = this.tunnelInfoData;
      let config = {
        sideHeight: 6, // 左右两边的线的宽度
        padding: 20, // 背景的padding
        lineHeight: 2, // 中间的线的宽度
        contentHeight: 150, // 中间内容的高度
        center: 50 // 两个洞连接处的高度
      };

      config.tunnelLine =
        config.contentHeight +
        config.padding * 2 +
        config.sideHeight * 2 +
        (laneNums - 1) * config.lineHeight; // 一个洞的高度

      let mapLength = this.maxEndMapStakeMark - this.minStartMapStakeMark; // 隧道长度

      leftHoleLength = endStakeMark - startStakeMark; // 左洞长度
      rightHoleLength = endStakeMarkRight - startStakeMarkRight; // 右洞长度
      let minStartStakeMark = Math.max(startStakeMark, startStakeMarkRight);

      //计算方式
      /*
            1、得到最小设备桩号和最大设备桩号
            2、得到画布长度：最大设备桩号-最小设备桩号
            3、得到%1所表示的桩号长度 100/画布长度
            3、左洞画布长度等于：(左洞结束桩号-左洞开始桩号)*%1所表示的桩号长度
            4、左洞画布距离左侧长度：(最大桩号-左洞结束桩号)*%1所表示的桩号长度
        */

      // 地图显示区域宽度，固定模式时值等于长度100%，分段模式时候的值等于长度 / 2000米 （从原来1000改为2000
      let outerWidth = this.windowWidth * 0.9; // 隧道图容器的宽度为窗口的90% 1728px 表示隧道2000m长度
      // 分段模式时候的值的比例
      let mapScaleMode1 = outerWidth / TUNNEL_STANDARD_LENGTH;

      //左边间隔 隧道开始桩号 减去 设备开始桩号
      let leftMar =
        startStakeMark - this.minStartMapStakeMark > 0
          ? startStakeMark - this.minStartMapStakeMark
          : 0;
      let rightMar =
        startStakeMarkRight - this.minStartMapStakeMark > 0
          ? startStakeMarkRight - this.minStartMapStakeMark
          : 0;

      // 分段模式显示时候 按outerWidth(地图显示区域)等于长度2000米的比例计算得到 PX
      if (this.tunnelInfoData.showMode === 1) {
        let res = {
          ...config,
          leftWidth: mapScaleMode1 * leftHoleLength + "px",
          leftMargin: mapScaleMode1 * leftMar + "px",
          rightWidth: mapScaleMode1 * rightHoleLength + "px",
          rightMargin: mapScaleMode1 * rightMar + "px",
          tunnelLine: config.tunnelLine,
          mapLength: mapLength
        };
        return res;
      }
      //固定模式显示时候 按outerWidth(地图显示区域)等于100%的比例计算得到 %
      else {
        let res = {
          ...config,
          leftWidth: (leftHoleLength / mapLength) * 100 + "%",
          leftMargin: (leftMar / mapLength) * 100 + "%",
          rightWidth: (rightHoleLength / mapLength) * 100 + "%",
          rightMargin: (rightMar / mapLength) * 100 + "%",
          tunnelLine: config.tunnelLine,
          mapLength: mapLength
        };
        return res;
      }
    },
    scrollX() {
      return this.tunnelInfoData.showMode === 1;
    },
    mapStyle() {
      if (this.tunnelInfoData.showMode === 0) {
        return {
          overflow: "initial"
        };
      }
    },
    tunnel2dStyle() {
      if (this.tunnelInfoData.showMode === 0) {
        return {
          width: "100%"
        };
      } else if (this.tunnelInfoData.showMode === 1) {
        return {
          width: this.outerWidth + "px"
        };
      }
    }
  },
  watch: {
    tunnelDevices: {
      deep: true,
      // immediate: true,
      handler() {
        this.findTunnelBaseInfo();
        this.outerWidths();
      }
    }
  },
  mounted() {
    this.windowWidth = this.$el.offsetWidth;
    console.log(this.windowWidth, "====");
    this.findTunnelBaseInfo();
    this.outerWidths();
  },
  methods: {
    isShow(item) {
      if (this.showActiveType !== "all") {
        return item.bookClassifyId === this.showActiveType;
      } else if (this.showActiveclassifyNumber !== "all") {
        return item.classifyNumber === this.showActiveclassifyNumber;
      }
      return true;
    },
    getImageMode(item) {
      let { widthFixArray } = imageConfig;
      if (widthFixArray.indexOf(item.classifyNumber) !== -1) {
        return "widthFix";
      }
      return "heightFix";
    },
    showDetail(item) {
      this.$emit("detail", item);
    },
    handleScroll(e) {
      // this.old.scrollLeft = e.detail.scrollLeft;
      // let abs = Math.round(e.detail.scrollLeft / this.outerWidth);
      // this.buttonClass = abs;
    },
    //点击移动
    movebutton(i) {
      this.scrollLeft = this.old.scrollLeft;
      this.$nextTick(() => {
        this.scrollLeft = i * this.outerWidth;
        this.buttonClass = i;
      });
    },
    getRealPx(w) {
      // var real = 0;
      // try {
      //   var scale = this.windowWidth / 1920
      //   real = scale * w
      //   return real
      // } catch (e) {
      //   return real
      // }
      return w;
    },
    //Scroll监听移动
    divLeftRight(i) {
      switch (i) {
        case 0:
          return {
            position: "absolute",
            top: 0,
            left: this.outerWidth / 2 + i * (this.outerWidth / 2) + "px"
          };
        default: {
          return {
            position: "absolute",
            top: 0,
            left: i * this.outerWidth + this.outerWidth / 2 + "px"
          };
        }
      }
    },
    // 路标指示样式
    backleft(i, leftRightFlag) {
      let { laneNums, singleDoubleType } = this.tunnelInfoData;
      const {
        sideHeight,
        padding,
        lineHeight,
        contentHeight,
        center,
        tunnelLine
      } = this.tunnelStyle;

      const defaultTop =
        padding +
        sideHeight +
        contentHeight / laneNums / 2 +
        i * (contentHeight / laneNums + lineHeight);
      let top = defaultTop;

      // 如果是双洞的话，设备位置还得根据左右洞位置调整
      if (singleDoubleType === 3) {
        // 右洞中的路标
        if (leftRightFlag === 1) {
          top += tunnelLine + center;
        }

        // 左洞中的路标
        if (leftRightFlag === 2) {
          top = tunnelLine - top;
        }
      }

      //单左洞
      else if (singleDoubleType === 2) {
        // 右洞的话设备位置从上到下应该是10~0，所以这里从上到下计算的高度要用整个洞的高度减掉，就可以调转过来了
        top = tunnelLine - top;
      }

      //单右洞
      else if (singleDoubleType === 1) {
        // 右洞要-卷闸门的高度
        top += tunnelLine + center;
      }

      return {
        top: top + 50 + "px",
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
    findTunnelBaseInfo() {
      if (
        !this.tunnelInfoData.showMode ||
        this.tunnelInfoData.showMode == null
      ) {
        this.tunnelInfoData.showMode = 0;
      }
      // 获取隧道地图的长度
      let maxEndStakeMark = 0;
      let minStartStakeMark = 0;
      if (this.tunnelInfoData.singleDoubleType === 3) {
        // 双洞
        maxEndStakeMark = Math.max(
          this.tunnelInfoData.endStakeMark,
          this.tunnelInfoData.endStakeMarkRight
        );
        minStartStakeMark = Math.min(
          this.tunnelInfoData.startStakeMark,
          this.tunnelInfoData.startStakeMarkRight
        );
      } else if (this.tunnelInfoData.singleDoubleType === 2) {
        // 单左洞
        maxEndStakeMark = this.tunnelInfoData.endStakeMark;
        minStartStakeMark = this.tunnelInfoData.startStakeMark;
      } else if (this.tunnelInfoData.singleDoubleType === 1) {
        // 单右洞
        maxEndStakeMark = this.tunnelInfoData.endStakeMarkRight;
        minStartStakeMark = this.tunnelInfoData.startStakeMarkRight;
      }

      // if (this.maxEndMapStakeMark > 0) {
      //   this.maxEndMapStakeMark = Math.max(
      //     maxEndStakeMark,
      //     this.maxEndMapStakeMark
      //   )
      // } else {
      //   this.maxEndMapStakeMark = maxEndStakeMark
      // }
      // if (this.minStartMapStakeMark > 0) {
      //   this.minStartMapStakeMark = Math.min(
      //     minStartStakeMark,
      //     this.minStartMapStakeMark
      //   )
      // } else {
      //   this.minStartMapStakeMark = minStartStakeMark
      // }

      this.maxEndMapStakeMark = maxEndStakeMark;
      this.minStartMapStakeMark = minStartStakeMark;

      // 对比设备与隧道的起止桩号 获取隧道地图的长度
      for (let index in this.tunnelDevices) {
        if (this.maxEndMapStakeMark > 0) {
          this.maxEndMapStakeMark = Math.max(
            this.tunnelDevices[index].pileNumber,
            this.maxEndMapStakeMark
          );
        } else {
          this.maxEndMapStakeMark = this.tunnelDevices[index].pileNumber;
        }
        if (this.minStartMapStakeMark > 0) {
          this.minStartMapStakeMark = Math.min(
            this.tunnelDevices[index].pileNumber,
            this.minStartMapStakeMark
          );
        } else {
          this.minStartMapStakeMark = this.tunnelDevices[index].pileNumber;
        }
      }
    },
    //获取初始宽度
    outerWidths() {
      let mapLength = this.maxEndMapStakeMark - this.minStartMapStakeMark;
      // let outerWidths = (document.body.clientWidth / 100) * 60
      let outerWidths = (this.windowWidth / 100) * 90;

      console.log(this.windowWidth, this.$el, "===111=");
      this.outerWidthout = outerWidths;
      this.outerWidth = outerWidths;
      if (this.tunnelInfoData.showMode === 1) {
        this.tunnelBunntntt = Math.round(mapLength / TUNNEL_STANDARD_LENGTH);
      } else {
        this.tunnelBunntntt = 1;
      }
    },
    // 计算空洞位置
    getEmptyStyle(item) {
      const { length, pileNumber, leftRightFlag } = item;
      const { singleDoubleType } = this.tunnelInfoData;
      const { maxLength, tunnelLine, center } = this.tunnelStyle;
      let mapLength = this.maxEndMapStakeMark - this.minStartMapStakeMark;

      //地图显示区域宽度，固定模式时值等于长度100%，分段模式时候的值等于长度2000米
      let outerWidth = (this.windowWidth / 100) * 90;
      //分段模式时候的值的比例
      let mapScaleMode1 = outerWidth / TUNNEL_STANDARD_LENGTH;

      let defaultLeft = 0;
      //计算设备位置+10
      //分段模式显示时候 按outerWidth(地图显示区域)等于长度2000米的比例计算得到 PX
      if (this.tunnelInfoData.showMode === 1) {
        defaultLeft =
          mapScaleMode1 * (pileNumber - this.minStartMapStakeMark) +
          this.getRealPx(10) +
          "px";
      }
      //固定模式显示时候 按outerWidth(地图显示区域)等于100%的比例计算得到 %
      else {
        defaultLeft =
          ((pileNumber - this.minStartMapStakeMark + this.getRealPx(10)) /
            mapLength) *
            100 +
          "%";
      }
      // emptyType  空洞类型（0空洞、1人行横洞、2车行横洞 3水泵房 4洞外配电房 5洞内配电房）
      // rotateDegree  旋转度数
      // leftRightFlag 1 右洞 2 左洞 3 中间
      switch (item.emptyType) {
        // 0 空洞
        case 0:
          return {
            position: "absolute",
            top:
              singleDoubleType === 3 && leftRightFlag === 1
                ? tunnelLine + center + this.getRealPx(30) + "px"
                : "0",
            height: tunnelLine + this.getRealPx(50) + "px",
            width: (length / mapLength) * 100 + "%",
            left: `${defaultLeft}`,
            background: "#142470",
            zIndex: 9
          };

        case 1:
          // 1 人行横洞
          return {
            position: "absolute",
            top: `calc(50% - ${this.getRealPx(55)}px)`,
            height: `${this.getRealPx(110)}px`,
            width: `${this.getRealPx(20)}px`,
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            transform: `rotate(${item.rotateDegree}deg)`
          };

        case 2:
          // 2 车行横洞
          return {
            position: "absolute",
            top: `calc(50% - ${this.getRealPx(55)}px)`,
            height: `${this.getRealPx(110)}px`,
            width: `${this.getRealPx(50)}px`,
            left:
              item.rotateDegree >= 30
                ? `calc(${defaultLeft} - ${this.getRealPx(35)}px)`
                : `${defaultLeft}`,
            // left: `${defaultLeft}`,
            background: "#3a5a8b",
            transform: `rotate( ${item.rotateDegree}deg)`
          };
        case 3:
          // 水泵房
          return {
            position: "absolute",
            top:
              singleDoubleType === 3 && leftRightFlag === 2
                ? tunnelLine + center + this.getRealPx(50) + "px"
                : "0",
            width: `${this.getRealPx(50)}px`,
            height: `${this.getRealPx(50)}px`,
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            zIndex: 9,
            color: "#ccc",
            lineHeight: `${this.getRealPx(50)}px`,
            textAlign: "center"
          };

        case 4:
          // 洞外配电房
          return {
            position: "absolute",
            top: `calc(50% - ${this.getRealPx(30)}px)`, // 配电房高度为30px
            height: `${this.getRealPx(60)}px`,
            width: `${this.getRealPx(80)}px`,
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            zIndex: 9,
            color: "#ccc",
            lineHeight: `${this.getRealPx(60)}px`,
            textAlign: "center"
          };
        case 5:
          // 洞内配电房
          return {
            position: "absolute",
            top: `calc(50% - ${this.getRealPx(15)}px)`,
            height: `${this.getRealPx(30)}px`,
            width: `${this.getRealPx(80)}px`,
            left: `${defaultLeft}`,
            background: "#3a5a8b",
            zIndex: 9,
            color: "#ccc",
            lineHeight: `${this.getRealPx(30)}px`,
            textAlign: "center"
          };
      }
    },
    // 计算设备位置
    getDeviceStyle(device, type) {
      // 0 左  10 右  1 车道1  2 车道2  3 车道3  4 车道4 ~~~ 9 车道
      // -1 左外面  11 横洞  12 右外面  13 右外面1  14 右外面2  15右外面3
      // 16 横洞左  17 横洞中  18 横洞右
      const { orientationLocation, classifyNumber } = device;
      const { laneNums, singleDoubleType } = this.tunnelInfoData;

      let mapLength = this.maxEndMapStakeMark - this.minStartMapStakeMark;
      //地图显示区域宽度，固定模式时值等于长度100%，分段模式时候的值等于长度1000米
      //let outerWidth = document.getElementById("map").offsetWidth;
      // 此处备注 分段模式下2000m隧道占屏幕的60%
      let outerWidth = (this.windowWidth / 100) * 90;
      //分段模式时候的值的比例
      let mapScaleMode1 = outerWidth / TUNNEL_STANDARD_LENGTH;

      const {
        sideHeight,
        padding,
        lineHeight,
        contentHeight,
        center,
        tunnelLine
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

      // 交通信号灯
      const signallampScale =
        device.classifyNumber === "signallamp" ? "1" : 2 / laneNums;

      // const defaultTransform = `translate(-50%, -50%) scale(${2 / laneNums}) ${device.classifyNumber === 'laneIndicator' && device.leftRightFlag === 2 ? 'rotate(180deg)' : ''}`
      // let defaultTransform = `translate(-50%, -50%) scale(${signallampScale}) ${
      //     device.classifyNumber === 'laneIndicator' && device.leftRightFlag === 2
      //         ? 'rotate(180deg)'
      //         : ''
      // }`

      let defaultTransform = `translate(-50%, -50%) scale(${signallampScale})`;

      // // leftRightFlag === 2 左洞
      // if (device.classifyNumber === 'laneIndicator' && device.leftRightFlag === 2) {
      //   defaultTransform = `translate(-50%, -50%) scale(${signallampScale}) rotate(180deg)`
      // }
      // // leftRightFlag === 1 右洞
      // if (device.leftRightFlag === 1 && device.workMode === 2) {
      //   defaultTransform = `translate(-50%, -50%) scale(${signallampScale}) rotate(180deg)`
      // }

      // if (device.leftRightFlag === 2 && device.workMode === 2) {
      //   defaultTransform = `translate(-50%, -50%) scale(${signallampScale})`
      // }

      //计算设备位置+5
      let defaultLeft = 0;
      //分段模式显示时候 按outerWidth(地图显示区域)等于长度2000米的比例计算得到 PX
      if (this.tunnelInfoData.showMode === 1) {
        defaultLeft =
          mapScaleMode1 * (device.pileNumber - this.minStartMapStakeMark) + 5 + "px";
        //如果是最左边第一个设备，则最小左间距为25px，防止设备图标显示不全
        if (mapScaleMode1 * (device.pileNumber - this.minStartMapStakeMark) <= 25) {
          defaultLeft = `${25}px`;
        }
      }
      //固定模式显示时候 按outerWidth(地图显示区域)等于100%的比例计算得到 %
      else {
        defaultLeft =
          ((device.pileNumber - this.minStartMapStakeMark) / mapLength) * 100 +
          "%";
      }
      let tempHeight = sideHeight / 2 + padding + 25;
      switch (orientationLocation) {
        case 0:
          // 左边
          // padding + height6/2
          top = padding + sideHeight / 2;
          defaultTransform = `translate(-50%, -50%) scale(${signallampScale}) rotate(${
            type ? 0 : "180deg"
          })`;
          break;
        case 10:
          // 右边
          top = rightDistance;
          break;
        case 13:
          // 右外面1
          top = rightDistance + tempHeight;
          break;
        case 14:
          // 右外面2
          top = rightDistance + tempHeight;
          break;
        case 15:
          // 15右外面3
          top = rightDistance + tempHeight;
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
      else if (singleDoubleType === 2) {
        // 左洞的话设备位置从上到下应该是10~0，所以这里从上到下计算的高度要用整个洞的高度减掉，就可以调转过来了
        top = tunnelLine - top;
        if (device.leftRightFlag === 1) {
          top = -1000;
        }
      }
      //单右洞
      else if (singleDoubleType === 1) {
        // 右洞要-卷闸门的高度
        top = tunnelLine + top + center;
        if (device.leftRightFlag === 2) {
          top = -1000;
        }
      }

      const defaultStyle = {
        transform: defaultTransform,
        top: `${top + 50}px`,
        left: `${defaultLeft}`,
        zIndex: device.sortInt || 10
      };

      if (type === "img") {
        if (this.getImageMode(device) === "widthFix") {
          defaultStyle.width = "50px";
          defaultStyle.height = "auto";
        } else {
          defaultStyle.width = "auto";
          defaultStyle.height = "50px";
        }
      }

      // 横洞左
      if (device.orientationLocation === 16) {
        return {
          ...defaultStyle,
          top: `calc(50% - 8px)`, // 8 TODO 图片大小
          left: `calc(${defaultLeft} + ${this.getRealPx(15)}px)` // 15 TODO 图片大小
        };
      }

      // 横洞中
      if (device.orientationLocation === 17) {
        return {
          ...defaultStyle,
          top: "50%"
        };
      }

      // 横洞右
      if (device.orientationLocation === 18) {
        return {
          ...defaultStyle,
          top: `calc(50% + 8px)`,
          left: `calc(${defaultLeft} - 15px)`
        };
      }

      return defaultStyle;
    }
  }
};
</script>

<style lang="scss" scoped>
.t-tunnel {
  width: 100%;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 101px;
  bottom: 115px;
  // border: 1px solid red;
}

.tunnel-2d {
  position: relative;
}

.center-lb {
  display: flex;
  width: 250px;
  position: absolute;
  top: 0;
  right: 65px;
  flex-direction: column;

  .center-lb-wz {
    font-size: 18px;
    font-weight: 400;
    color: #4995fe;
    flex: 1;
    text-align: center;
  }

  .center-lb-bg {
    width: 100%;
    height: 40px;
    background: url(../../assets/tunnel/lb.png) center center / 157px auto
      no-repeat;
    transform: rotate3d(0, 1, 0, 180deg);
  }

  &.center-lb2 {
    top: auto;
    bottom: 3px;
    left: 65px;
    right: auto;

    .center-lb-bg {
      transform: rotate3d(0, 1, 0, 0);
    }
  }
}

.tunnelBunntn {
  position: absolute;
  width: 100%;
  bottom: 20px;
  left: 0;
  text-align: center;

  .sel-button {
    padding: 10px;
    color: #c1d9ff;
    border: 1px solid #123a84;
    border-radius: 4px;

    & + .sel-button {
      margin-left: 20px;
    }

    &.active {
      background-color: #337cf3;
      color: #c1d9ff;
    }
  }

  // button {
  //   height: 0.4rem;
  //   line-height: 0.1rem;
  //   font-size: 14px;
  // }
}

.map {
  width: 90%;
  // border: 1px solid red;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  &.map-scroll {
    overflow-x: auto;
    overflow-y: hidden;
  }

  > * {
    box-sizing: border-box;
  }

  .iconTextLeft,
  .iconTextRight {
    transform: translate(0%, -50%) scale(1);
    position: absolute;
    // width: 100px;
    width: 200px;
    color: #9babc5;
    font-size: 14px;
    display: flex;
  }

  .iconLeft {
    // position: absolute;
    color: #9babc5;
    font-size: 14px !important;
    line-height: 12px !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 0 0 10px;

    &.iconLeft2 {
      margin: 0 10px 0;
    }
  }

  .tunnel-wall {
    height: 50px;
    background-image: url("../../assets/tunnel/tunnel/wall.png");
    background-size: auto 50px;
    opacity: 0.7;
  }

  .tunnel-line {
    background: #272473;
    padding: 20px 6px;
    /*no*/
    position: relative;
    z-index: 1;
    box-sizing: border-box;
  }

  .line-side {
    // 道路两边的线
    height: 6px;
    /*no*/
    background: #4696d3;
  }

  .line-road {
    // 中间的线
    height: 4px;
    background: #4696d3;
    overflow: hidden;
    span {
      display: block;
      opacity: 0;
      height: 2px;
      overflow: hidden;
    }
  }

  .icon {
    position: absolute;
    width: 50px;
    height: 50px;
  }
  .sensorValText {
    position: absolute;
    color: #ffffff;
    width: 50px;
    height: 50px;
    .sensorValTextContainer {
      margin-top: 50px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      text-align: center;
    }
  }
  .board {
    width: 229px;
    height: 50px;
    position: absolute;
    font-size: 23px;
    color: #f61f13;
    overflow: hidden;
    padding: 4px 28px;
    box-sizing: border-box;
    .border-swiper {
      width: 100%;
      display: flex;
      overflow: hidden;
    }
    .board-item {
      white-space: nowrap;
      min-width: 100%;
      flex-shrink: 0;
      animation: 5s move infinite linear;
      padding-right: 20px;
      > span {
        font-size: 23px;
      }
    }
  }

  .device-popover {
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    background-color: red;
    width: 100px;
    height: 100px;
    display: none;
  }
}

  
</style>

<style lang="scss">
@keyframes move {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-200%);
  }
}
.left-scroll, .area-scroll, .map-scroll, .scroll-container, .lighting-center-scroll {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  /* 滚动槽 */
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
  &::-webkit-scrollbar-thumb {
    background: #3f62dd;
  }
}
.scroll-content {
  min-height: 100%;
  position: relative;
}
.no-data {
  // width: 50%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 0;
  img {
    width: 44%;
  }
  span {
    margin-top: 28px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #5DA0FE;
  }
}
.device-item {
  .device-title {
    position: relative;
  }
  .sensorValTextShow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    color: #FFFFFF;
    font-size: 12px;
    line-height: 14px;
  }
  &.active {
    .device-info {
      background: #e7743a !important;
      color: #FFFFFF !important;
    }
  }
}
</style>
