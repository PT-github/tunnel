<template>
  <form-page no-back>
    <!--事件tabs-->
    <h-tab :tab="alarmClassList"
           tabName="typeName"
           dotName="count"
           icon="typeCode"
           iconType="alarm"
           @clickBar="changeClass">
      <div class="time-line-ctn">
        <h-table ref="table"
                 :top="250"
                 :options="options"
                 :params="params">
          <template slot="row" slot-scope="scope">
            <div style="padding-left: 5px">
              <!--时间-->
              <div class="time-bar">
                <div class="sort"></div>
                <div class="times">{{scope.row.date}}</div>
              </div>
              <div v-for="item in scope.row.list">
                <TimeLine>
                  <alarm-item :data="item"
                              @openDetail="openDetail"></alarm-item>
                </TimeLine>
              </div>
            </div>
          </template>
        </h-table>
      </div>

      <template slot="right-slot">
        <div class="alarm-btn" v-auth="'/rest/TEventrecord/config'"
             @click="alarmClassParam = JSON.parse(JSON.stringify(alarmClassRes));popup = true">
          <img src="../../assets/images/alarm/set-icon.png" alt="">
          配置事件提醒
        </div>
      </template>
    </h-tab>

    <h-popup title="事件配置提醒"
             @handleClose="alarmClassParam = [];popup = false"
             @btnCannal="alarmClassParam = [];popup = false"
             @btnConfirm="subAlarmSetter"
             showButton
             :width="$getPx(740)"
             :showPopup="popup">
      <table class="table-ctn" border="1px" cellspacing="0">
        <tr class="ctn-t">
          <th>事件类型</th>
          <th>是否语音提示</th>
          <th>是否自动预警提醒</th>
          <th>事析类型说明</th>
        </tr>
        <tr v-for="(alarm,i) in alarmClassParam" :key="i">
          <th>{{alarm.typeName}}</th>
          <th>
            <el-switch active-value="1"
                       inactive-value="0"
                       :disabled="alarm.isAutoRemind=='0'"
                       v-model="alarm.isSoundRemind"
                       active-color="#5391F3"/>
          <th>
            <el-switch active-value="1"
                       inactive-value="0"
                       @change="switchChange(alarm,i)"
                       v-model="alarm.isAutoRemind"
                       active-color="#5391F3"/>
          </th>
          <th>{{alarm.reamrks}}</th>
        </tr>
      </table>
    </h-popup>

    <HPopup :width="$getPx(1272)"
            @handleClose="cancelPopup"
            title="事件处理"
            :showPopup="showDetail">

      <EventAlarm :detail="itemDetail"
                  @uploadList="uploadList"
                  @cancelPopup="cancelPopup"/>
    </HPopup>
  </form-page>
</template>

<script>
import HTable from '../../components/h-table';

import HTab from '../../components/h-tab'
import TimeLine from '../../components/h-timeline'
import AlarmItem from '../../components/alarm/alarm-item'
import HPopup from '../../components/common-popup'
import EventAlarm from '../../components/alarm/event-alarm'

export default {
  components: {
    HTable,
    HTab,
    TimeLine,
    AlarmItem,
    HPopup,
    EventAlarm
  },
  services: ['alarm'],
  mounted() {
    this.init()
  },
  data() {
    return {
      params: {},
      options: {
        search: [
          {placeholder: '事件内容', field: 'eventContent', type: 'text', label: '事件内容'},
          {placeholder: '所属隧道', field: 'tunnelId', type: 'select', ds: {service: 'tunnel', func: 'getListAll'}},
          {
            placeholder: '左右洞',
            field: 'leftRightFlag',
            type: 'select',
            ds: {service: 'basic', func: 'getDict', params: 'LeftRightFlag'}
          },
          {placeholder: '发生时间', field: 'createdUserDateS,createdUserDateE', type: 'daterange'},
          {
            placeholder: '事件状态', field: 'eventState', type: 'select',
            ds: {service: 'basic', func: 'getDict', params: 'EventState'}
          }
        ],
        /* buttons: [
             {name: '新增事件配置', type: 'primary', icon: 'el-icon-plus', event: 'create'}
         ],*/
        table: {
          service: 'alarm',
          func: 'getList',
          selectable: false,
          hideHeader: true,
          customRow: true
        }
      },

      alarmClassList: [],  //事件类型及统计数量

      alarmClassRes: [], //事件配置提醒参数模板
      alarmClassParam: [],
      popup: false,

      showDetail: false,
      itemDetail: null

    };
  },
  methods: {
    switchChange(item, i) {
      let list = this.alarmClassParam || []
      if (item.isAutoRemind === '0') {
        item.isSoundRemind = '0'
      }
      list[i] = item;
      this.alarmClassParam = list;
    },
    init() {
      this.$service.alarm.queryTEventTypeInfo().then(res => {
        this.alarmClassRes = JSON.parse(JSON.stringify(res))
        res.unshift({'typeName': '全部', typeCode: 'all'})
        this.alarmClassList = JSON.parse(JSON.stringify(res))
      })
    },
    openDetail(data) {
      this.itemDetail = data
      this.$forceUpdate();
      this.showDetail = true
    },
    cancelPopup() {
      this.showDetail = false
      this.itemDetail = null

      console.log(23423423423424)
    },
    //更新列表页
    uploadList() {
      this.showDetail = false
      this.init()
      this.$nextTick(() => {
        this.$refs.table.reload(true);
      });
    },
    changeClass(idx) {
      if (idx === 0) {
        this.params = {}
      } else {
        this.params = {
          eventType: this.alarmClassList[idx].id
        }
      }
      this.$nextTick(() => {
        this.$refs.table.reload(true);
      });
    },
    //设置事件配置
    subAlarmSetter() {
      this.$service.alarm.subTEventTypeInfo(this.alarmClassParam).then(res => {
        this.$notifySuccess();
        this.init()
        this.popup = false
      })
    }

  }
};
</script>

<style scoped lang="less">
.alarm-btn {
  cursor: pointer;
  margin-right: 18px;
  height: 30px;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(18, 58, 132, 1);
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #C1D9FF;

  img {
    height: 12px;
    width: 12px;
    margin-right: 4px
  }
}

.time-line-ctn {
  /deep/ .table {
    background: none;
  }

  .time-bar {
    display: flex;
    align-items: center;
    margin-bottom: 22px;

    .sort {
      position: relative;
      left: -5px;
      height: 10px;
      width: 10px;
      background: #337CF3;
      border-radius: 50%;
    }

    .times {
      padding: 0px 6px;
      background: #337CF3;
      border-radius: 4px;
      margin-left: 5px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #C1D9FF;
    }
  }

  /deep/ .el-table__row > td {
    border: none
  }

  /deep/ .el-table td, .el-table th {
    padding: 0px;
  }

  /deep/ .el-table__body-wrapper {
    margin-left: -10px;
    overflow: visible;
  }

  /deep/ .el-table {
    border: none;
  }

  /deep/ .el-table__row > td {
    border: none
  }
}

.table-ctn {
  width: 100%;
  border-radius: 4px;
  border-collapse: collapse;
  margin-top: 30px;
  margin-bottom: 30px;
  table-layout: fixed;

  tr th {
    border: 1px solid #224C97;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #C1D9FF;
    height: 50px;
  }

  .ctn-t th {
    width: calc(100% / 4);
    background: #0C2253;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #5391F3;
  }
}
</style>
