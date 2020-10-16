<template>
    <form-page :breadcrumb="[{name:'设备管理',path:'/device'},{name:'设备详情'}]">
        <div class="org">
            <div class="page-ctn">

                <!--设备基本信息-->
                <div class="device-info-ctn" v-if="deviceDetail">
                    <div class="device-t">
                        <div class="device-t-l">
                            <!-- {{deviceDetail.leftRightFlagName}} -->
                            <span class="s1">{{deviceDetail.deviceName}}（残值：{{deviceDetail.deviceHealthPercent}}）</span>
                            <div class="edit-btn"
                                 @click="$router.push({path: '/device/add-device', query: {id:id,type: 'edit'}})">
                                编辑设备
                            </div>
                        </div>
                        <div class="top-bars">
                            <div class="top-bars-item"
                                 :class="{'no-id':!deviceDetail.previousDevice}"
                                 @click="changeDevice(deviceDetail.previousDevice)"
                                 style="border-right: 1px solid #1C67E3">
                                <i class="el-icon-arrow-left"></i>
                            </div>
                            <div class="top-bars-item"
                                 :class="{'no-id':!deviceDetail.nextDevice}"
                                 @click="changeDevice(deviceDetail.nextDevice)">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="device-c">
                        <div class="info-item">所属隧道：{{deviceDetail.belongTunnel}}</div>
                        <div class="info-item">设备类型：{{deviceDetail.deviceTypeName}}</div>
                        <div class="info-item">启用时间：{{(deviceDetail.firstEmployDate||'').substring(0, 10)}}</div>
                        <div class="info-item">设备桩号：{{deviceDetail.pileNumberStr}}</div>
                        <div class="info-item">IP：{{deviceDetail.deviceIP}}</div>
                    </div>
                    <div class="device-b">
                        <div class="device-state-ctn">
                            <div class="s-l">
                                设备操作
                            </div>
                            <div class="s-r">
                                <img v-if="deviceDetail&&deviceDetail.classifyNumber && deviceDetail.classifyNumber!=='controller'" class="s1"
                                     :src="`/static/image/tunnel/${deviceDetail.classifyNumber}_${deviceDetail.deviceCommunicationsState}.png`">
                                <span v-else></span>
                                <div class="device-done flex-c" @click="showModal = true">设备操作</div>
                            </div>
                        </div>

                        <div class="device-state-ctn">
                            <div class="s-l">
                                设备状态
                            </div>
                            <div class="s-r">
                                <span class="s1">通讯状态：{{deviceDetail.deviceCommunicationsStateName}}</span>
                                <span class="s2">设备状态：{{deviceDetail.deviceEmployStateName}}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chart-screen flex-s">
                    <h-tab :tab="[{name:'设备故障频率统计'},{name:'设备状态波动统计'}]"
                           tabName="name"
                           @clickBar="changeRadio">
                        <div class="echarts-ctn">
                            <IndexLineChart v-if="chartData && chartData.length"
                                            :valueName="'faultNum'"
                                            :indexLineData="chartData"></IndexLineChart>
                            <Empty v-else></Empty>
                        </div>

                        <template slot="right-slot">
                            <div class="chart-screen-r">
                                <el-date-picker value-format="yyyy-MM"
                                                v-if="radio==1"
                                                v-model="dateArr"
                                                type="monthrange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                </el-date-picker>
                                <el-date-picker value-format="yyyy-MM-dd"
                                                v-else
                                                v-model="dateArr1"
                                                type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                </el-date-picker>
                                <el-button class="chart-screen-r-button" type="primary" @click="changeRadio(radio-1)"
                                           icon="el-icon-search">查询
                                </el-button>
                            </div>
                        </template>
                    </h-tab>
                </div>


                <div class="chart-screen flex-s" style="padding-bottom: 20px">
                    <h-tab :tab="[{name:'操作日志'},{name:'运维日志'},{name:'设备详情'}]"
                           tabName="name"
                           ref="hTab"
                           @clickBar="changeCzBar">
                        <!--操作日志-->
                        <div class="time-line-ctns" v-if="id && btmValueState==1">
                            <h-table ref="table"
                                     class="h-table"
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
                                                <OperateItem :data="item"></OperateItem>
                                            </TimeLine>
                                        </div>
                                    </div>
                                </template>
                            </h-table>
                        </div>

                        <!--运维日志-->
                        <div class="time-line-ctn" v-if="btmValueState==2">
                            <h-table ref="table2"
                                     class="h-table"
                                     :options="secondOptions"
                                     :params="secondParams">
                                <template slot="row" slot-scope="scope">
                                    <OperationsItem :data="scope.row"></OperationsItem>
                                </template>
                            </h-table>
                        </div>

                        <!--设备详情-->
                        <div class="time-line-ctn"
                             style="margin: 20px"
                             v-if="btmValueState == 3">
                            <!--设备详情表格-->
                            <DeviceTable :deviceDetail="deviceDetail"></DeviceTable>
                        </div>

                        <!--顶部右侧插槽-->
                        <template slot="right-slot">
                            <div class="chart-screen-r" v-show="btmValueState===1">
                                操作时间：
                                <el-date-picker value-format="yyyy-MM-dd"
                                                v-model="czDate"
                                                @change="changeCzDate"
                                                type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                </el-date-picker>
                            </div>

                            <template v-if="btmValueState===2">
                                <el-date-picker value-format="yyyy-MM-dd"
                                                v-model="secondParams.dateRange"
                                                type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                </el-date-picker>
                                <el-input placeholder="搜索关键词" v-model="secondParams.strSearch"
                                          style="width: 250px;margin: 0 20px;"></el-input>
                                <hSelect :ds="{service:'basic',func:'getDict',params:'MaintenanceStatus'}"
                                         v-model="secondParams.maintenanceStatusValue"
                                         placeholder="运维状态"></hSelect>
                                <el-button style="margin-left: 20px;" type="primary" @click="changeCzBar(1)">查询
                                </el-button>
                            </template>
                        </template>
                    </h-tab>
                </div>

            </div>
        </div>

        <!--弹窗-->
        <modal-control :classify-number="deviceDetail.classifyNumber"
                       v-model="showModal" :device-obj="deviceDetail"
                       @update="init" :tunnel-id="deviceDetail.tunnelId"></modal-control>
    </form-page>
