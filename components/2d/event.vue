<template>
  <div class="block right" style="height: 100%">
    <!-- 隧道事件信息 -->
    <!--      <tunnel-event-info @loaded="onLoadTunnelData" _2d></tunnel-event-info>-->
    <tunnel-event-info @loaded="onLoadTunnelData" :tunnel-id="tunnelId" _2d/>

    <tips-title title="隧道关键参数" style="margin-top: 30px;"></tips-title>
    <div class="stats">
      <div class="stat-wrap">
        <div class="label">亮度(cd/m2)</div>
        <div class="stat brightness">
          <template v-if="tunnelInfoData.singleDoubleType === 3">
            <div class="num">左洞：{{ tunnelInfoData.brightNessLeft || 0 }}</div>
            <div class="num">右洞：{{ tunnelInfoData.brightNessRight || 0 }}</div>
          </template>
          <div class="num" v-else>
            {{ tunnelInfoData.brightNessLeft || tunnelInfoData.brightNessRight || 0 }}
          </div>
        </div>
      </div>
      <div class="stat-wrap">
        <div class="label">CO/VI(ppm/m)</div>
        <div class="stat co">
          <template v-if="tunnelInfoData.singleDoubleType === 3">
            <div class="num">左洞：{{ tunnelInfoData.viLeft || 0 }}</div>
            <div class="num">右洞：{{ tunnelInfoData.viRight || 0 }}</div>
          </template>
          <div class="num" v-else>
            {{ tunnelInfoData.viLeft || tunnelInfoData.viRight || 0 }}
          </div>
        </div>
      </div>
      <div class="stat-wrap">
        <!--狮子笼专用-->
        <div class="label">风速(m/s)</div>
        <div class="stat vi">
          <template v-if="tunnelInfoData.singleDoubleType === 3">
            <div class="num">
              左洞：{{
                tunnelInfoData.windSpeedLeft || tunnelInfoData.windDirectionLeft || 0
              }}
            </div>
            <div class="num">
              右洞：{{
                tunnelInfoData.windSpeedRight ||
                tunnelInfoData.windDirectionRight ||
                0
              }}
            </div>
          </template>
          <div class="num" v-else>
            {{ tunnelInfoData.windSpeedLeft || tunnelInfoData.windSpeedRight || 0 }}
          </div>
        </div>
      </div>

      <!--
      <div class="stat-wrap">
        <div class="label">风速(m/s)</div>
        <div class="stat vi">
          <template v-if="tunnelInfoData.singleDoubleType===3">
            <div class="num">左洞：{{ tunnelInfoData.windSpeedLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelInfoData.windSpeedRight || 0 }}</div>
            </template>
            <div class="num" v-else>{{ tunnelInfoData.windSpeedLeft || tunnelInfoData.windSpeedRight || 0 }}</div>
          </div>
        </div>

        <div class="stat-wrap">
          <div class="label">风向</div>
          <div class="stat brightness direction">
            <template v-if="tunnelInfoData.singleDoubleType===3">
              <div class="num">左洞：{{ tunnelInfoData.windDirectionLeft || 0 }}</div>
              <div class="num">右洞：{{ tunnelInfoData.windDirectionRight || 0 }}</div>
            </template>
            <div class="num" v-else>{{ tunnelInfoData.windDirectionLeft || tunnelInfoData.windDirectionRight || 0 }}</div>
          </div>
        </div>
        !-->
    </div>
  </div>
</template>

<script>
import TipsTitle from '@/components/index/tips-title'
import TunnelEventInfo from '@/components/home/tunnel-event-info'

export default {
  name: "event",
  components: {
    TipsTitle,
    TunnelEventInfo
  },
  props: {
    tunnelId: {
      type: String,
      default: ''
    }
    // tunnelInfoData: {
    //   type: Object,
    //   default: () => {}
    // }
  },
  data() {
    return {
      tunnelInfoData: {}
    }
  },
  methods: {

    onLoadTunnelData(e) {
      this.tunnelInfoData = e
      // console.log(e)
    },
  }
}
</script>

<style lang="less" scoped>
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
      color: #c1d9ff;
      line-height: 20px;
      text-align: center;
    }

    &.brightness {
      background: url('../../assets/images/warning/icons/brightness.png') no-repeat;
      background-size: 100% 100%;
    }

    &.co {
      background: url('../../assets/images/warning/icons/co.png') no-repeat;
      background-size: 100% 100%;
    }

    &.vi {
      background: url('../../assets/images/warning/icons/vi.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
