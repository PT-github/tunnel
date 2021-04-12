<template>
  <form-page no-back>
    <div slot="left" class="orgs block">
      <!--弹窗-->
      <modal-deviceConfig ref="modalDeviceConfig" v-model="showModal" :device-id="deviceId" ></modal-deviceConfig>
      <div class="class-item"
           :class="{'class-item-a':leftState==index}"
           @click="handleOrgClick(item.id,index)"
           v-for="(item,index) in deviceClass">
        <div class="item-icon" v-if="item.classifyIcon">
          <img :src="require(`../../assets/images/device/${item.classifyIcon}.png`)" alt="">
        </div>
        <span class="flex1 name" :class="{margin:!item.classifyIcon}">{{item.classifyName}}</span>
        <div class="cort" v-if="item.count">
          {{item.count}}
        </div>
      </div>

    </div>
    <h-table ref="table" :params="params" :options="options" :top="170"
             @click="onButtonClick"
             @searchChange="searchParmsChange"
             @search="onSearchChange"
             @row-btn-click="onRowButtonClick"></h-table>

  </form-page>
</template>

<script>
import HTable from '../../components/h-table';
import ModalDeviceConfig from './modal-deviceConfig';

export default {
  name: 'index',
  components: {
    HTable,
    ModalDeviceConfig
  },
  services: ['device', 'basic'],
  mounted() {
    this.getDeviceTypeList();
  },
  data() {
    return {
      params: {},
      options: {
        search: [
          {
            placeholder: '所属隧道',
            field: 'tunnelId',
            type: 'select',
            ds: {service: 'tunnel', func: 'getListAll'}
          }, {
            placeholder: '左右洞',
            field: 'leftRightFlag',
            type: 'select',
            ds: {service: 'basic', func: 'getDict', params: 'LeftRightFlag'}
          },
          {placeholder: '设备名称', field: 'deviceName', type: 'text'},
          {placeholder: '启动时间', field: 'startEmployDate,endEmployDate', type: 'daterange'},
          {
            placeholder: '设备状态',
            field: 'deviceEmployState',
            type: 'select',
            ds: {service: 'basic', func: 'getDict', params: 'EquipmentEnabledState'}
          },
          {
            placeholder: '通讯状态',
            field: 'deviceCommunicationsState',
            type: 'select',
            ds: [{
              value: 0,
              name: '正常'
            }, {
              value: 1,
              name: '异常'
            }]
          }
          // {placeholder: '残值起值', field: 'startDepreciationRate', type: 'text'},
          // {placeholder: '残值截止', field: 'endDepreciationRate', type: 'text'}
        ],
        buttons: [
          {
            name: '新增设备',
            type: 'primary',
            icon: 'el-icon-plus',
            event: 'create',
            auth: '/rest/TDevicebookinfo/add'
          },
          {
            name: '导入',
            type: 'primary',
            event: 'import',
            selectFile: '.xls,.xlsx',
            auth: '/rest/TDevicebookinfo/import'
          },
          {name: '导出', type: 'primary', event: 'export'},
          {name: '下载导入模板', event: 'download', auth: '/rest/TDevicebookinfo/downtemp'},
          {
            name: '批量删除',
            icon: 'el-icon-delete',
            event: 'delete',
            needData: true,
            auth: '/rest/TDevicebookinfo/batchdelete'
          }
        ],
        table: {
          service: 'device',
          func: 'queryDeviceList',
          selectable: true,
          columns: [{
            title: '设备编码',
            field: 'deviceCode',
            width: 180 * this.$px2rem
          }, {
            title: '设备名称',
            field: 'deviceName',
            width: 220 * this.$px2rem
          }, {
            title: '所属隧道',
            field: 'belongTunnel'
          }, {
            title: '安装位置',
            field: 'installLocation'
          }, {
            title: '左右洞',
            field: 'leftRightFlagName',
            width: 95 * this.$px2rem
          }, {
            title: '桩号',
            field: 'strPileNumber',
            width: 95 * this.$px2rem
          }, {
            title: '启用时间',
            type: 'customField',
            fieldFunction: row => (row.firstEmployDate || '').substring(0, 10),
            width: 120 * this.$px2rem
          }, {
            title: '运行时长(天)',
            field: 'deviceWorkTime',
            width: 108 * this.$px2rem
          }, {
            title: '厂商',
            field: 'deviceVender'
          }, {
            title: '设备状态',
            field: 'deviceEmployStateName',
            width: 78 * this.$px2rem
          }, {
            title: '通讯状态',
            field: 'deviceCommunicationsStateName',
            width: 78 * this.$px2rem
          },
            {
              title: '操作',
              type: 'buttons',
              width: 200 * this.$px2rem,
              buttons: [
                {name: '详情', icon: 'el-icon-info', event: 'detail'},
                {
                  name: '编辑', icon: 'el-icon-edit', event: 'edit',
                  auth: '/rest/TDevicebookinfo/edit'
                },
                {name: '配置', icon: 'el-icon-edit', event: 'config'},
                {
                  name: '删除',
                  icon: 'el-icon-delete-solid',
                  event: 'delete',
                  auth: '/rest/TDevicebookinfo/delete'
                }]
            }]
        }
      },

      deviceClass: [], //左侧设备分类
      leftState: -1,
      showModal:false,
      deviceId: ''
    };
  },
  methods: {
    searchParmsChange(finalParams) {
      this.getDeviceTypeList(finalParams);
    },
    onSearchChange(e) { // 列表点击查询
      // this.getDeviceTypeList(e.finalParams);
    },
    getDeviceTypeList(params = {}) {  // 获取设备类型和数量
      this.$service.device.getDeviceClassList(params).then(res => {
        let totalCount = 0;
        res.forEach(item => {
          totalCount += Number(item.count);
        });

        const deviceTypeList = res.filter(item => item.classifyIcon !== 'other')

        this.deviceClass = [{classifyName: '全部', classifyIcon: 'all', count: totalCount}].concat(deviceTypeList);
      });
    },
    onButtonClick(e) {     // 点击按钮
      if (e.event === 'create') {
        this.$router.push('/device/add-device');
      } else if (e.event === 'delete') {
        this.deleteMoreDevice(e.rows.map(v => v.id));
      } else if (e.event === 'export') {
        this.$service.device.exportDeviceBook(e.params);
      } else if (e.event === 'import') {
        this.$service.device.importDeviceInfoBatch(e.files[0]).then(() => {
          this.$notifySuccess('导入成功');
          this.$refs.table.reload(true);
        });
      } else if (e.event === 'download') {
        this.$service.device.downloadDeviceTemplates();
      }
    },
    onRowButtonClick(e) {  // 表格内的操作按钮
      let {event, row} = e;
      switch (event) {
        case 'detail':
          this.$router.push({
            path: '/device/detail',
            query: {
              id: row.id
            }
          });
          break;
        case 'edit':
          this.$router.push({
            path: '/device/add-device',
            query: {
              id: row.id,
              type: 'edit'
            }
          });
          break;
        case 'delete':
          this.deleteDevice(row.id);
          break;
        case 'config':
          this.configDevice(row.id);
          break;
      }
    },
    deleteMoreDevice(idList) {   //批量删除
      this.$showConfirm().then(() => {
        this.$service.device.deleteMoreDevice(idList.join(',')).then(() => {
          this.$refs.table.reload(true);
          this.getDeviceTypeList();
          this.$notifySuccess();
        });
      });
    },
    configDevice(id) {   // 配置设备
      this.showModal = true;
      this.deviceId = id;
      this.$refs.modalDeviceConfig.showDal()
      //console.log('this.showModal',this.showModal)
    },
    deleteDevice(id) {   // 删除隧道
      this.$showConfirm().then(() => {
        this.$service.device.deleteDevice(id).then(() => {
          this.$refs.table.reload(true);
          this.getDeviceTypeList();
          this.$notifySuccess();
        });
      });
    },
    handleOrgClick(id, idx) {    // 点击设备类型
      if (this.leftState === idx) {
        this.leftState = -1;
        this.params = {};
        this.$nextTick(() => {
          this.$refs.table.reload(true);
        });
      } else {
        this.leftState = idx;
        this.params = {
          classifyId: id
        };
        this.$nextTick(() => {
          this.$refs.table.reload(true);
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.class-item-a {
  background: #0C2253;
}

.class-item {
  cursor: pointer;
  position: relative;
  height: 60px;
  justify-content: center;
  width: 100%;
  display: flex;
  align-items: center;
  color: #FFFFFF;
  text-align: center;
  padding: 0 10px;
  border-bottom: 1px solid rgba(34, 76, 151, 1);

  &:hover {
    background: #0C2253;
  }

  .name {
    text-align: left;
    margin-left: 10px;

    &.margin {
      margin-left: 55px;
    }
  }

  .item-icon {
    height: 30px;
    width: 30px;
    margin-right: 5px;

    img {
      height: 100%;
      width: 100%
    }
  }

  .cort {
    color: #FFFFFF;
  }
}

/deep/ .el-input {
  width: 160px !important;
}

/deep/ .cell .el-button--medium {
  margin-left: 10px !important;
}

.org {
  height: 100%;
  background: linear-gradient(180deg, rgba(24, 38, 113, 1) 0%, rgba(24, 38, 113, 0) 100%);
  border-radius: 20px 20px 0px 0px;
  padding: 20px;
}

.orgs {
  height: calc(100vh - 170px);
  overflow-y: scroll;
  border-radius: 6px 6px 0 0;
  width: 100%;
}
</style>
