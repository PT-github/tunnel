<template>
  <div class="maps-content" ref="MapsContent">

    <AddressInfo v-model="currentSelect"
                 :placeholder="placeholderText"
                 @areaLoad="getCurrentPro"
                 class="maps-select"/>
    <!-- <Select v-model="currentSelect" class="maps-select" @on-change="selectChage">
        <Option v-for="(i,index) in selectOptions" :value="i.value" :key="index">{{ i.name }}</Option>
    </Select> -->
    <div class="maps-tips">
      <div class="maps-tips-item">
        <div class="maps-tips-item-img" style="border-color:#ED9E22"><img
            :src="require('@/assets/images/new/tunnel-error.png')"></div>
        <div class="maps-tips-item-name">报警隧道</div>
      </div>
      <div class="maps-tips-item">
        <div class="maps-tips-item-img"><img :src="require('@/assets/images/new/tunnel-normal.png')"></div>
        <div class="maps-tips-item-name">正常隧道</div>
      </div>
    </div>

    <!-- 地图 -->
    <div class="mychart" ref="mychart" id="mychart"></div>

    <div class="mask-poup" @click="isshow=false" v-if='isshow'>
      <div class="modal-poup" @click.stop="">
        <tipsTitle :title="tunnelName"></tipsTitle>
        <div class="modal-poup-content">
          <div class="modal-poup-content-item">
            <div class="modal-poup-content-item-title">温度</div>
            <template v-if="countData.singleDoubleType===3">
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">左</span>
                <span
                    :class="[!countData.temperatureLeft&&'empty-title']">{{
                    countData.temperatureLeft || '暂无数据'
                  }}</span>
              </div>
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">右</span>
                <span
                    :class="[!countData.temperatureRight&&'empty-title']">{{
                    countData.temperatureRight || '暂无数据'
                  }}</span>
              </div>
            </template>
            <template v-else>
              <div class="modal-poup-content-item-row">
                <span
                    :class="[!countData.temperatureLeft&&'empty-title']">{{
                    countData.temperatureLeft || countData.temperatureRight || '暂无数据'
                  }}</span>
              </div>
            </template>
          </div>
          <div class="modal-poup-content-item">
            <div class="modal-poup-content-item-title">湿度</div>
            <template v-if="countData.singleDoubleType===3">
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">左</span>
                <span :class="[!countData.humidityLeft&&'empty-title']">{{ countData.humidityLeft || '暂无数据' }}</span>
              </div>
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">右</span>
                <span :class="[!countData.humidityRight&&'empty-title']">{{ countData.humidityRight || '暂无数据' }}</span>
              </div>
            </template>
            <template v-else>
              <div class="modal-poup-content-item-row">
                <span
                    :class="[!countData.humidityLeft&&'empty-title']">{{
                    countData.humidityLeft || countData.humidityRight || '暂无数据'
                  }}</span>
              </div>
            </template>
          </div>
          <div class="modal-poup-content-item">
            <div class="modal-poup-content-item-title">照明</div>
            <template v-if="countData.singleDoubleType===3">
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">左</span>
                <span
                    :class="[!countData.brightNessLeft&&'empty-title']">{{ countData.brightNessLeft || '暂无数据' }}</span>
              </div>
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">右</span>
                <span
                    :class="[!countData.brightNessRight&&'empty-title']">{{
                    countData.brightNessRight || '暂无数据'
                  }}</span>
              </div>
            </template>
            <template v-else>
              <div class="modal-poup-content-item-row">
                <span
                    :class="[!countData.brightNessLeft&&'empty-title']">{{
                    countData.brightNessLeft || countData.brightNessRight || '暂无数据'
                  }}</span>
              </div>
            </template>
          </div>
          <div class="modal-poup-content-item">
            <div class="modal-poup-content-item-title">CO/VI</div>
            <template v-if="countData.singleDoubleType===3">
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">左</span>
                <span>{{ countData.coLeft || '-' }}/{{ countData.viLeft || '-' }}</span>
              </div>
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">右</span>
                <span>{{ countData.coRight || '-' }}/{{ countData.viRight || '-' }}</span>
              </div>
            </template>
            <template v-else>
              <div class="modal-poup-content-item-row">
                <span>{{ countData.coLeft || countData.coRight || '-' }}/{{
                    countData.viLeft || countData.viRight || '-'
                  }}</span>
              </div>
            </template>
          </div>
          <div class="modal-poup-content-item">
            <div class="modal-poup-content-item-title">能耗</div>
            <template v-if="countData.singleDoubleType===3">
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">左</span>
                <span
                    :class="[!countData.energyConsumLeft&&'empty-title']">{{
                    countData.energyConsumLeft || '暂无数据'
                  }}</span>
              </div>
              <div class="modal-poup-content-item-row">
                <span class="modal-flag">右</span>
                <span
                    :class="[!countData.energyConsumRight&&'empty-title']">{{
                    countData.energyConsumRight || '暂无数据'
                  }}</span>
              </div>
            </template>
            <template v-else>
              <div class="modal-poup-content-item-row">
                <span
                    :class="[!countData.energyConsumLeft&&'empty-title']">{{
                    countData.energyConsumLeft || countData.energyConsumRight || '暂无数据'
                  }}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="modal-poup-footer">
          <div class="modal-cancel" @click.stop="isshow=false">取消</div>
          <div class="modal-more" @click="goDetail(tunnelId)">查看详情</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import echarts from 'echarts';
