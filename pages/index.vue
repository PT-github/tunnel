<template>
  <div class="home-content">
<!--    <button style="position: absolute;    top: 50px;-->
<!--    padding: 10px;-->
<!--    font-size: 20px;-->
<!--    left: 472px;z-index: 9999" @click="hideLeft">-->
<!--      测试收起/展开-->
<!--      {{isResize}}-->
<!--    </button>-->

    <!-- 左边内容 -->
    <div class="left-content column" :class="[isHideLeft ? 'hide' : 'show']">
      <home-list-new :TunnelList="TunnelList" :code="code" :provinceCode="currentProvince"></home-list-new>
      <pie-chart-new></pie-chart-new>


    </div>

    <!-- 地图 -->
    <!--        <maps-new class="mapsr" :TunnelList="TunnelList" :cityCode="code" @mapChange="mapChange"></maps-new>-->
    <maps-new :TunnelList="TunnelList"
              :cityCode="code"
              :is-resize.sync="isResize"
              :class="[isResize ? 'w-100' : 'map-width']"
              @mapChange="mapChange"/>

    <!-- 右边内容 -->
    <div class="right-content column" :class="[isHideRight ? 'hide' : 'show']">
      <!-- 隧道事件信息 -->
      <tunnel-even-info class="right-content-event-info" :showMaxNum="9"></tunnel-even-info>
      <!-- 洞内外亮度对比 -->
      <energy-line :code="code"></energy-line>
    </div>

    <img class="watermark" :src="require('@/assets/images/home-watermark.png')">
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
      isHideLeft: false,
      isHideRight: false,

      isResize: false
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
    await this.queryAllRoadData();
    this.code = this.$store.state && this.$store.state.myUserInfo && this.$store.state.myUserInfo.cityCode || '';
  },
  created() {
  },
  methods: {
    hideLeft() {
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
    }
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


    //&.show {
    //  animation: showLeft .7s ease-in-out;
    //  display: block;
    //}

    //&.hide {
    //  animation: hideLeft 0.7s ease-in-out;
    //}
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

    &-event-info {
      padding: 20px;
    }


    &.show {
      //animation: showRight .7s ease-in-out;
      //display: block;
    }

    &.hide {
      //animation: hideRight 0.7s ease-in-out;
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

