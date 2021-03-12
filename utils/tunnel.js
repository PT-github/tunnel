// export default class Tunnel {
//   constructor(options) {
//     this.instance = null
//     this.tunnelInfoData = {} || options.data

//     this.maxEndMapStakeMark = 0
//     this.minStartMapStakeMark = 0

//     if (!this.instance) {
//       this.instance = new Tunnel(options)
//       return this.instance
//     }
//   }

//   // 隧道2d背景图的样式
//   background() {

//   }
// }

export function backgroundStyle(options) {
  // 如果不是双洞类型，就不用比较距离和长短
  let {
    leftHoleLength,
    rightHoleLength,
    endStakeMark,
    endStakeMarkRight,
    laneNums,
    startStakeMark,
    startStakeMarkRight,
    showMode,
  } = options

  let config = {
    sideHeight: 6, // 左右两边的线的宽度
    padding: 10, // 背景的padding
    lineHeight: 2, // 中间的线的宽度
    contentHeight: this.fullScreen ? 130 : 100, // 中间内容的高度
    center: 30, // 两个洞连接处的高度
  }

  config.tunnelLine =
    config.contentHeight +
    config.padding * 2 +
    config.sideHeight * 2 +
    (laneNums - 1) * config.lineHeight // 一个洞的高度

  let mapLength = this.maxEndMapStakeMark - this.minStartMapStakeMark

  leftHoleLength = endStakeMark - startStakeMark //左洞长度
  rightHoleLength = endStakeMarkRight - startStakeMarkRight //右洞长度
  //console.log('mapLength',mapLength);
  //console.log('leftHoleLength',leftHoleLength);
  //console.log('rightHoleLength',rightHoleLength);
  let minStartStakeMark = Math.max(startStakeMark, startStakeMarkRight)
  //计算方式
  /*
   * 1、得到最小设备桩号和最大设备桩号
   * 2、得到画布长度：最大设备桩号-最小设备桩号
   * 3、得到%1所表示的桩号长度 100/画布长度
   * 4、左洞画布长度等于：(左洞结束桩号-左洞开始桩号)*%1所表示的桩号长度
   * 5、左洞画布距离左侧长度：(最大桩号-左洞结束桩号)*%1所表示的桩号长度
   */
  //地图显示区域宽度，固定模式时值等于长度100%，分段模式时候的值等于长度1000米
  //let outerWidth = document.getElementById("map").offsetWidth;
  let outerWidth = (document.body.clientWidth / 100) * 60
  //分段模式时候的值的比例
  let mapScaleMode1 = outerWidth / 1000
  // console.log('mapScaleMode1',mapScaleMode1)
  //左边间隔 隧道开始桩号 减去 设备开始桩号
  let leftMar =
    startStakeMark - this.minStartMapStakeMark > 0
      ? minStartStakeMark - this.minStartMapStakeMark
      : 0
  let rightMar =
    startStakeMarkRight - this.minStartMapStakeMark > 0
      ? startStakeMarkRight - this.minStartMapStakeMark
      : 0
  //console.log('rightMar',rightMar)
  //console.log('minStartStakeMark - this.minStartMapStakeMark',minStartStakeMark - this.minStartMapStakeMark)
  //console.log('startStakeMarkRight - this.minStartMapStakeMark',startStakeMarkRight - this.minStartMapStakeMark)
  //分段模式显示时候 按outerWidth(地图显示区域)等于长度1000米的比例计算得到 PX
  if (showMode === 1) {
    let res = {
      ...config,
      leftWidth: mapScaleMode1 * leftHoleLength + 'px',
      leftMargin: mapScaleMode1 * leftMar + 'px',
      rightWidth: mapScaleMode1 * rightHoleLength + 'px',
      rightMargin: mapScaleMode1 * rightMar + 'px',
      tunnelLine: config.tunnelLine,
      mapLength: mapLength,
    }
    return res
  }
  //固定模式显示时候 按outerWidth(地图显示区域)等于100%的比例计算得到 %
  else {
    let res = {
      ...config,
      leftWidth: (leftHoleLength / mapLength) * 100 + '%',
      leftMargin: (leftMar / mapLength) * 100 + '%',
      rightWidth: (rightHoleLength / mapLength) * 100 + '%',
      rightMargin: (rightMar / mapLength) * 100 + '%',
      tunnelLine: config.tunnelLine,
      mapLength: mapLength,
    }
    return res
  }
}
