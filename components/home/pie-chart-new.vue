<!-- 迁移老的，就改改样式 -->
<template>
  <div class="pie-content block">
    <tips-title title="设备统计信息"/>

    <div id="pieId"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
import tipsTitle from '~/components/index/tips-title';

export default {
  services: ['home'],
  name: 'PieChart',
  components: {tipsTitle},
  data() {
    return {
      AlldeviceBase: {
        deviceNum: [],
        devices: []
      },
      PieDate: [
        {
          value: '',
          name: ''
        }
      ]
    };
  },
  beforeDestroy() {

  },
  mounted() {
    this.getAlldeviceBase();
  },
  methods: {
    async getAlldeviceBase() {
      let list = await this.$service.home.geDeviceCount() || [];
      let PieDate = [];
      let AlldeviceBase = {
        deviceNum: [],
        devices: []
      };
      list.forEach(item => {
        PieDate.push({
          value: item.deviceCount || 0,
          name: item.typeName
        });
        AlldeviceBase.deviceNum.push(item.deviceCount || 0);
        AlldeviceBase.devices.push(item.typeName || '');
      });
      this.PieDate = PieDate;
      this.AlldeviceBase = AlldeviceBase;
      this.init();
      // this.getRequest("/system/deviceBase/getAlldeviceBase")
      //   .then(res => {
      //     this.AlldeviceBase.deviceNum = res.data.data.deviceNum;
      //     this.AlldeviceBase.devices = res.data.data.devices;
      //     for (var i = 0; i < this.AlldeviceBase.deviceNum.length; i++) {
      //       this.PieDate.push({
      //         value: this.AlldeviceBase.deviceNum[i],
      //         name: this.AlldeviceBase.devices[i]
      //       });
      //     }
      //     this.init();
      //   })
      //   .catch(error => {});
    },
    init() {
      var _this = this;
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('pieId'));
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}个 ({d}%)'
        },
        legend: {
          x: 'right',
          // top: '76%',
          bottom: -50,
          textStyle: {
            color: '#92CCFA', // 图例文字颜色
            fontSize: 12
          },
          data: _this.AlldeviceBase.devices
        },
        series: {
          name: '半径模式',
          color: [
            '#5830E3',
            '#2D5BE3',
            '#02DDE3',
            '#84DD35',
            '#845B0A',
            '#DBB20A',
            '#CC3333',
            '#DB5B0A'
          ],
          type: 'pie',
          top: -120,
          radius: ['30%', ' 60%'],
          center: ["50%", "40%"],
          roseType: 'radius',
          label: {
            show: false
          },
          emphasis: {
            label: {
              // show: true
            }
          },
          data: _this.PieDate
        }
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },

};
</script>
<style lang='less' scoped>
.pie-content {
  padding: 20px;

}

#pieId {
  height: 302px!important;
  width: 402px!important;
}
</style>
