<template>
  <div class="event-detail-ctn" v-if="detail">
    <div class="pop-text">
      <div class="text">
        事件名称：<span class="s1">{{detail.eventTitle}} ({{detail.tunnelName}}{{detail.leftRightFlagName}})</span>
      </div>
      <div class="text">
        事件类型：<span class="s1">{{detail.eventTypeName}}</span>
      </div>
      <div class="text">
        事件等级：<span class="s1">{{detail.eventGrade}}</span>
      </div>
      <div class="text">
        发生时间：<span class="s1">{{detail.createdUserDate}}</span>
      </div>
    </div>
    <div class="pop-t">
      <div class="pop-t-l">
        <span class="s1">事件内容：</span>
        <div class="v-text">
          {{detail.eventContent}}
        </div>
      </div>
      <div class="pop-t-r" v-if="list && list.length">
        <span class="s1">选择事件预案</span>
        <h-select :ds="list"
                  auto-select
                  v-model="value"
                  @input="changeType"
                  ref="eventType"
                  placeholder="请选择预案"></h-select>
      </div>
    </div>

    <div class="video-ctn">
      <div class="video-ctn-l">
        <HTab :tab="tab"
              @clickBar="clickBar"
              tabName="name">
          <!-- 图片 -->
          <div class="img-video-ctn" v-if="state == 0">
            <img v-if="detail.eventPicture"
                 :src="detail.eventPicture.includes('http')?detail.eventPicture:$ctx.$config.baseImgUrl+detail.eventPicture"
                 alt="">
          </div>

          <!-- 视频 -->
          <div class="img-video-ctn" v-if="state == 1">
            <h-video width="100%"
                     v-if="detail.eventVideo"
                     :videoSrc="detail.eventVideo"
                     :videoImg="detail.eventPicture?detail.eventPicture:''"
                     height="300"></h-video>
          </div>

          <!-- 处置说明 -->
          <div class="img-video-ctn" v-if="state == 2">
<!--            <el-carousel style="height: 100%">-->
<!--              <el-carousel-item v-for="item in flowImgList" :key="item">-->
                <el-image style="height: 100%" :src="flowImgList[0]"  fit="contain" :preview-src-list="flowImgList"/>
<!--              </el-carousel-item>-->
<!--            </el-carousel>-->
          </div>

        </HTab>
      </div>
      <div class="video-ctn-r">
        <el-table
            ref="multipleTable"
            :data="doneList"
            :height="(360*$px2rem)+'px'"
            tooltip-effect="dark"
            style="width: 100% !important;"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              :width="50 * $px2rem">
          </el-table-column>
          <el-table-column
              label="设备名称"
              prop="deviceName"
              :width="240 * $px2rem">
          </el-table-column>
          <el-table-column
              label="设备类型"
              prop="deviceTypeName"
              :width="128 * $px2rem">
          </el-table-column>
          <el-table-column
              :width="128 * $px2rem"
              label="操作内容"
              prop="reamrks"
              show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--实时视频-->
    <div class="online-video margin" v-if="detail.deviceList && detail.deviceList.length">
      <div class="video-ctn-l"
           v-for="item in detail.deviceList">
        <HRtsp :deviceConfig="item.deviceConfig"
               :width="600"
               click-to-play
               no-bg></HRtsp>
      </div>
    </div>

    <div class="video-ctn margin">
      <div class="btm-l">
        <span class="s1">事件处理说明</span>
        <el-input v-model="alarmText"
                  placeholder="请输入事件处理说明"></el-input>
      </div>

      <div class="btm-r">
        <div class="cancel" @click="cancel">取消</div>

        <div class="btm-btn"
             v-if="detail.eventState!='-1'"
             @click="tunnelEventById"
             style="margin-right: 30px">
          隧道施工
        </div>

        <div class="btm-btn"
             v-if="detail.eventState!='-1'"
             @click="ignoreEventById"
             style="margin-right: 30px">
          误报忽略
        </div>

        <div class="btm-btn" @click="doDevicePlan">执行预案</div>
      </div>
    </div>
  </div>
</template>

<script>
import HTab from '../h-tab';
import HVideo from '../h-video';
import HSelect from '../h-select';
import HRtsp from '../video/video-rtsp';

