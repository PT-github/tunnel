<template>
  <div class="list" :class="[nav?'nav-tunnels':'bg block']">
    <div class="search" v-if="nav">

    </div>
    <tips-title v-else :title="name+'隧道列表'"/>
    <div class="list-box" :class="{nav}">
      <div class="list-box-item"
           v-for="(item,i) in list"
           :key="i">
        <div class="list-box-item-left" @click="gosdhome(item.id)">
          <!-- 1报警、0正常 -->
          <img :src="require(`@/assets/images/new/tunnel-${item.warnStatus==0?'normal':'error'}.png`)">
        </div>
        <div class="list-box-item-right">
          <div class="list-box-item-right-content"
               @click="gosdhome(item.id)">
            <div class="list-box-item-right-content-item">
              <span class="tunnel-name">{{item.tunnelName}}</span>
              <!-- <span class="tunnel-no">{{item.sortInt}}</span> -->
            </div>
            <div class="list-box-item-right-content-item">
              <span v-if="item.leftHoleLength">左洞：{{item.leftHoleLength}}米</span>
              <span v-if="item.rightHoleLength">右洞：{{item.rightHoleLength}}米</span>
            </div>
          </div>
          <div class="list-box-item-right-button"
               @click="gosdinspect(item.id)">巡检
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tipsTitle from '~/components/index/tips-title';
import mapObj from '@/assets/cityMaps/config.js'

export default {
  components: {tipsTitle},
  props: {
    nav: Boolean,
    TunnelList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    provinceCode: {
      type: String,
      default: () => {
        return '430000';  // 湖南
      }
    },
    code: {
      type: String,
      default: () => {
        return '';
      }
    },
    filterName: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  watch: {
    code(val, oldv) {
      this.list = this.cleanPonit();
    },
    TunnelList(val, oldv) {
      if (val) {
        this.list = this.cleanPonit();
      }
    },
    filterName(val) {
      let list = this.cleanPonit()
      let destArr = []
      if (val) {
        list.forEach(item => {
          item.tunnelName.includes(val) && destArr.push(item)
        })
        this.list = destArr
      } else {
        this.list = list;
      }
    }
  },
  data() {
    return {
      list: [],
      name: '',
      selectOptions: mapObj.cityOptionName
    };
  },
  mounted() {
    this.list = [...this.TunnelList];
  },
  methods: {
    cleanPonit() {
      let code = this.code;
      this.name = this.selectOptions[code || this.provinceCode] || '';
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
    gosdhome(tunnelId) {
      this.$router.push(`/tunnel/${tunnelId}`)
      // this.$router.push({
      //     path: '/tunnel',
      //   params: {
      //       id: tunnelId
      //   },
      //     // query: {tunnelId: tunnelId}
      // });
    },
    gosdinspect(tunnelId) {
      this.$router.push({
        path: '/home/inspect',
        query: {tunnelId: tunnelId}
      });
    }
  }
};
</script>
<style lang="less" scoped>
.list {
  &.bg {
    margin-bottom: 20px;
    padding: 20px;
  }

  &.nav-tunnels {
    background: #0a1344;
  }

  &-box {
    margin-top: 10px;
    color: #92ccfa;
    overflow-x: hidden;
    // overflow-y: scroll;
    user-select: none;
    box-sizing: border-box;
    height: 620px;
    padding: 0 20px;
    margin: 0px -20px;

    &.nav {
      margin: 0;
    }

    &-item {
      height: 78px;
      display: flex;
      align-items: center;

      &-left {
        cursor: pointer;
        margin-top: 18px;
        height: 60px;
        width: 60px;
        background: rgba(17, 33, 108, 1);
        border: 1px solid rgba(20, 118, 209, 1);
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &-right {
        flex: 1;
        padding-top: 18px;
        height: 78px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: 18px;
        border-bottom: 1px solid #334BBA;

        &-content {
          &-item {
            font-size: 14px;
            color: #C1D9FF;
            cursor: pointer;

            span + span {
              margin-left: 10px;
            }

            .tunnel-name {
              font-size: 16px;
              font-weight: bold;
              color: rgba(193, 217, 255, 1);
            }

            .tunnel-no {
              margin-left: 5px;
              background: rgba(27, 112, 238, 1);
              border-radius: 4px;
              font-size: 14px;
              padding: 4px 10px;
              font-weight: 400;
              color: rgba(193, 217, 255, 1)
            }
          }
        }

        &-button {
          cursor: pointer;
          width: 45px;
          text-align: center;
          line-height: 25px;
          height: 25px;
          background: rgba(17, 33, 108, 1);
          border: 1px solid rgba(20, 118, 209, 1);
          border-radius: 2px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(193, 217, 255, 1);
        }
      }
    }

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
}
</style>
