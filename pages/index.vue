<template>
  <div class="home-content">
    <!--    <button style="position: absolute;    top: 50px;-->
    <!--    padding: 10px;-->
    <!--    font-size: 20px;-->
    <!--    left: 472px;z-index: 9999" @click="sideStatus">-->
    <!--      测试收起/展开-->
    <!--      {{isResize}}-->
    <!--    </button>-->

    <!-- 左边内容 -->
    <div class="left-content column" :class="[isHideLeft ? 'hide' : 'show']">
      <home-list-new :TunnelList="TunnelList"
                     :code="code"
                     :provinceCode="currentProvince"/>
      <pie-chart-new/>


    </div>

    <!-- 地图 -->
<!--    <maps-new class="mapsr"-->
<!--              :TunnelList="TunnelList"-->
<!--              :cityCode="code"-->
<!--              @mapChange="mapChange"></maps-new>-->
    <maps-new :TunnelList="TunnelList"
              :cityCode="code"
              :is-resize.sync="isResize"
              :class="[isResize ? 'w-100' : 'map-width']"
              @mapChange="mapChange"/>

    <!-- 右边内容 -->
    <div class="right-content column" :class="[isHideRight ? 'hide' : 'show']">
      <!-- 隧道事件信息 -->
      <tunnel-even-info class="right-content-event-info" :showMaxNum="9"/>
      <!-- 洞内外亮度对比 -->
      <energy-line :code="code"/>
    </div>

    <!-- <img class="watermark" :src="require('@/assets/images/home-watermark.png')"> -->
  </div>
</template>
<script>

import TunnelEvenInfo from '@/components/home/tunnel-event-info.vue';
import MapsNew from '@/components/home/maps';
import homeListNew from '@/components/home/home-list';
import pieChartNew from '@/components/home/pie-chart-new';
import energyLine from '@/components/home/energy-line';

export default {
  events: {
    'onPushEvent': 'queryAllRoadData'
  },
  services: ['home'],
  name: 'Home',
  data() {
    return {
      TunnelList: [],
      currentProvince: '',
      code: '',
      drawer: true,
      isHideLeft: true,
      isHideRight: true,
      // homeSideStatus: '0',
      isResize: true,
    };
  },
  components: {
    homeListNew,
    pieChartNew,
    energyLine,
    MapsNew,
    TunnelEvenInfo
  },

  async mounted() {
    this.getHomeShowSide()
    await this.queryAllRoadData();
    this.code = this.$store.state && this.$store.state.myUserInfo && this.$store.state.myUserInfo.cityCode || '';
  },

  methods: {
    sideStatus() {
      this.leftStatus()
      this.rightStatus()
    },

    leftStatus() {
      const left = this.$el.querySelector('.left-content')

      this.isHideLeft = !this.isHideLeft

      if (this.isHideLeft) {
        setTimeout(() => {
          left.style.display = 'none'
        }, 700)
      } else {
        setTimeout(() => {
          left.style.display = 'block'
        }, 700)

      }

    },

    rightStatus() {
      const right = this.$el.querySelector('.right-content')

      this.isHideRight = !this.isHideRight

      if (this.isHideRight) {
        setTimeout(() => {
          right.style.display = 'none'
        }, 700)
      } else {
        setTimeout(() => {
          right.style.display = 'block'
        }, 700)

      }

      setTimeout(() => {
        this.isResize = !this.isResize
      }, 500)
    },

    mapChange(e, currentProvince) {
      this.code = e;
      this.currentProvince = currentProvince;
    },

    async queryAllRoadData() {
      this.TunnelList = await this.$service.home.getListAll({
        page: 1, pageSize: 100
      });
    },

    // 获取左右侧边栏默认显示状态
    getHomeShowSide() {
      this.$service.home.getTunnelShowSide().then(res => {
        const homeSideInfo = res.find(item => item.name === 'ShowFirstPageLR')
        // value === '1' 显示左右侧边栏
        if (homeSideInfo) {

          if (homeSideInfo.value === '0') {
            const right = this.$el.querySelector('.right-content')
            right.style.display = 'none'

            const left = this.$el.querySelector('.left-content')
            left.style.display = 'none'
            this.isHideLeft = true
            this.isHideRight = true
            this.isResize = true
          }

          if (homeSideInfo.value === '1') {
            this.sideStatus()
          }

        }
      })
    },



  }
};
</script>
<style lang='less' scoped>
@keyframes hideLeft {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-462px);
  }
}

@keyframes showLeft {
  from {
    transform: translateX(-462px);
  }

  to {
    transform: translateX(0);
  }
}


@keyframes hideRight {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(462px);
  }
}

@keyframes showRight {
  from {
    transform: translateX(462px);
  }

  to {
    transform: translateX(0);
  }
}


.home-content {
  position: relative;
  height: calc(100vh - 142px);
  display: flex;

  .watermark {
    width: 287px;
    position: fixed;
    bottom: 21px;
    left: 50%;
    transform: translateX(-50%);
  }

  .left-content {
    width: 442px;
    height: 100%;
    margin-left: 20px;
    display: none;

    &.show {
      animation: showLeft .7s ease-in-out;
      display: block;
    }

    &.hide {
      animation: hideLeft .7s ease-in-out;
      //display: none;
    }
  }

  .mapsr {
    //position: absolute;
    //left: 482px;
    //right: 482px;
    height: 100%;
  }

  .right-content {
    width: 442px;
    height: 100%;
    margin-right: 20px;
    display: none;

    &-event-info {
      padding: 20px;
    }


    &.show {
      animation: showRight .7s ease-in-out;
      display: block;
    }

    &.hide {
      animation: hideRight .7s ease-in-out;
      //display: none;
    }
  }

  .pie-charts {
    padding: 0 10px;
  }
}

.map-width {
  width: calc(100vw - 462px - 462px);
}

.w-100 {
  width: 100%;
}
</style>