</template>

<script>
    import IndexLineChart from '../../components/index/index-line-chart';
    import HTable from '../../components/h-table';
    import OperateItem from '../../components/device/operate-item';
    import OperationsItem from '../../components/operations/operations-item';
    import DeviceTable from '../../components/device/detail-table';

    import TimeLine from '../../components/h-timeline';
    import HTab from '../../components/h-tab';
    import HSelect from '../../components/h-select';
    import ModalControl from '../../components/2d/modal-control';
    import Empty from '../../components/empty';

    let currentTimes = new Date().getTime();
    export default {
        name: 'detail',
        components: {
            ModalControl,
            IndexLineChart,
            HTable,
            OperateItem,
            OperationsItem,
            DeviceTable,
            TimeLine,
            HTab,
            HSelect,
            Empty
        },
        services: [ 'device' ],
        data () {
            return {
                showModal: false,    // 展示设备操作弹窗
                id: '',  //设备ID
                radio: 1,
                dateArr: [],         //日期选择器参数

                deviceDetail: {},     //设备详情
                chartData: [],        //折线图对象

                params: {},  //列表其他参数
                options: {
                    search: [],
                    buttons: [],
                    table: {
                        hideHeader: true,
                        customRow: true,
                        service: 'device',
                        func: 'queryDeviceCzList'
                    }
                },
                btmValueState: 1,
                czDate: [ this.formatDate(currentTimes - 15 * 24 * 3600 * 1000), this.formatDate(currentTimes) ],  //操作日志
                //运维日志参数
                secondOptions: {
                    search: [],
                    buttons: [],
                    table: {
                        hideHeader: true,
                        customRow: true,
                        service: 'device',
                        func: 'queryDeviceYwList'
                    }
                },
                secondParams: {
                    deviceId: ''
                }
            };
        },
        mounted () {
            this.id = this.$route.query && this.$route.query.id || '';
            this.dateArr = [
                this.formatDate((currentTimes - 365 * 24 * 3600 * 1000), 'month'), this.formatDate(currentTimes)
            ];
            this.dateArr1 = [
                this.formatDate((currentTimes - 15 * 24 * 3600 * 1000), 'day'), this.formatDate(currentTimes)
            ];
            this.init();
        },
        methods: {
            formatDate (time = 0, type = 'day') {
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                month = (month + '').padStart(2, '0');
                let day = date.getDate();
                day = (day + '').padStart(2, '0');
                let map = {
                    'month': year + '-' + month,
                    'day': year + '-' + month + '-' + day
                };
                return map[ type ];
            },
            init () {
                let id = this.id;
                //设备详情
                this.getDeviceDetail(id);
                //设备故障率
                this.getDeviceGz({deviceId: id});
                let [ startOpeDate, endOpeDate ] = this.czDate || [];
                //操作日志参数
                this.params = {
                    strDeviceId: id,
                    keyWord: '',
                    startOpeDate,
                    endOpeDate
                };
            },
            //设备详情
            getDeviceDetail (id) {
                this.$service.device.getById(id).then(res => {
                    this.deviceDetail = res;
                    this.secondParams.deviceId = this.deviceDetail.id;
                });
            },
            changeRadio (active) {
                this.radio = Number(active) + 1;
                this.chartData = {};
                if (this.radio === 1) {
                    this.getDeviceGz();
                    return;
                }
                this.getDeviceBd();
            },
            changeCzBar (active) {
                this.btmValueState = Number(active) + 1;
                // this.czDate = []
                if (this.btmValueState == 1) {
                    this.changeCzDate();
                } else if (this.btmValueState == 2) {
                    this.changeYwDate();
                }
            },
            //根据条件查询设备故障率
            getDeviceGz () {
                let param = {
                    deviceId: this.id,
                    faultDateS: this.startDate,
                    faultDateE: this.endDate
                };
                this.$service.device.getDeviceGz(param).then(res => {
                    this.chartData = res;
                });
            },
            getDeviceBd () {
                let [ faultDateS, faultDateE ] = this.dateArr1 || [];
                let param = {
                    deviceId: this.id,
                    faultDateS,
                    faultDateE
                };
                this.$service.device.getDeviceBd(param).then(res => {
                    this.chartData = res;
                });
            },
            changeCzDate () {
                let [ startOpeDate, endOpeDate ] = this.czDate || [];
                this.params = {
                    strDeviceId: this.id,
                    keyWord: '',
                    startOpeDate,
                    endOpeDate
                };
                //重新加载列表
                this.$nextTick(() => {
                    this.$refs.table.init();
                });
            },
            changeYwDate () {
                //重新加载列表
                this.$nextTick(() => {
                    this.$refs.table2.init();
                });
            },
            //上一个、下一个设备
            changeDevice (id) {
                if (!id) {
                    return;
                }
                this.id = id;
                this.radio = 1;
                this.dateArr = [];        //日期选择器参数
                this.dateArr1 = [];        //日期选择器参数
                // this.czDate = []
                this.btmValueState = 1;
                this.init(id);
                //初始化tab得状态
                this.$refs.hTab.activeNum = '0';
                this.$nextTick(() => {
                    this.$refs.table.init();
                });
                //更新页面
                this.$forceUpdate();
                //提示成功
                this.$notifySuccess();
            }

        },
        computed: {
            //开始时间
            startDate () {
                return this.dateArr && this.dateArr.length && this.dateArr[ 0 ] || '';
            },
            endDate () {
                return this.dateArr && this.dateArr.length && this.dateArr[ 1 ] || '';
            }
        }
    };
