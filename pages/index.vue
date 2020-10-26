<template>
  <section class="tunnel-index">
    <div class="block tunnel-index_left">
      <!-- 隧道事件信息 -->
      <LaoShanTunnelEventInfo _2d :tunnel-id.sync="tunnelId" style="margin: 0"/>
<!--      <tunnel-event-info @loaded="onLoadTunnelData" _2d style="margin: 0"></tunnel-event-info>-->

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
        <div class="stat-wrap"><!--狮子笼专用-->
          <div class="label">风速(m/s)</div>
          <div class="stat vi">
            <template v-if="tunnelData.singleDoubleType===3">
              <div class="num">左洞：{{ tunnelData.windSpeedLeft || tunnelData.windDirectionLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelData.windSpeedRight || tunnelData.windDirectionRight || 0 }}</div>
            </template>
            <div class="num" v-else>{{ tunnelData.windSpeedLeft || tunnelData.windSpeedRight || 0 }}</div>
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

    <section class="tunnel tunnel-index_right">
      <!-- 隧道详细信息 -->
      <div class="tunnel-info block" style="padding: 20px;">
        <div class="tunnel-row">
          <div class="tunnel-info-item">
            <img class="tunnel-info-item-img" :src="tunnelDetail.tunnelPictureUrl" alt="">
          </div>
          <div class="tunnel-info-item">
            <div class="tunnel-row tunnel-border">
              <div class="tunnel-info-item-tips">所属地区</div>
              <div class="tunnel-info-item-value">{{tunnelDetail.cityName || tunnelDetail.provinceName}}</div>
            </div>
            <div class="tunnel-row tunnel-border">
              <div class="tunnel-info-item-tips">所属路段</div>
              <div class="tunnel-info-item-value">{{tunnelDetail.belongsStretch || '-'}}</div>
            </div>
            <div class="tunnel-row tunnel-border">
              <div class="tunnel-info-item-tips">隧道类型</div>
              <div class="tunnel-info-item-value">{{tunnelDetail.tunnelTypeName || '-'}}</div>
            </div>
            <div class="tunnel-row tunnel-border">
              <div class="tunnel-info-item-tips">管理单位</div>
              <div class="tunnel-info-item-value">{{tunnelDetail.organizationName || '-'}}</div>
            </div>
            <div class="tunnel-row tunnel-border">
              <div class="tunnel-info-item-tips">限速</div>
              <div class="tunnel-info-item-value">{{tunnelDetail.speedLimit}}KM/小时</div>
            </div>
            <div class="tunnel-row tunnel-border">
              <div class="tunnel-info-item-tips">起止桩号</div>
              <div class="tunnel-info-item-value">K{{tunnelDetail.startStakeMarkKm}}+{{tunnelDetail.startStakeMarkM}} ~
                K{{tunnelDetail.endStakeMarkKm}}+{{tunnelDetail.endStakeMarkM}}
              </div>
            </div>
          </div>

          <div class="tunnel-info-item">
            <div style="width:100%;height:100%;border-bottom:1px solid #224C97;" ref="mapsDetail"></div>
          </div>
        </div>

        <div class="tunnel-info-remark">
          <span class="tunnel-tips">隧道说明：</span>
          <span class="tunnel-value">{{tunnelDetail.tunnelDescribe || ""}}</span>
        </div>
      </div>

      <div class="tunnel-bottom">
        <LaoShanTunnelDetailChart class="tunnel-count-chart block" :tunnelId="tunnelId"/>
<!--        <tunnelDetailChart class="tunnel-count-chart block" :tunnelId="tunnelId"/>-->
        <!--隧道类型设备统计-->
        <!--        <pie-chart-new/>-->
        <LaoShanPieChart/>
      </div>
    </section>
  </section>


</template>


