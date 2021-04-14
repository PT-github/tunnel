<template>
  <el-card class="el-card">
    <div class="item-ctn">
      <div class="item-ctn-t flex-class">
        <div class="t-l">
          <img
            :src="`/static/alarm/type${data.typeCode || 'all'}.png`"
            alt=""
          />
          <span style="margin-left: 5px">{{ data.eventTypeName }}</span>
        </div>
        <div class="t-r">
          <span class="alarm-time">{{ data.createdUserDate }}</span>
          事件状态：<span
            :class="{ red: data.eventState == 0, green: data.eventState == 1 }"
            >{{ data.eventStateName }}</span
          >
        </div>
      </div>

      <div class="item-ctn-c">
        <div class="c-l">
          {{ data.eventContent }}
        </div>
        <div class="c-r">
          <!--事件图片-->
          <div
            class="img-item"
            v-if="data.eventPicture"
            @click="
              (title = data.eventTitle),
                (showMediaPopup = true),
                (showMedias = [
                  {
                    type: 'image',
                    src: data.eventPicture.includes('http')
                      ? data.eventPicture
                      : $ctx.$config.baseImgUrl + data.eventPicture,
                  },
                ])
            "
          >
            <img
              :src="
                data.eventPicture.includes('http')
                  ? data.eventPicture
                  : $ctx.$config.baseImgUrl + data.eventPicture
              "
              alt=""
            />
          </div>

          <!--相关视频 data.eventVideo-->
          <div
            class="img-item"
            v-if="data.eventVideo"
            @click.stop="
              (title = data.eventTitle),
                (showMediaPopup = true),
                (showMedias = [
                  {
                    type: 'srcVideo',
                    src: data.eventVideo,
                    img: data.eventPicture ? data.eventPicture : '',
                  },
                ])
            "
          >
            <img
              :src="
                data.eventPicture.includes('http')
                  ? data.eventPicture
                  : $ctx.$config.baseImgUrl + data.eventPicture
              "
              alt=""
            />
            <img src="../../assets/images/new/btn-play.png" class="btn-play" />
          </div>
        </div>
      </div>

      <div class="item-ctn-b flex-class">
        <div class="b-l">
          <span class="s1-item"
            >所属隧道：{{ data.tunnelName }}（{{
              data.leftRightFlagName
            }}）</span
          >
          <span class="s1-item">事件来源：{{ data.eventSourceName }}</span>
          <span class="s1-item">事件等级：{{ data.eventGrade }}</span>
        </div>
        <div class="b-r">
          <div
            class="b-r-btn"
            @click="
              $router.push({ path: '/alarm/detail', query: { id: data.id } })
            "
          >
            <img src="../../assets/images/alarm/right-icon.png" alt="" />
            查看详情
          </div>
          <div
            class="b-r-btn"
            v-auth="'/rest/TEventrecord/dispose'"
            @click="clickBtn(data.eventState)"
            v-if="data.eventState == 0 || data.eventState == 1"
          >
            <img src="../../assets/images/alarm/success.png" alt="" />
            {{ data.eventState === 1 ? "事件归档" : "事件处理" }}
          </div>
          <div
            class="b-r-btn"
            @click="refreshClickBtn"
            v-if="data.eventState == 1"
          >
            <i class="el-icon el-icon-refresh"></i>
            一键还原
          </div>
        </div>
      </div>
    </div>

    <popup-media
      v-model="showMediaPopup"
      :medias="showMedias"
      :title="title"
      :img-width="imgwidth"
    ></popup-media>
  </el-card>
</template>

<script>
import HVideo from "../../components/h-video";
import PopupMedia from "../../components/2d/popup-media";