import 'echarts/map/js/province/hunan.js';
import tipsTitle from '~/components/index/tips-title';
import AddressInfo from '@/components/basic/address-info';
import mapObj from '@/assets/cityMaps/config.js'

const DataTrans = (data = []) => {
  let _temp = [];
  if (data.length < 0 || !data) {
    return [];
  }
  data.map((val, key) => {
    _temp.push({
      symbol: 'image://' + require(`@/assets/images/new/tunnel-${val.warnStatus == 0 ? 'normal' : 'error'}.png`),
      //数据全是markPoint
      symbolSize: 20, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
      name: val.id,
      coord: [val.longitude, val.latitude],
      value: val.tunnelName
    });
  });
  return _temp;
};

export default {
  components: {AddressInfo, tipsTitle},
  services: ['home'],
  props: {
    TunnelList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    cityCode: {
      type: [String, Number],
      default: () => {
        return '';
      }
    },
    isResize: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isshow: false,
      currentSelect: '',
      tunnelName: '',
      options: { // 图表主标题
        title: {
          // 文本
          show: true,
          // 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          top: 25,
          // 值: 'left', 'center', 'right' 同上
          left: 'center',
          // 文本样式
          textStyle: {
            // 字体大小
            fontSize: 18,
            // 字体粗细
            fontWeight: 650,
            // 字体颜色
            color: '#fff'
          }
        },
        // 提示框组件
        // tooltip: {
        //     show: true,
        //     formatter: function(e) {
        //         console.log(isshow)
        //         isshow = true;
        //     },
        //     triggerOn: 'click'
        // },
        series: [{
          // 类型
          type: 'map',
          // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
          // map: "湖南",
          // 地图类型
          mapType: 'hunan',
          // 是否开启鼠标缩放和平移漫游 默认不开启
          // 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
          roam: 'scale',
          // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          // top: '5%',
          // right: "auto",
          // bottom: "5%",
          // left: "auto",
          // layoutCenter: ['50%', '50%'],
          // // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
          // layoutSize: 1000,
          zoom: 1,
          silent: false,
          selectedMode: 'single',
          // 图形上的文本标签
          label: {
            show: true, // 是否显示对应地名
            color: '#fff'
          },
          // 地图区域的多边形 图形样式
          itemStyle: {
            // 地图区域的颜色 如果设置了visualMap, 这个属性将不起作用
            areaColor: '#001C41',
            // 描边线宽 为 0 时无描边
            borderWidth: 1,
            // 图形的描边颜色 支持的颜色格式同 color
            borderColor: '#124285',
            // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
            borderType: 'solid'
          },
          // 高亮状态
          emphasis: {
            // 文本标签
            label: {
              // 是否显示标签
              show: true,
              // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
              color: '#fff'

            },
            // 图形样式
            itemStyle: {
              // 地图区域的颜色
              areaColor: '#0D4990'
            }
          },
          // 地图系列中的数据内容数组，数组项可以为单个数值
          data: [],
          markPoint: {
            effect: {
              show: true,
              shadowBlur: 0
            },
            label: {
              show: true,
              position: ['-50%', -30],
              backgroundColor: '#fff',
              padding: 5,
              borderRadius: 5
            },
            data: []
          }
        }
        ]
      },
      currentProvince: "",
      placeholderText: "湖南",
      tunnelId: '',
      countData: {},
      myChartMaps: null
    };
  },

  watch: {
    currentSelect: {
      handler(e) {
        this.selectChage(e);
      },
      deep: true
    },
    cityCode: {
      handler(e) {
        this.selectChage(e);
      }
    },
    TunnelList: {
      handler(list) {
        this.options.series[0].data = list;
        this.options.series[0].markPoint.data = DataTrans(list);
        this.chartInit();
      },
      deep: true
    },
    isResize: {
      deep: true,
      handler(newVal) {
        if (this.myChartMaps) {
          setTimeout(() => {
            this.myChartMaps.resize();
          }, 200)
        }
      }
    }
  },
  async mounted() {

  },
  methods: {
    getCurrentPro(code) {
      mapObj.provinceMap[code] && (this.placeholderText = mapObj.provinceMap[code]);
      this.currentProvince = code
    },
    selectChage(e) {
      this.currentSelect = mapObj.provinceArr.includes(e) ? '' : e;
      this.myChartMaps.off('mapselectchanged', this.onCityClick);
      this.myChartMaps.off('click');
      this.drawCity(e);
    },
    goDetail(id) {
      this.$router.push({
        path: '/tunnel/detail?tunnelId=' + id
      });
    },
    chartInit() {
      this.myChartMaps = echarts.init(this.$refs.mychart);

      window.addEventListener('resize', () => {
        this.myChartMaps.resize();
      })

      this.selectChage();
    },
    onCityClick(e) {
      let name = e.batch[0].name;
      this.drawCity(mapObj.cityMaps[name]);
    },
    //  画图加载
    drawCity(cityCode = '') {
      let isProvince = mapObj.provinceArr.includes(cityCode);
      this.$emit('mapChange', cityCode, this.currentProvince);
      // 清除下地图
      // this.myChartMaps.clear()
      this.options.series[0].markPoint.data = DataTrans(this.cleanPonit(cityCode));
      this.myChartMaps.showLoading();

      let res = require(`@/assets/cityMaps/${cityCode || this.currentProvince}.json`);
      this.currentSelect = isProvince ? '' : cityCode;
      echarts.registerMap(cityCode, res);

      this.options.series[0].mapType = cityCode;

      // 'scale' 或者 'move' 设置成 true 为都开启
      if (!cityCode || isProvince) {
        this.options.series[0].roam = 'scale';
      } else {
        this.options.series[0].roam = true;
      }

      this.myChartMaps.setOption(this.options, true);

      //  迁移老逻辑我也不知道为什么
      if (isProvince || cityCode == '') {
        this.myChartMaps.on('mapselectchanged', this.onCityClick);
      } else {
        this.myChartMaps.off('mapselectchanged', this.onCityClick);
      }

      this.myChartMaps.on('click', (row) => {
        if (row.componentType == 'markPoint') {
          this.getTunnelEventStat(row.data);
        }
      });

      this.myChartMaps.hideLoading();
    },
    cleanPonit(code) {
      let list = [];
      this.TunnelList.forEach(item => {
        if (mapObj.provinceArr.includes(code) || code == '') {
          list.push(item);
        } else if (item.cityId == code) {
          list.push(item);
        }
      });
      return list;
    },
    async getTunnelEventStat(row) {
      this.tunnelName = row.value;
      this.tunnelId = row.name;
      this.countData = await this.$service.home.getTunnelEventStat(row.name) || {};
      this.isshow = true;
      // console.log(this.countData);
    }
  }
};
</script>
<style lang='less' scoped>
.mask-detail-btn {
  position: absolute;
  cursor: pointer;
  bottom: 22px;
  left: 160px;
  z-index: 100;
  width: 100px;
  height: 25px;
  line-height: 25px;
  border-radius: 25px;
  text-align: center;
  border: 1px solid #ffffff;
  color: #fff;
}