<script>
import TipsTitle from '@/components/index/tips-title';
// import tunnelDetailChart from '@/components/tunnel/tunnel-detail-chart';
import tunnelDetailCate from '@/components/tunnel/tunnel-detail-cate';
import TunnelEventInfo from '@/components/home/tunnel-event-info';
import container from '@/components/analysis/char-container';
// import PreChart from '@/components/charts/pie-charts';
// import pieChartNew from '@/components/home/pie-chart-new';
import echarts from "echarts";
import LaoShanPieChart from "@/components/laoshan/PieChart";
import LaoShanTunnelDetailChart from "@/components/laoshan/TunnelDetailChart";
import LaoShanTunnelEventInfo from "@/components/laoshan/TunnelEventInfo";

export default {
  name: 'Home',
  components: {
    LaoShanTunnelEventInfo,
    LaoShanTunnelDetailChart,
    LaoShanPieChart,
    TipsTitle,
    // tunnelDetailChart,
    tunnelDetailCate,
    TunnelEventInfo,
    container,
    // PreChart,
    // pieChartNew
  },
  events: {
    'onPushEvent': 'queryAllRoadData'
  },
  services: ['home', 'tunnel', 'basic', 'energy', 'index'],
  data() {
    return {
      tunnelId: "",
      tunnelDetail: {},
      tunnelData: {},
      //设备类型
      sblxCharts: [],
      option4: [{type: 'tunnel'}, {type: 'LeftRightFlag'}],
    };
  },

  created() {
    this.getTunnelList()
  },


  async mounted() {
    // this.tunnelId = this.$route.query.tunnelId
    // this.tunnelDetail = await this.$service.tunnel.getById(this.tunnelId) || {}
    // // this.getList()
    // this.drawMaps(this.tunnelDetail.provinceId)
  },
  methods: {
    //设备类型图形
    // searchData4(param) {
    //   let {LeftRightFlag, tunnelId} = param;
    //   let rel = {
    //     leftRightFlag: LeftRightFlag ? LeftRightFlag : undefined,
    //     tunnelId: tunnelId ? tunnelId : undefined
    //   };
    //   this.$service.energy.selectDataDisplayDevices(rel).then(res => {
    //     this.sblxCharts = res || [];
    //   });
    // },

    onLoadTunnelData(e) {
      //   this.tunnelData = e;
      //
      //   console.log(e)
    },

    getTunnelList() {
      console.log('获取隧道列表')
      this.$service.tunnel.getListAll().then(async res => {
        console.log(res)
        if (res.length > 0) {
          const tunnelInfo = res[0]
          this.tunnelId = tunnelInfo.value
          this.tunnelDetail = await this.$service.tunnel.getById(tunnelInfo.value) || {}

          this.drawMaps(this.tunnelDetail.provinceId)

          this.tunnelData = await this.$service.home.getTunnelEventStat(tunnelInfo.value) || {}
        }
      })
    },

    // 地图描点
    drawMaps(code) {
      this.myChartMaps = echarts.init(this.$refs.mapsDetail);
      this.myChartMaps.showLoading();
      let provinceMap = {
        320000: "jiangsu",
        430000: "hunan",
      }
      let mapNames = provinceMap[code] || 'hunan';
      let res = require(`@/assets/cityMaps/${mapNames}.json`);
      echarts.registerMap(mapNames, res);
      let options = { // 图表主标题
        title: {
          // 文本
          show: true,
          // 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          top: 25,
          // 值: 'left', 'center', 'right' 同上
          left: "center",
          // 文本样式
          textStyle: {
            // 字体大小
            fontSize: 18,
            // 字体粗细
            fontWeight: 650,
            // 字体颜色
            color: "#fff"
          }
        },
        series: [{
          // 类型
          type: "map",
          // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
          // map: "湖南",
          // 地图类型
          mapType: mapNames,
          // 是否开启鼠标缩放和平移漫游 默认不开启
          // 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
          roam: true,
          // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          top: 70,
          selectedMode: "single",
          // 图形上的文本标签
          label: {
            show: true, // 是否显示对应地名
            color: "#fff",
          },
          // 地图区域的多边形 图形样式
          itemStyle: {
            // 地图区域的颜色 如果设置了visualMap, 这个属性将不起作用
            areaColor: "#001C41",
            // 描边线宽 为 0 时无描边
            borderWidth: 1,
            // 图形的描边颜色 支持的颜色格式同 color
            borderColor: "#124285",
            // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
            borderType: "solid"
          },
          // 高亮状态
          emphasis: {
            // 文本标签
            label: {
              // 是否显示标签
              show: true,
              // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
              color: "#fff",
            },
            // 图形样式
            itemStyle: {
              // 地图区域的颜色
              areaColor: "#0D4990"
            }
          },
          // 地图系列中的数据内容数组，数组项可以为单个数值
          markPoint: {
            symbol: "image://" + require("@/assets/images/new/tunnel-normal.png"),
            //数据全是markPoint
            symbolSize: 20, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
            effect: {
              show: true,
              shadowBlur: 0
            },
            label: {
              show: true,
              position: ['-50%', -30],
              backgroundColor: '#fff',
              padding: 5,
              borderRadius: 5,
            },
            data: [
              {
                name: this.tunnelDetail.id,
                coord: [this.tunnelDetail.leftStartLongitude, this.tunnelDetail.leftStartLatitude],
                value: this.tunnelDetail.tunnelName
              }
            ]
          }
        }
        ]
      }
      this.myChartMaps.setOption(options);
      this.myChartMaps.hideLoading();
    },
  }

};
</script>
<style lang='less' scoped>

