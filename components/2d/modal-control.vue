<template>
  <div>
    <popup :showPopup="show"
           @handleClose="show = false"
           @btnCannal="show = false"
           @btnConfirm="submit"
           :width="classifyNumber==='intelligenceboard'? $getPx(1088): '50%'"
           class="modal"
           :show-button="hasOperation && classifyNumber!=='broadcast' && classifyNumber!=='intelligenceboard'"
           :confirm-button-text="classifyNumber==='conflagration'?'复位':'确定操作'"
           :title="title">
      <!--情报板-->
      <template v-if="classifyNumber==='intelligenceboard'">
        <modal-info-board :tunnelId="tunnelId" @close="show=false"></modal-info-board>
      </template>

      <!--广播-->
      <template v-else-if="classifyNumber==='broadcast'">
        <modal-broadcast :tunnelId="tunnelId"></modal-broadcast>
      </template>

      <!--其他设备-->
      <div class="modal-content" v-else>
        <div class="head">
          <el-input v-model="keyword" class="search" placeholder="请输入搜索的设备名"></el-input>
          <div class="head-right" v-if="hasOperation && classifyNumber!=='environment'">
            <div>
              <div class="head-right" v-if="hasOperation && classifyNumber==='draughtfan' && keyword.length==0">
                <span>左洞</span>
                <el-checkbox v-model="isCheckAllLeft" class="checkboxFilter" @change="changeCheck"></el-checkbox>
                <span>右洞</span>
                <el-checkbox v-model="isCheckAllRight" class="checkboxFilter" @change="changeCheck"></el-checkbox>
              </div>
              <div class="head-right" v-if="hasOperation && classifyNumber==='laneIndicator' && keyword.length==0 && laneNums===3">
                  <span>左快</span>
                  <el-checkbox v-model="isCheckAllLeft1" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                  <span>左行</span>
                  <el-checkbox v-model="isCheckAllLeft2" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                  <span>左慢</span>
                  <el-checkbox v-model="isCheckAllLeft3" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                  <span>右快</span>
                  <el-checkbox v-model="isCheckAllRight1" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                  <span>右行</span>
                  <el-checkbox v-model="isCheckAllRight2" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                  <span>右慢</span>
                <el-checkbox v-model="isCheckAllRight3" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
              </div>
              <div class="head-right" v-if="hasOperation && classifyNumber==='laneIndicator' && keyword.length==0 && laneNums===2">
                <span>左超</span>
                <el-checkbox v-model="isCheckAllLeft1" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                <span>左行</span>
                <el-checkbox v-model="isCheckAllLeft2" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                <span>右超</span>
                <el-checkbox v-model="isCheckAllRight1" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
                <span>右行</span>
                <el-checkbox v-model="isCheckAllRight2" class="checkboxFilter" @change="changeCheck2"></el-checkbox>
              </div>
            </div>
            <span>全选</span>
            <el-checkbox :value="isCheckAll" class="checkbox" @change="changeCheckAll"></el-checkbox>
          </div>
        </div>
        <ul class="scroll">
          <template v-for="(item,idx) in showingList" >  
            <li class="device-item">
              <div class="idx">{{ idx + 1 }}</div>
              <div class="content">
                <p class="name" @click="showdetail(item)"><span class="label">设备名称</span>{{ item.name }}
                </p>
                <p class="name second" v-if="item.secondLabel">
                  <span
                    class="label">{{ item.secondLabel }}</span>
                    <el-progress v-if="item.isProcess"
                                 style="width: 120px;display: inline-block"
                                 :percentage="item.waterProcess"
                                 status="success"/>
                  {{ item.secondVal }}
                </p>
              </div>

              <div class="icon-wrap">
                <img class="icon" v-if="item.statusIcon" :src="item.statusIcon">
                <div v-if="item.statusStr">{{ item.statusStr }}</div>
              </div>
              <div v-if="item.operaBtn" class="view-btn" @click="onOperaBtnClick(item)">
               
                {{ item.operaBtn }}
              </div>
              <el-checkbox v-if="item.checkbox"
                           :value="checkList[idx]"
                           class="checkbox"
                           @change="onCheck(item,idx)"/>
            </li>
          </template>
        </ul>
      </div>

      <div class="modal-more" v-if="hasOperation && classifyNumber!=='conflagration'">
        <div class="label">设备操作选项：</div>
        <!--控制器-->
        <template v-if="classifyNumber==='controller'">
          <el-radio-group v-model="workMode">
            <el-radio :label="0">智能控制</el-radio>
            <el-radio :label="1">时序模式</el-radio>
            <el-radio :label="2">紧急模式</el-radio>
            <el-radio :label="3">手动模式</el-radio>
          </el-radio-group>
        </template>

        <!--照明灯-->
        <template v-else-if="classifyNumber==='lighting'">
          <el-radio-group v-model="workMode">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">打开</el-radio>
          </el-radio-group>
          <span v-show="workMode===1" class="ctl-brightness">亮度：</span>
          <el-slider v-model="lightNess" v-show="workMode===1"></el-slider>
        </template>

        <!--风机-->
        <template v-else-if="classifyNumber==='draughtfan'">
          <el-radio-group v-model="workMode">
            <el-radio :label="0">关闭</el-radio>
            <el-radio :label="1">正转</el-radio>
            <el-radio :label="2">反转</el-radio>
          </el-radio-group>
        </template>

        <!--信号灯-->
        <template v-else-if="classifyNumber==='signallamp'">
          <el-radio-group v-model="workMode">
            <el-radio :label="0">绿灯</el-radio>
            <el-radio :label="1">红灯</el-radio>
            <el-radio :label="2">黄灯</el-radio>
            <el-radio :label="3">左转</el-radio>
          </el-radio-group>
        </template>

        <!--车道指示器-->
        <template v-else-if="classifyNumber==='laneIndicator'">
          <el-radio-group v-model="workMode">
            <el-radio :label="1">正向通行</el-radio>
            <el-radio :label="2">反向通行</el-radio>
            <el-radio :label="0">道路封闭</el-radio>
            <el-radio :label="3">左转通行</el-radio>
          </el-radio-group>
        </template>

        <!--卷闸门-->
        <template v-else-if="classifyNumber==='tunneldoor'">
          <el-radio-group v-model="workMode">
            <el-radio :label="0">暂停</el-radio>
            <el-radio :label="1">上升</el-radio>
            <el-radio :label="2">下降</el-radio>
          </el-radio-group>
        </template>

        <!--机房环境，只有发动机有操作-->
        <template v-else-if="classifyNumber==='environment'">
          <el-radio-group v-model="workMode">
            <el-radio :label="0">停止</el-radio>
            <el-radio :label="1">启动</el-radio>
          </el-radio-group>
        </template>

        <!--水位监测-->
        <template v-else-if="classifyNumber==='waterlevel'">
          <el-radio-group v-model="workMode">
            <el-radio :label="0">停止</el-radio>
            <el-radio :label="1">启动</el-radio>
          </el-radio-group>
        </template>
      </div>
    </popup>

    <popup-media v-model="showMediaPopup" :medias="showMedias"/>
  </div>