.mask-poup {
  position: fixed;
  display: flex;
  justify-content: center;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, .4);
}

.modal-poup {
  margin: auto;
  width: 650px;
  background: rgba(20, 46, 105, 0.9);
  border-radius: 20px;
  padding: 20px 30px;
  position: relative;
  padding-bottom: 100px;

  &-content {
    padding: 0 10px;
    display: flex;
    flex-wrap: wrap;

    &-item {
      margin-top: 45px;
      margin-right: 44px;
      width: calc((100% - 88px) / 3);
      height: 133px;
      background: rgba(18, 58, 132, 1);
      border-radius: 4px;
      font-size: 20px;
      font-family: PingFang-SC-Bold, PingFang-SC;
      // font-weight:bold;
      color: rgba(193, 217, 255, 1);
      padding-left: 24px;
      padding-top: 15px;
      display: flex;
      flex-direction: column;

      &-title {
        font-size: 16px;
      }

      .empty-title {
        font-size: 15px;
      }

      &-row {
        padding-top: 14px;
      }

      .modal-flag {
        font-size: 20px;
        padding-right: 16px;
      }
    }

    &-item:nth-child(3n) {
      margin-right: 0px;
    }
  }

  &-footer {
    position: absolute;
    bottom: 30px;
    right: 40px;
    display: flex;
    font-size: 16px;
    color: #C1D9FF;

    .modal-cancel {
      cursor: pointer;
      width: 80px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      border-radius: 4px;
      margin-right: 38px;
      border: 1px solid rgba(18, 58, 132, 1);
    }

    .modal-more {
      cursor: pointer;
      width: 80px;
      height: 32px;
      text-align: center;
      line-height: 32px;
      background: rgba(51, 124, 243, 1);
      border-radius: 4px;
    }
  }
}