</script>

<style scoped lang="less">
    .flex-c {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .h-table /deep/ .table-com {
        height: auto;
    }

    .flex-s {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .org {
        padding-bottom: 1px;
        position: relative;
        height: 100%;
        background: linear-gradient(180deg, rgba(24, 38, 113, 1) 0%, rgba(24, 38, 113, 0) 100%);
        border-radius: 20px 20px 0px 0px;

        .page-ctn {
            padding-top: 20px;
            margin-left: 30px;
            margin-right: 30px;
            width: calc(100% - 60px);

            .device-info-ctn {
                margin-top: 10px;
                width: 100%;
                background: #0C2253;
                padding-bottom: 20px;
                border: 1px solid #224C97;
                border-radius: 4px 4px 0px 0px;

                .device-t {
                    justify-content: space-between;
                    margin-right: 10px;

                    .device-t-l {
                        font-size: 20px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                    }
                }

                .device-t, .device-c, .device-b {
                    margin-top: 23px;
                    margin-left: 20px;
                    display: flex;
                    align-items: center;

                    .top-bars {
                        height: 30px;
                        width: 88px;
                        background: #337CF3;
                        border-radius: 4px;
                        display: flex;

                        .top-bars-item {
                            cursor: pointer;
                            display: flex;
                            flex: 1;
                            align-items: center;
                            justify-content: center;
                            color: #FFFFFF;
                        }

                        .no-id {
                            background: #C1D9FF;
                        }
                    }

                    .s1 {
                        color: #C1D9FF;
                        font-size: 16px;
                        font-family: PingFang-SC-Heavy, PingFang-SC;
                    }

                    .edit-btn {
                        cursor: pointer;
                        margin-left: 18px;
                        height: 30px;
                        width: 88px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: rgba(51, 124, 243, 1);
                        border-radius: 4px;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #C1D9FF;
                    }

                    .info-item:first-child {
                        margin-left: 0px
                    }

                    .info-item {
                        margin-left: 60px;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #5391F3;
                    }

                    .device-state-ctn:first-child {
                        margin-left: 0px
                    }

                    .device-state-ctn {
                        margin-left: 60px;
                        height: 50px;
                        width: 526px;
                        border-radius: 4px;
                        background: #123A84;
                        display: flex;

                        .s-l {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 158px;
                            height: 100%;
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #FFFFFF;
                        }

                        .s-r {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            height: 100%;
                            width: 100%;
                            background: #0C2253;
                            border: 1px solid #123A84;

                            .s1 {
                                margin-left: 24px;
                            }

                            .s2 {
                                margin-right: 30px
                            }

                            .s1, .s2 {
                                font-size: 16px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #FFFFFF;
                            }

                            .device-done {
                                cursor: pointer;
                                height: 32px;
                                width: 94px;
                                background: rgba(18, 58, 132, 1);
                                border-radius: 4px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #FFFFFF;
                                margin-right: 18px;
                            }
                        }
                    }
                }
            }

            .chart-screen {
                margin-top: 36px;

                &-r {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #C1D9FF;
                    display: flex;
                    align-items: center;

                    &-button {
                        margin-left: 12px;
                    }

                    /deep/ .el-range-separator {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #C1D9FF;
                        width: auto;
                        line-height: 36px;
                    }

                    /deep/ .el-date-editor .el-range__icon {
                        line-height: 37px;
                    }

                    /deep/ .el-range-input {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #C1D9FF;
                        background-color: #123A84;
                    }
                }
            }

            .echarts-ctn {
                margin-top: 35px;
            }

            .time-line-ctns {
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
            }
        }

        /deep/ .el-table {
            border: none;
        }

        /deep/ .el-table__row > td {
            border: none
        }
    }
</style>