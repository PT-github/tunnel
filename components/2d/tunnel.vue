<template>
  <div class='tunnel-container'>
    <div class="title">{{tunnelInfo.belongsStretch}} - {{tunnelInfo.tunnelName}}</div>
    <div class="map">
      <!--2d背景图-->
      <div class="tunnel-2d">
        <!--类型是左洞或者双洞，展示左洞的图-->
        <template v-if="tunnelInfo.singleDoubleType===3 || tunnelInfo.singleDoubleType===2">
          <div class="tunnel-wall" style="height: 30px"
               :style="{width:tunnelStyle.leftWidth,marginLeft:tunnelStyle.leftMargin}"></div>
          <div class="tunnel-line" :style="{width:tunnelStyle.leftWidth,marginLeft:tunnelStyle.leftMargin}">
            <div class="line-side"></div>
            <template v-for="(v,i) in tunnelInfo.laneNums">
              <div class="line-road" v-if="i!==0"
                   :style="{margin:`${tunnelStyle.contentHeight/tunnelInfo.laneNums}px 0`}"></div>
            </template>
            <div class="line-side"></div>
          </div>
        </template>

        <!--类型是双洞，在中间放个间隔-->
        <div v-if="tunnelInfo.singleDoubleType===3" style="height: 30px;"></div>

        <!--类型是右洞或者双洞，展示右洞的图-->
        <template v-if="tunnelInfo.singleDoubleType===3 || tunnelInfo.singleDoubleType===1">
          <div class="tunnel-line" :style="{width:tunnelStyle.rightWidth,marginLeft:tunnelStyle.rightMargin}">
            <div class="line-side"></div>
            <template v-for="(v,i) in tunnelInfo.laneNums">
              <div class="line-road" v-if="i!==0"
                   :style="{margin:`${tunnelStyle.contentHeight/tunnelInfo.laneNums}px 0`}"></div>
            </template>
            <div class="line-side"></div>
          </div>
          <div class="tunnel-wall" style="height: 30px"
               :style="{width:tunnelStyle.rightWidth,marginLeft:tunnelStyle.rightMargin}"></div>
        </template>

        <!--设备列表-->
        <template v-for="item in deviceList">
          <el-popover placement="top" trigger="hover">
            <div class="popover">
              <p>设备名称：{{item.deviceName}}({{item.deviceCommunicationsStateName}})</p>
              <p>设备桩号：{{item.pileNumberStr}}</p>
              <p v-if="item.workMode!=null">当前模式：{{item.workModeName}}</p>
              <p v-if="item.sensorValText!=null">当前数据：{{item.sensorValText}}</p>
            </div>
            <img slot="reference" class="icon" :class="{middle:item.orientationLocation === 11}"
                 :style="getDeviceStyle(item)"
                 @click.stop="showDetail(item)"
                 v-show="(!wait || waitShowList[item.id]) && (showActiveType==='all' || item.classifyNumber === showActiveType)"
                 :src="`/static/image/tunnel/${(item.classifyNumber=='environment'?item.deviceTypeCode:item.classifyNumber)}_${item.deviceCommunicationsState}${(item.workMode!=null?'_'+item.workMode:'')}.png`">
          </el-popover>
        </template>

        <!--空洞-->
        <template v-if="tunnelInfo.emptyrecordList" v-for="empty in tunnelInfo.emptyrecordList">
          <div :style="getEmptyStyle(empty)"></div>
        </template>
      </div>

      <div class="direction right">
        <img class="img" src="../../assets/images/tunnel/tunnel-direction-right.png">
        <div class="text">{{this.tunnelInfo.rightHoleDirection}}</div>
      </div>

      <div class="direction left">
        <img class="img" src="../../assets/images/tunnel/tunnel-direction.png">
        <div class="text">{{this.tunnelInfo.leftHoleDirection}}</div>
      </div>
    </div>
    <slot name="controls"></slot>
  </div>