.maps-content {
  position: relative;

  //flex: 1;

  .mychart {
    width: 100%;
    height: 100%;
  }

  .maps-tips {
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 10;
    display: inline-block;

    &-item {
      display: flex;
      align-items: center;;
      width: 144px;
      height: 27px;
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(44, 115, 229, 1);

      &-img {
        width: 27px;
        height: 27px;
        background: rgba(17, 33, 108, 1);
        border: 1px solid rgba(20, 118, 209, 1);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;

        img {
          width: 12px;
          height: 13px;
        }
      }
    }

  }

  .maps-select {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 10;
    color: #2C73E5;
    width: 100px;

  }

  /deep/ .ivu-select-selection {
    background: rgba(0, 0, 0, .1);
    border: 1px solid #1893FE;;
  }

  /deep/ .ivu-select-arrow {
    color: 1893 FE !important;
  }

  /deep/ .ivu-select-dropdown {
    background: rgba(0, 0, 0, .1);
    border: 1px solid #1893FE;

    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px;
      height: 100%;
    }

    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      background: rgba(24, 116, 174, 1);
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 10px;
      background: rgba(5, 47, 101, 1);
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }

  /deep/ .ivu-select-item-selected {
    background: rgba(0, 0, 0, .1);
    color: #1893FE !important;
  }

  /deep/ .ivu-select-item {
    color: #fff;
  }

  /deep/ .ivu-select-item:hover {
    background: rgba(24, 147, 254, .5)
  }

  /deep/ .select-item-focus {
    background: rgba(0, 0, 0, .1);
    color: #1893FE !important;
  }

}
</style>