export default {
  services: ["alarm", "_2d"],
  // services: ['tunnel', '_2d'],
  name: "alarm-item",
  props: {
    data: Object,
  },
  components: {
    HVideo,
    PopupMedia,
  },
  data() {
    return {
      imgwidth: Math.max(parseInt(window.innerWidth * 0.6), 700),
      showMediaPopup: false,
      title: "",
      showMedias: [],
    };
  },
  methods: {
    clickBtn(type) {
      console.log(type);
      // return

      if (type == 0) {
        this.$service.alarm.queryAlarmDetail(this.data.id).then((res) => {
          this.$emit("openDetail", res);
        });
        return;
      }
      this.$router.push({
        path: "/alarm/detail",
        query: { id: this.data.id, type: "edit" },
      });
    },
    refreshClickBtn() {
      //风机
      this.draughtfan();
      //车道指示器
      this.laneIndicator();
      //广播
      this.closeDeviceCriticalBroadcast();
    },
    draughtfan() {
      let p = {
        deviceIds:
          "1864e51a-d8ac-4457-b28a-a6ea8919c1a8,9b12a1b0-2b34-4853-9c1e-fb957d4666d0",
        classifyNumber: "draughtfan",
        workMode: 0,
      };
      this.$service._2d.operatePlcDevice(p).then((r) => {
        if (r && r.status && r.status === "-1") {
          this.$message(r.message);
        }
      });
    },
    laneIndicator() {
      let p = {
        deviceIds:
          "24f15f57-dd7d-40c9-b494-f97c0b83c44d,e100545d-51c7-4c03-a6d5-57994ed8397a",
        classifyNumber: "laneIndicator",
        workMode: 1,
      };
      this.$service._2d.operatePlcDevice(p).then((r) => {
        if (r && r.status && r.status === "-1") {
            this.$message(r.message);
        }
      });
    },
    closeDeviceCriticalBroadcast() {
      this.$service._2d
        .stopBroadcast({
          deviceId: "2f8b0218-23fa-472d-9589-4d1d5f2603f1",
          tunnelId: "5e38e394-b4d0-48c4-9042-43712e0d8b3d",
        })
        .then((r) => {
          //this.$message(r.message);
        });
    },
  },
};
</script>

<style scoped lang="less">
.flex-class {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/deep/ .el-card__body {
  padding: 15px 0px 0px 0px;
}

.el-card {
  background: rgba(18, 58, 132, 1);
  border-radius: 4px;
  border: none;

  .item-ctn {
    width: 100%;
    padding-bottom: 15px;

    .item-ctn-t {
      height: 22px;
      margin-left: 10px;
      margin-right: 30px;
      width: calc(100% - 40px);

      .t-l,
      .t-r {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c1d9ff;

        img {
          height: 20px;
          width: 20px;
        }

        .alarm-time {
          margin-right: 30px;
        }

        .red {
          color: #fdb913;
        }

        .green {
          color: #51d53e;
        }
      }
    }

    .item-ctn-c {
      margin-top: 16px;
      display: flex;
      align-items: center;

      .c-l {
        text-align: left;
        width: 1000px;
        margin-left: 34px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #c1d9ff;
      }

      .c-r {
        display: flex;
        margin-left: 117px;

        .img-item:first-child {
          margin-left: 0px;
        }

        .img-item {
          height: 70px;
          width: 70px;
          margin-left: 25px;
          position: relative;

          .btn-play {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            transform: translate(-50%, -50%);
          }

          img {
            height: 100%;
            width: 100%;
            border-radius: 4px;
          }

          .item-video {
            height: 100%;
            width: 100%;
            border-radius: 4px;
          }
        }
      }
    }

    .item-ctn-b {
      /*margin-top: 45px;*/
      margin-left: 35px;
      margin-right: 30px;
      width: calc(100% - 65px);

      .b-l,
      .b-r {
        display: flex;

        .s1-item:first-child {
          margin-left: 0px;
        }

        .s1-item {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #5391f3;
          margin-left: 50px;
        }

        .b-r-btn:last-child {
          margin-right: 0px;
        }

        .b-r-btn {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 7px 10px;
          background: rgba(51, 124, 243, 1);
          border-radius: 4px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #c1d9ff;
          margin-right: 40px;

          img {
            height: 16px;
            width: 16px;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