export default {
  name: 'event-alarm',
  props: {
    detail: Object
  },
  components: {
    HTab,
    HVideo,
    HSelect,
    HRtsp
  },
  services: ['basic', 'plan', 'alarm'],
  watch: {
    detail: {
      handler(newObj, oldObj) {
        if (newObj) {
          this.init();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      tab: [
        {name: '图片'},
        {name: '视频'},
        {name: '处置流程'},
      ],
      state: 0,
      value: '',
      list: [],        //预案列表
      doneList: [],    //预案执行列表

      alarmText: '',   //事件说明
      doneListParm: []
    };
  },
  computed: {
    flowImgList() {
      return [
          require('@/assets/images/flow/flow-1.png'),
          require('@/assets/images/flow/flow-2.png'),
          require('@/assets/images/flow/flow-3.png'),
          require('@/assets/images/flow/flow-4.png'),
      ]
    }
  },
  methods: {
    init() {
      this.initParam();
      this.$service.plan.getAllByParam({
        tunnelId: this.detail.tunnelId,
        leftRightFlag: this.detail.leftRightFlag,
        eventTypeId: this.detail.eventType,
        planStatus: 1
      }).then(res => {
        res && res.forEach((item, index) => {
          item.name = item.planName;
          item.value = index + 1;  //索引
        });
        this.list = [].concat(res);
        if (!res.length) {
          this.$message.warning('没有找到该隧道对应事件的预案信息！');
        }
      });
    },
    cancel() {
      this.initParam();
      this.$emit('cancelPopup');
    },

    initParam() {
      this.state = 0;
      this.value = '';
      this.list = [];       //预案列表
      this.doneList = [];    //预案执行列表
      this.alarmText = '';  //事件说明
      this.doneListParm = [];
    },

    clickBar(e) {
      console.log(e)
      this.state = e;
    },

    handleSelectionChange(val) {
      this.doneListParm = val;
    },

    changeType(idx) {
      if (!idx) {
        this.doneList = [];
      } else {
        this.$service.plan.getPlanActions(this.list[idx - 1].id).then(res => {
          this.doneList = res;
        });
      }
    },

    // 隧道施工
    tunnelEventById() {
      if (!this.alarmText) {
        this.alarmText = '此事件为隧道正常施工，已忽略！'
      }

      this.$showConfirm('是否执行此操作，请确认是否选择对应的内容？').then(() => {
        this.$service.alarm.ignoreEventById({
          disposeFruit: this.alarmText,
          id: this.detail.id
        }).then(res => {
          this.alarmText = ''
          this.$notifySuccess();
          this.initParam();
          this.$emit('uploadList');
        });
      });
    },

    //忽略事件记录
    ignoreEventById() {
      if (!this.alarmText) {
        this.alarmText = '此事件为误报信息，已忽略！'
        // this.$ctx.toastError('请输入事件处理说明');
        // return;
      }

      this.$showConfirm('是否执行此操作，请确认是否选择对应的内容？').then(() => {
        this.$service.alarm.ignoreEventById({
          disposeFruit: this.alarmText,
          id: this.detail.id
        }).then(res => {
          this.alarmText = ''
          this.$notifySuccess();
          this.initParam();
          this.$emit('uploadList');
        });
      });

    },

    // 执行预案
    doDevicePlan() {
      if (!this.doneListParm.length) {
        this.$ctx.toastError('请选择对应的预案和预案执行的设备');
        return;
      }

      if (!this.alarmText) {
        this.$ctx.toastError('请输入事件处理说明');
        return;
      }

      this.$showConfirm('是否执行此操作，请确认是否选择对应的内容？').then(() => {
        this.$service.alarm.implementationPlan({
          disposeFruit: this.alarmText,
          id: this.detail.id,
          planId: this.list[this.value - 1].id,
          operateinIds: this.doneListParm.map(item => item.id)
        }).then(() => {
          this.alarmText = ''
          this.$notifySuccess();
          this.initParam();
          this.$emit('uploadList');
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
::v-deep .el-image-viewer__btn .el-icon-circle-close {
  color:#fff;
  &:before {
    font-size: 36px;
  }
}

.margin {
  margin-top: 18px;
}

.event-detail-ctn {
  .pop-text {
    margin-top: 30px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #5391F3;

    .text:first-child {
      margin-left: 0px
    }

    .text {
      margin-left: 60px;

      .s1 {
        font-weight: lighter !important;
        color: #C1D9FF;
      }
    }
  }

  .pop-t {
    margin-top: 22px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;

    .pop-t-l {
      display: flex;
      padding-top: 5px;
      padding-left: 10px;
      width: 600px;
      padding-bottom: 10px;
      background: rgba(12, 34, 83, 1);
      border-radius: 4px;
      border: 1px solid rgba(34, 76, 151, 1);
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;

      .s1 {
        color: #5391F3;
        display: flex;
        flex: none;
      }

      .v-text {
        margin-right: 10px;
        color: #C1D9FF;
      }
    }

    .pop-t-r {
      margin-left: 67px;

      .s1 {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #C1D9FF;
        margin-right: 30px;
      }
    }
  }

  .video-ctn, .online-video {
    display: flex;
    justify-content: space-between;

    .video-ctn-l {
      width: 600px;

      /deep/ .el-tabs--border-card > .el-tabs__content {
        padding: 0px;
        min-height: 300px;
      }

      .img-video-ctn {
        height: 300px;
        width: 100%;

        img {
          height: 100%;
          width: 100%
        }
      }
    }

    .video-ctn-r {
      overflow-y: scroll;
      max-height: 365px;
      width: 600px;

      .items {
        height: 50px;
        width: 100%;
        /*  border:1px solid rgba(34,76,151,1);*/
      }

      /deep/ .el-table td, .el-table th {
        padding: 0px !important;
      }

      /deep/ .has-gutter tr th {
        padding: 0px !important;
      }

      /deep/ .el-table td, .el-table th.is-leaf {
        border: 1px solid #1B3E6F !important;
      }

      /deep/ .el-table__body {
        /*margin-left: 10px !important;*/
      }

      /deep/ .cell {
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
    }

    .btm-l {
      display: flex;
      align-items: center;

      .s1 {
        flex: none;
        color: #C1D9FF;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin-right: 30px;
      }

      /deep/ .el-input__inner {
        width: 467px !important;
      }
    }

    .btm-r {
      display: flex;
      align-items: center;

      .btm-btn {
        cursor: pointer;
        padding: 3px 5px;
        border-radius: 4px;
        background: #337CF3;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #C1D9FF;
      }

      .cancel {
        cursor: pointer;
        padding: 3px 22px;
        margin-right: 30px;
        border-radius: 4px;
        border: 1px solid #123A84;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #C1D9FF;
      }
    }
  }


}
</style>