.tunnel-index {
  display: flex;
  padding: 5px 20px 20px;

  &_left {

    width: 472px;
    padding: 15px;
  }


  &_right {
    flex: 1;
    margin-left: 20px;

  }
}


/* left start */
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
      background: url("~@/assets/images/warning/icons/brightness.png") no-repeat;
      background-size: 100% 100%;
    }

    &.co {
      background: url("~@/assets/images/warning/icons/co.png") no-repeat;
      background-size: 100% 100%;
    }

    &.vi {
      background: url("~@/assets/images/warning/icons/vi.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}

/* left end */


/* right start */
.tunnel-row {
  display: flex;
  align-items: center;

}

.tunnel {
  height: auto;
  margin-left: 20px;

  &-header {
    position: relative;
    height: 112px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #C1D9FF;
    font-size: 16px;

    &-img {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }

    &-title {
      height: 30px;
      display: flex;
      align-items: center;
      font-size: 20px;
      font-family: PingFang-SC-Heavy, PingFang-SC;
      font-weight: bold;
      color: #C1D9FF;
    }

    &-top {
      padding-top: 10px;
      color: #C1D9FF;
    }
  }

  &-tips {
    color: #5391F3;
  }

  &-value {
    color: #C1D9FF;
    padding-right: 20px;
  }

}

.tunnel-info {
  //margin-top: 30px;
  // width: 100%;
  // height: 440px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  // display: flex;
  &-remark {
    //padding: 16px 22px;
    margin-top: 20px;
    font-size: 16px;
    line-height: 25px;
  }

  &-item {
    flex: 1;
    flex-shrink: 0;
    height: 360px;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tunnel-border {
      height: 60px;
      border-bottom: 1px solid #224C97;
      border-right: 1px solid #224C97;
    }

    &-tips {
      width: 124px;
      flex-shrink: 0;
      height: 60px;
      line-height: 60px;
      color: #5391F3;
      text-align: center;
      border-right: 1px solid #224C97;
    }

    &-value {
      flex: 1;
      height: 60px;
      line-height: 60px;
      padding-left: 10px;
      color: #C1D9FF;
      font-size: 16px;
      background: rgba(18, 58, 132, .7);
    }
  }
}

.tunnel-bottom {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.tunnel-count-chart {
  flex: 6.5;
  margin-right: 20px;
}

.tunnel-count-cate {
  flex: 3.5;
}

/* right start */
</style>