</template>
<script>
export default {
  services: ['_2d', 'tunnel'],
  props: {
    showActiveType: {
      type: String | Number,
      default: 'all'
    },    // 正在展示的type
    wait: Boolean,
    fullScreen: Boolean
  },
  data() {
    return {
      waitShowList: {},
      tunnelId: this.$route.query.tunnelId,
      deviceList: [],
      modal: false,
      //隧道基本信息
      tunnelInfo: {}
    };
  },
  computed: {
    tunnelStyle() {    // 隧道2d背景图的样式
      // 如果不是双洞类型，就不用比较距离和长短
      let {leftHoleLength, rightHoleLength, endStakeMark, endStakeMarkRight, laneNums, startStakeMark, startStakeMarkRight} = this.tunnelInfo;
      let config = {
        sideHeight: 6,  // 左右两边的线的宽度
        padding: 10,    // 背景的padding
        lineHeight: 2,  // 中间的线的宽度
        contentHeight: this.fullScreen ? 130 : 100, // 中间内容的高度
        center: 30  // 两个洞连接处的高度
      };
      config.tunnelLine = config.contentHeight + config.padding * 2 + config.sideHeight * 2 + (laneNums - 1) * config.lineHeight;   // 一个洞的高度
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
      } else {
        //startStakeMark 左洞开始
        //endStakeMark   左洞结束
        // startStakeMarkRight 右开
        //endStakeMarkRight 右结
        var beginMark = Math.min(startStakeMark, startStakeMarkRight);//获取最小桩号
        var endMark = Math.max(endStakeMark, endStakeMarkRight);//获取最大桩号

        let maxHoleLength = endMark - beginMark;//最大长度 Math.max(leftHoleLength, rightHoleLength);


        leftHoleLength = endStakeMark - startStakeMark;//左洞长度
        rightHoleLength = endStakeMarkRight - startStakeMarkRight;//右洞长度
        let maxEndStakeMark = Math.max(endStakeMark, endStakeMarkRight);
        let minstartStakeMark = Math.min(startStakeMark, startStakeMarkRight);

        let stakeDistance = Math.abs(endStakeMark - endStakeMarkRight);
        //let stakeLeftDistance = Math.abs(endStakeMark - endStakeMarkRight);


        var maxLength = endMark - beginMark;

        var lengthV = 100 / maxHoleLength;
//计算方式
        /*
            1、得到最小桩号和最大桩号
            2、得到画布长度：最大桩号-最小桩号
            3、得到%1所表示的桩号长度 100/画布长度
            3、左洞画布长度等于：(左洞结束桩号-左洞开始桩号)*%1所表示的桩号长度
            4、左洞画布距离左侧长度：(最大桩号-左洞结束桩号)*%1所表示的桩号长度
        */
        let res = {
          ...config,
          leftWidth: (lengthV * leftHoleLength) + '%',
          leftMargin: ((startStakeMark - minstartStakeMark) * lengthV) + '%',
          rightWidth: (rightHoleLength * lengthV) + '%',
          rightMargin: ((startStakeMarkRight - minstartStakeMark) * lengthV) + '%',
          leftStakeMark: minstartStakeMark
        };

        /*
        let res = {
            ...config,
            leftWidth: (leftHoleLength / maxHoleLength) * 100 + '%',
            leftMargin: ((maxEndStakeMark - endStakeMark) / stakeDistance) + '%',
            rightWidth: (rightHoleLength / maxHoleLength) * 100 + '%',
            rightMargin: ((maxEndStakeMark - endStakeMarkRight) / stakeDistance) + '%',
            leftStakeMark: maxEndStakeMark
        };*/
        // 计算出画布总宽度(米)


        if (leftHoleLength > rightHoleLength) {
          res.maxLength = leftHoleLength + (endStakeMark > endStakeMarkRight ? 0 : stakeDistance);
        } else {
          res.maxLength = rightHoleLength + (endStakeMarkRight > endStakeMark ? 0 : stakeDistance);
        }

        res.maxLength = endMark - beginMark;
        return res;
      }
    }
  },
  watch: {
    async $route() {
      await this.findTunnelBaseInfo();
      this.listDeviceBaseOfTunnelPage();
    }
  },
  async mounted() {
    await this.findTunnelBaseInfo();
    this.listDeviceBaseOfTunnelPage();
  },
  methods: {
    showWait(id) {
      this.waitShowList = {...this.waitShowList, [id]: true};
    },
    clearWait() {
      this.waitShowList = {};
    },

    // 计算空洞位置
    getEmptyStyle(item) {
      let {length, pileNumber, leftRightFlag} = item, {singleDoubleType} = this.tunnelInfo;
      let {leftStakeMark, maxLength, tunnelLine, center} = this.tunnelStyle;
      // console.log(tunnelLine, pileNumber, leftStakeMark, maxLength, leftRightFlag);

      // emptyType  空洞类型（0空洞、1人行横洞、2车行横洞）
      // console.log(item.emptyType);
      // rotateDegree  旋转度数
      // console.log(item.rotateDegree);

      return {
        position: 'absolute',
        top: singleDoubleType === 3 && leftRightFlag === 2 ? tunnelLine + center + 30 + 'px' : '0',
        height: tunnelLine + 30 + 'px',
        width: length / maxLength * 100 + '%',
        left: (pileNumber - leftStakeMark) / maxLength * 100 + '%',
        background: '#11226D'
      };
    },
    getDeviceStyle(device) {   // 计算设备位置
      // 0 左  10 右  1 车道1  2 车道2  3 车道3  4 车道4 ~~~~
      // -1 左外面  11 横洞  12 右外面  13 右外面1  14 右外面2  15右外面3
      const {orientationLocation} = device
      const {laneNums, singleDoubleType} = this.tunnelInfo;
      const {leftStakeMark, maxLength, sideHeight, padding, lineHeight, contentHeight, center, tunnelLine} = this.tunnelStyle;
      // padding + 固定高度 + 线条数量*2 + height6/2
      const rightDistance = padding + sideHeight + contentHeight + (laneNums - 1) * lineHeight + sideHeight / 2;
      let top = 0

      if (orientationLocation === 0) {
        // 左边
        // padding + height6/2
        top = padding + sideHeight / 2;
      } else if (orientationLocation === 10) {
        // 右边
        top = rightDistance
      } else if (orientationLocation === 13 || orientationLocation === 14 || orientationLocation === 15) {
        // 右外面1 右外面2 15右外面3
        top = rightDistance + 27;
      } else {
        top = padding + sideHeight + contentHeight / laneNums / 2 + (device.orientationLocation - 1) * (contentHeight / laneNums + 2);
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

      return {
        transform: `translate(-50%, -50%) scale(${2 / laneNums}) ${device.classifyNumber === 'laneIndicator' && device.leftRightFlag === 2 ? 'rotateY(180deg)' : ''}`,
        top: device.orientationLocation === 11 ? '50%' : (top + 30 + 'px'),
        left: (device.pileNumber - leftStakeMark) / maxLength * 100 + '%',
        zIndex: device.sortInt || 1
      };
    },
    //隧道基本信息
    findTunnelBaseInfo() {
      return this.$service.tunnel.getById(this.tunnelId).then(res => {
        this.tunnelInfo = res;
      });
    },
    // 隧道的设备列表
    listDeviceBaseOfTunnelPage() {
      this.$service._2d.getTunnelDevices(this.tunnelId).then(res => {
        const supportList = ['signallamp', 'laneIndicator', 'urgentphone', 'broadcast', 'conflagration', 'guidelight', 'lighting', 'waterlevel', 'electronicfence', 'environment', 'tunneldoor', 'draughtfan', 'video', 'intelligenceboard'];
        let list = res.filter(v => {
          let support = supportList.includes(v.classifyNumber);
          if (!support) console.warn('不支持显示设备', v);
          return support;   // positionFlag为空不显示
        });
        this.deviceList = list;
        this.$emit('loaded', res);
      });
    },
    showDetail(item) {
      this.$emit('detail', item);
    }
  }
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
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: rgba(51, 124, 243, 1);
  line-height: 48px;
  text-align: center;
}

.map {
  width: 80%;
  margin-top: 36px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .tunnel-2d {
    width: 100%;

    .tunnel-line {
      //background: rgb(126, 214, 243);
      background: #3a5a8b;
      padding: 10px 6px; /*no*/
      position: relative;
    }

    .line-side { // 道路两边的线
      height: 6px; /*no*/
      //background: #fff;
      background: #ccc;
    }

    .line-road { // 中间的线
      height: 2px; /*no*/
      //background: #fff;
      background: #ccc;
    }
  }

  .direction {
    position: absolute;
    font-size: 18px;
    font-weight: bold;
    color: #337CF3;

    &.left {
      top: 10%;
      left: -2%;
      transform: translateX(-100%);
    }

    &.right {
      bottom: 10%;
      right: -2%;
      transform: translateX(100%);
    }
  }
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
  background-image: url('/static/image/tunnel/wall.png');
  background-size: 15px;
  opacity: .7;
}
</style>