</template>

<script>
import ModalBroadcast from './modal-broadcast';
import ModalInfoBoard from './modal-info-board';
import PopupMedia from './popup-media';

export default {
  components: {
    ModalBroadcast,
    ModalInfoBoard,
    PopupMedia
  },
  services: ['tunnel', '_2d'],
  props: {
    value: Boolean,
    deviceObj: Object,       // 直接传设备对象过来
    deviceName: String,         // 选中的设备对象
    classifyNumber: String,      // 分类名
    showAll: Boolean,        // 是否展示同类型的全部设备
    tunnelId: String         // 隧道id
  },
  computed: {
    isCheckAll() {
      if (!this.showingList.length) return false;
      let res = true;
      this.showingList.forEach((v, idx) => {
        if (!this.checkList[idx]) res = false;
      });
      return res;
    },
    hasOperation() {
      return ['controller', 'lighting', 'draughtfan', 'signallamp', 'laneIndicator', 'tunneldoor', 'conflagration', 'environment', 'waterlevel'].includes(this.classifyNumber);
    },
    showingList() {
      var list= this.listData ? this.listData.filter(v => v.name.indexOf(this.keyword) !== -1) : [];
      if(list.length==1&&list[0].checkbox){
        this.$set(this.checkList, 0, true);
      }
      return list;
    },
    checkDevices() {
      return Object.keys(this.checkList).filter(v => !!this.checkList[v]).map(v => this.showingList[v].origin);
    }
  },
  watch: {
    value(v) {
      this.show = v;
      if (v) {
        this.$service._2d.getDeviceTypeName(this.classifyNumber).then(res => {
          this.title = res;
        });
        this.getDevices();
      } else {
        this.title = '';
        this.listData = [];
        this.checkList = [];
        this.workMode = 0;
        this.lightNess = 50;
        this.isCheckAllLeft = false;
        this.isCheckAllRight = false;
        this.isCheckAllLeft1 = false;
        this.isCheckAllLeft2 = false;
        this.isCheckAllLeft3 = false;
        this.isCheckAllRight1 = false;
        this.isCheckAllRight2 = false;
        this.isCheckAllRight3 = false;
      }
    },
    deviceName(v) {
      this.keyword = v || '';
    },
    show(v) {
      this.$emit('input', v);
    }
  },
  data() {
    return {
      laneNums: 0,
      showMediaPopup: false,
      showMedias: [],
      show: false,
      listData: [],
      keyword: '',
      title: '',
      checkList: [],
      workMode: 0,
      lightNess: 50,
      leftRightFlag:'',
      orientationLocationFilter:'',
      isCheckAllLeft:false,
      isCheckAllRight:false,
      isCheckAllLeft1:false,
      isCheckAllLeft2:false,
      isCheckAllLeft3:false,
      isCheckAllRight1:false,
      isCheckAllRight2:false,
      isCheckAllRight3:false
    };
  },
  methods: {
    submit() { // 点击确定
      // 其他设备
      if (!this.checkDevices.length) {
        return this.$message.warning('请选择设备');
      }

      let deviceIds = this.showingList.reduce((arr, item) => {
        const selectedDevice =this.checkDevices.filter(device => item.origin.id === device.id)
        arr = [...arr, ...selectedDevice]
        return arr
      }, []).map(v => v.id).join(',');


      let p = {
        deviceIds,
        classifyNumber: this.classifyNumber,
        workMode: this.workMode
      };

      if (this.classifyNumber === 'lighting') {
        p.lightNess = this.lightNess;
      }
      this.$service._2d.operatePlcDevice(p).then((r) => {
        if(r && r.status && r.status==='-1'){
          this.$message(r.message);
        }
        this.$notifySuccess();
        this.getDevices();
        this.$emit('update');
        this.show = false;
      });
    },

    //查看设备详情
    showdetail(item) {
      // console.log(item);
      let routeUrl = this.$router.resolve({
        path: '/device/detail',
        query: {
          id: item.origin.id
        }
      });
      window.open(routeUrl.href, '_blank');

    },

    onCheck(device, idx) {    // 点击选中
      let isChecked = !this.checkList[idx];
      console.log('isChecked',isChecked)
      this.$set(this.checkList, idx, isChecked);
      if (device.chainCheckbox) {     // 联动选择
        this.showingList.forEach((v, i) => {
          if (v[v.chainCheckboxField] === device[device.chainCheckboxField]) {
            this.$set(this.checkList, i, isChecked);
          }
        });
      }
    },

    async onOperaBtnClick(device) {  // 操作按钮点击事件
      let medias = [];
      let {deviceConfig, imgOrVedioUrl} = device.origin;
      switch (this.classifyNumber) {
        case 'video':   // 视频
          medias = [{type: 'video', deviceConfig: deviceConfig}];
          break;
        case 'waterlevel':  // 水位监测
          medias = [{type: 'image', src: imgOrVedioUrl}];
          break;
        case 'electronicfence':     // 电子围栏
          let res = await this.$service._2d.getTunnel2Videos(this.tunnelId);
          medias = res.map(v => {
            return {type: 'video', deviceConfig: v.deviceConfig};
          });
          break;
        case 'tunneldoor':      // 卷闸门
          medias.push({type: 'video', deviceConfig: deviceConfig});
          break;
      }
      this.showMediaPopup = true;
      this.showMedias = medias;
    },

    changeCheckAll() {
      if (this.isCheckAll) {
        this.checkList = {};
      } else {
        let res = {};
        console.log(this.showingList);
        this.showingList.forEach((v, idx) => {
          res[idx] = true;
        });
        this.checkList = res;
      }
    },
    changeCheck() {
      let res = {};
      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===2){
          res[idx] = this.isCheckAllLeft;
        }
      });
      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===1){
          res[idx] = this.isCheckAllRight;
        }
      });

      this.checkList = res;
    },
    changeCheck2() {
      let res = {};

      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===2 && v.orientationLocation===1){
          res[idx] = this.isCheckAllLeft1;
        }
      });
      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===2 && v.orientationLocation===2){
          res[idx] = this.isCheckAllLeft2;
        }
      });
      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===2 && v.orientationLocation===3){
          res[idx] = this.isCheckAllLeft3;
        }
      });
      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===1 && v.orientationLocation===1){
          res[idx] = this.isCheckAllRight1;
        }
      });
      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===1 && v.orientationLocation===2){
          res[idx] = this.isCheckAllRight2;
        }
      });
      this.showingList.forEach((v, idx) => {
        if(v.leftRightFlag===1 && v.orientationLocation===3){
          res[idx] = this.isCheckAllRight3;
        }
      });

      this.checkList = res;
    },
    // 获取设备列表
    getDevices() {
      if (this.classifyNumber !== 'intelligenceboard' && this.classifyNumber !== 'broadcast') {
        if (this.deviceObj) {
          this.listData = this.resolveDeviceList([this.deviceObj]);
        } else {
          this.$service._2d.getTunnelDeviceTypeList(this.tunnelId, this.classifyNumber).then(res => {
            this.listData = this.resolveDeviceList(res);
          });
        }
      }
      if(this.classifyNumber === 'laneIndicator'){
        //获取隧道信息里的车道数量，生成分组过滤/////
        this.$service.tunnel.getById(this.tunnelId).then(res => {
          this.laneNums = res.laneNums;
          console.log(this.laneNums)
        });
      }
    },

    // 处理设备列表数据
    resolveDeviceList(res) {
      return res.map(v => {
        let isError = v.deviceCommunicationsState === 1;
        let stateName = isError ? '异常' : '正常';
        let errorImg = v.classifyNumber !== 'controller' && isError && `/static/image/tunnel/${v.classifyNumber}_1.png`;
        switch (v.classifyNumber) {
            // 控制器
          case 'controller':
            const ms = v.workMode ? {
              '1': {name: '手动模式', icon: 'u640'},
              '2': {name: '时序模式', icon: 'u523'},
              '3': {name: '智能模式', icon: 'u605'},
              '4': {name: '应急模式', icon: 'u623'}
            }[v.workMode] : null;
            return {
              origin: v,  // 保留原来的数据，用来调接口
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: isError ? stateName : ms && ms.name,
              // statusIcon: isError ? errorImg : ms && require(`../../assets/images/warning/${ms[ v.workMode ].icon}.png`),
              checkbox: true
            };

            // 照明灯
          case 'lighting':
            return {
              origin: v,
              name: v.deviceName + ' ' + (v.otherDes || ''),
              secondLabel: '',
              secondVal: '',
              statusStr: isError ? stateName : v.workModeName,
              statusIcon: isError ? errorImg : v.workMode && `/static/image/tunnel/${v.classifyNumber}_0_${v.workMode}.png`,
              chainCheckbox: false,
              deviceName: v.deviceName,
              chainCheckboxField: 'deviceName',
              checkbox: true
            };

            // 风机
          case 'draughtfan':
            return {
              origin: v,
              deviceCode: v.deviceCode,
              name: v.deviceName,
              secondLabel: '',
              secondVal: '',
              statusStr: isError ? stateName : v.workModeName,
              statusIcon: isError ? errorImg : v.workMode && `/static/image/tunnel/${v.classifyNumber}_0_${v.workMode}.png`,
              checkbox: true,
              chainCheckbox: false,
              chainCheckboxField: 'deviceCode',
              leftRightFlag: v.leftRightFlag,
              orientationLocation: v.orientationLocation
            };

            // 视频监控
          case 'video':
            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.classifyNumber}_${v.deviceCommunicationsState}.png`,
              checkbox: false,
              operaBtn: '查看'
            };

            // 信号灯
          case 'signallamp':
            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: isError ? stateName : (v.workModeName || ''),
              statusIcon: isError ? errorImg : v.workMode != null && `/static/image/tunnel/${v.classifyNumber}_0_${v.workMode}.png`,
              checkbox: true
            };

            // 车道指示灯
          case 'laneIndicator':
            const ENUM = {'1': '正向通行', '2': '反向通行', '0': '道路封闭'};

            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: isError ? stateName : (ENUM[v.workMode] || ''),
              statusIcon: isError ? errorImg : v.workMode != null && `/static/image/tunnel/${v.classifyNumber}_0_${v.workMode}.png`,
              checkbox: true,
              leftRightFlag: v.leftRightFlag,
              orientationLocation: v.orientationLocation
            };

            // 紧急电话
          case 'urgentphone':
            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.classifyNumber}_${v.deviceCommunicationsState}.png`,
              checkbox: false
            };

            // 火警消防
          case 'conflagration':
            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.classifyNumber}_${v.deviceCommunicationsState}.png`,
              checkbox: true
            };

            // 诱导灯
          case 'guidelight':
            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.classifyNumber}_${v.deviceCommunicationsState}.png`,
              checkbox: false
            };

            // 水位
          case 'waterlevel':
            const otherDes = parseFloat(v.otherDes ? v.otherDes : '0')
            const process = Number((otherDes / 500 * 100).toFixed(0))
            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '当前水位',
              secondVal: v.otherDes,
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.classifyNumber}_${v.deviceCommunicationsState}.png`,
              checkbox: v.deviceTypeCode === 'waterpump',
              operaBtn: '查看',
              isProcess: true,
              waterProcess: process
            };

            // 电子围栏
          case 'electronicfence':
            return {
              origin: v,
              name: v.deviceName,
              secondLabel: '设备桩号',
              secondVal: v.pileNumberStr,
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.classifyNumber}_${v.deviceCommunicationsState}.png`,
              checkbox: false,
              operaBtn: '查看'
            };

            // 机房环境
          case 'environment':
            return {
              origin: v,
              name: v.deviceName + ' ' + (v.sensorValText || ''),
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.deviceTypeCode}_${v.deviceCommunicationsState}.png`,
              checkbox: v.deviceTypeCode === 'alternator'
            };

            // 机房环境里面的柴油发动机
          case 'alternator':
            return {
              origin: v,
              name: v.deviceName + ' ' + (v.sensorValText || ''),
              statusStr: stateName,
              statusIcon: `/static/image/tunnel/${v.deviceTypeCode}_${v.deviceCommunicationsState}.png`,
              checkbox: true
            };

            // 横洞卷闸门
          case 'tunneldoor':
            const wm = v.workMode ? {
              '0': {text: '暂停', icon: '0'},
              '1': {text: '开启', icon: '1'},
              '2': {text: '关闭', icon: '0'}
            }[v.workMode] : null;
            return {
              origin: v,
              name: v.deviceName,
              statusStr: isError ? stateName : (wm ? wm.text : ''),
              statusIcon: isError ? errorImg : v.workMode && `/static/image/tunnel/${v.classifyNumber}_0_${wm.icon}.png`,
              checkbox: true,
              operaBtn: v.deviceCommunicationsState === 0 ? '查看' : false
            };
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.modal {
  .ctl-brightness {
    margin: 0 10px 0 30px;
    color: #C1D9FF;
  }

  .modal-more {
    display: flex;
    align-items: center;
    padding: 12px 20px 0;
    height: 38px;

    .label {
      font-size: 16px;
      color: rgba(83, 145, 243, 1);
      margin-right: 30px;
    }

    .btn {
      width: 120px;
      height: 50px;
      cursor: pointer;
      background: rgba(41, 131, 253, 1);
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
  }

  .checkbox {
    display: inline-block;
    border-radius: 5px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-size: 100% 100%;
    margin-left: 20px;
  }
  .el-checkbox{
    margin-left: 20px;
    margin-right: 20px;
  }
  .checkboxFilter{
    margin-left: 5px;
    margin-right: 20px;
  }

  .scroll {
    margin-top: 17px;
    max-height: 350px;
    overflow-y: scroll;

    .device-item {
      min-height: 55px;
      background: rgba(12, 34, 83, 1);
      border: 1px solid rgba(34, 76, 151, 1);
      display: flex;
      align-items: center;
      padding: 10px 15px;
      margin-bottom: 9px;

      .view-btn {
        text-align: center;
        background: linear-gradient(90deg, #0f53b0, #159ef6);
        border-radius: 100px;
        padding: 8px 24px;
        white-space: nowrap;
        color: #fff;
        cursor: pointer;
        margin-left: 40px;
      }

      .idx {
        width: 22px;
        height: 22px;
        background: rgba(41, 131, 253, 1);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #fff;
        margin-right: 16px;
        line-height: 22px;
      }

      .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 14px;
        color: rgba(83, 145, 243, 1);

        .icon {
          max-width: 40px;
          max-height: 40px;
          margin-bottom: 6px;
        }
      }

      .content {
        flex: 1;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;

        .name {
          font-size: 14px;
          line-height: 15px;
          color: rgba(170, 211, 243, 1);
          cursor: pointer;

          &.second {
            margin-top: 10px;
          }

          .label {
            color: rgba(44, 115, 229, 1);
            margin-right: 16px;
          }
        }
      }
    }
  }

  &-header {
    width: 100%;
    height: 70px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: 22px;
      height: 26px;
    }

    span {
      margin-top: 3px;
      margin-left: 12px;
      font-size: 18px;
      font-weight: bold;
      color: rgba(83, 145, 243, 1);
    }

    &-close {
      width: 32px !important;
      height: 32px !important;
      cursor: pointer;
    }
  }

  &-content {
    margin: 18px;
    overflow: auto;
    padding: 30px 25px 25px;
    background: #0c2253;
    box-shadow: 0 2px 7px 0 rgba(14, 47, 121, 0.38);
    border-radius: 4px;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 20px;

      .head-right {
        font-size: 14px;
        color: rgba(83, 145, 243, 1);
        display: flex;
        align-items: center;

        .checkbox {
          margin-left: 10px;
        }
      }

      .search {
        width: 253px;
      }
    }
  }
}
</style>
