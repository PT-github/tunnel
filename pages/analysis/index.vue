<template>
    <form-page no-back>
        <!--当天事件统计-->
        <container title="当天事件统计"
                   @search="searchData"
                   :search="option1">
            <template slot="content">
                <div class="gauge-ctn">
                    <div class="gauge-item"
                         v-if="sjtjCharts && sjtjCharts.length"
                         v-for="(item,index) in sjtjCharts">
                        <span class="d1">{{item.typeName}}</span>
                        <gauge-chart :chartId="'gauge'+index"
                                     :color="['#ffc12c','#0ed772','#ff7e30','#f02fc1','#fb2815','#eb26e9','#07b1d1','#0096ff'][index]"
                                     :gaugeItem="item"></gauge-chart>
                    </div>
                    <Empty v-else></Empty>
                </div>
            </template>
        </container>

        <div class="page-item">
            <div class="page-l">
                <!--设备故障情况统计表-->
                <container title="设备故障情况统计表"
                           @search="searchData2"
                           :search="option2">
                    <template slot="content">
                        <div class="chart1" v-if="sbgzCharts && sbgzCharts.length">
                            <LineChart :lineList="sbgzCharts"
                                       :chartHeight="$getPx(642)"
                                       :option="lineOption"></LineChart>
                        </div>
                        <Empty v-else :style="{height:$getPx(662)}"></Empty>
                    </template>
                </container>
            </div>
            <div class="page-r">
                <!--设备统计-->
                <container title="设备统计">
                    <template slot="content">
                        <div class="chart1"
                             v-if="sbtjList && sbtjList.length">
                            <div class="list-ctn"
                                 v-for="item in sbtjList">
                                <div class="top">
                                    <img src="../../assets/images/alarm/tunnel.png" alt="">
                                    <span class="s1">{{item.tunnelName}}</span>
                                </div>
                                <div class="top2">
                                    <span class="s2">全部设备：{{item.sumDeviceCount}}</span>
                                    <span class="s3">正常：{{item.normalCount}}</span>
                                    <span class="s4">故障：{{item.abnormalCount}}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </container>
            </div>
        </div>

        <div class="page-item">
            <div class="page-l">
                <!--能耗统计图-->
                <container title="能耗统计图"
                           @search="searchData3"
                           :search="option3">
                    <template slot="content">
                        <div class="chart2" v-if="nhtjCharts && nhtjCharts.length">
                            <BarChart :barList="nhtjCharts"
                                      :chartHeight="$getPx(698)"
                                      :option="barOption"></BarChart>
                        </div>
                        <Empty :style="{height:$getPx(718)}" v-else></Empty>
                    </template>
                </container>
            </div>
            <div class="page-r">
                <!--能耗节能率排行-->
                <container title="能耗节能率排行">
                    <template slot="content">
                        <div class="chart2" v-if="nhjnList && nhjnList.length">
                            <div class="list-ctns"
                                 v-for="(item,index) in nhjnList">
                                <div class="order"
                                     :class="{'one':index==0,'two':index==1,'three':index==2}">{{index+1}}
                                </div>
                                <div class="tun-ctn">
                                    <div class="tun-ctn-t">
                                        <div class="tun-ctn-t-l">
                                            <img src="../../assets/images/alarm/tunnel.png" alt="">
                                            <span class="s1">{{item.tunnelName}}</span>
                                            <span class="s2">{{item.belongsStretch}}</span>
                                        </div>
                                        <div class="tun-ctn-t-r">
                                            {{item.energy}}（{{item.savingRate||0}}%）
                                        </div>
                                    </div>
                                    <div class="tun-ctn-b">
                                        <el-progress :percentage="item.savingRate || 0"
                                                     :show-text="false"
                                                     color="#337CF3"></el-progress>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </container>
            </div>
        </div>

        <div class="page-item">
            <div class="page-l">
                <!--隧道类型设备统计-->
                <container title="隧道类型设备统计"
                           @search="searchData4"
                           :search="option4">
                    <template slot="content">
                        <div class="pre-ctn"
                             v-if="sblxCharts && sblxCharts.length">
                            <PreCahrt :preList="sblxCharts"
                                      :chartHeight="$getPx(718)"></PreCahrt>
                        </div>
                        <Empty :style="{height:$getPx(718)}" v-else></Empty>
                    </template>
                </container>
            </div>
            <div class="page-r">
                <!--设备类型列表-->
                <container title="设备类型列表">
                    <template slot="content">
                        <div class="chart2" v-if="sblxList && sblxList.length">
                            <div class="list-ctns"
                                 v-for="item in sblxList">
                                <div class="device-ctn">
                                    <div class="device-ctn-l">
                                        <img class="device-icon"
                                             v-if="item.deviceTypeCode"
                                             :src="require(`@/assets/images/device/${item.deviceTypeCode}.png`)" alt="">
                                        <span class="s3 device-ctn-r">{{item.deviceTypeName}}</span>
                                    </div>
                                    <div class="device-ctn-r">
                                        {{item.sumDeviceCount}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </container>
            </div>
        </div>

    </form-page>
</template>
<script>
    import container from '../../components/analysis/char-container';

    import GaugeChart from '../../components/charts/gauge-charts';
    import BarChart from '../../components/charts/bar-charts';
    import PreCahrt from '../../components/charts/pie-charts';
    import LineChart from '../../components/charts/line-charts';

    import Empty from '../../components/empty';

    export default {
        components: {
            container,
            GaugeChart,
            BarChart,
            PreCahrt,
            LineChart,
            Empty
        },
        services: [ 'energy', 'index' ],
        mounted () {
            //设备统计
            this.selectDataDisplayDevice();
            //能耗节能率排行
            this.selectDataDisplayEnergy();
            //设备类型列表
            this.selectDataDisplayDeviceTypeAll();

            //图表
            //当天事件统计
            this.searchData({});
            //设备故障统计
            this.searchData2({});
            //能耗统计
            this.searchData3({});
            //设备类型图形
            this.searchData4({});
        },
        data () {
            return {
                //事件图表
                alarmChart: {
                    tunnelId: '',
                    LeftRightFlag: ''
                },

                option1: [ {type: 'tunnel'}, {type: 'LeftRightFlag'}, {
                    type: 'date',
                    name: '发生时间',
                    valueType: 'yyyy-MM-dd',
                    selType: 'day',
                    default: [ new Date(), new Date() ]
                } ],
                option2: [ {type: 'tunnel'}, {type: 'date', name: '选择月份', valueType: 'yyyy-MM'} ],
                option3: [ {type: 'tunnel'}, {type: 'LeftRightFlag'}, {
                    type: 'date',
                    name: '选择月份',
                    valueType: 'yyyy-MM',
                    selType: 'month'
                } ],
                option4: [ {type: 'tunnel'}, {type: 'LeftRightFlag'} ],
                barOption: [
                    {
                        barName: '能耗量',
                        barColor: [ '#4ecb73' ],
                        valueName: 'energyUsageCount'
                    }
                ],
                lineOption: [
                    {
                        lineName: '设备故障数',
                        lineColor: [ '#3aa1ff' ],
                        valueName: 'failureCount'
                    },
                    {
                        lineName: '设备预警数',
                        lineColor: [ '#4ecb73' ],
                        valueName: 'earlyWarningCount'
                    }
                ],

                sbtjList: [],    //设备统计
                nhjnList: [],    //能耗节能排行
                sblxList: [],    //设备类型列表

                sjtjCharts: [],      //事件统计
                sbgzCharts: [],      //设备故障
                nhtjCharts: [],      //能耗统计
                sblxCharts: []      //设备类型
            };
        },
        methods: {
            //搜索事件统计
            searchData (param) {
                let {dateS, dateE, LeftRightFlag, tunnelId} = param;
                let rel = {
                    startDate: dateS ? dateS : undefined,
                    endDate: dateE ? dateE : undefined,
                    leftRightFlag: LeftRightFlag ? LeftRightFlag : undefined,
                    tunnelId: tunnelId ? tunnelId : undefined
                };
                this.$service.energy.selectEventRecordByType(rel).then(res => {
                    this.sjtjCharts = res || [];
                });
            },
            //设备故障情况统计表
            searchData2 (param) {
                let {dateS, dateE, tunnelId} = param;
                let rel = {
                    startDate: dateS ? dateS : '',
                    endDate: dateE ? dateE : '',
                    tunnelId: tunnelId ? tunnelId : ''
                };
                this.$service.energy.selectDataDisplayFailure(rel).then(res => {
                    this.sbgzCharts = res || [];
                });
            },
            //数据分析—查询能耗统计图
            searchData3 (param) {
                let {dateS, dateE, LeftRightFlag, tunnelId} = param;
                let rel = {
                    startDate: dateS ? dateS : undefined,
                    endDate: dateE ? dateE : undefined,
                    leftRightFlag: LeftRightFlag ? LeftRightFlag : undefined,
                    tunnelId: tunnelId ? tunnelId : undefined
                };
                this.$service.energy.selectDataDisplayEnergyUsage(rel).then(res => {
                    this.nhtjCharts = res || [];
                });
            },
            //数据分析—设备类型图形
            searchData4 (param) {
                let {LeftRightFlag, tunnelId} = param;
                let rel = {
                    leftRightFlag: LeftRightFlag ? LeftRightFlag : undefined,
                    tunnelId: tunnelId ? tunnelId : undefined
                };
                this.$service.energy.selectDataDisplayDevices(rel).then(res => {
                    this.sblxCharts = res || [];
                });
            },
            selectDataDisplayDevice () {
                this.$service.energy.selectDataDisplayDevice().then(res => {
                    this.sbtjList = res || [];
                });
            },
            selectDataDisplayEnergy () {
                this.$service.energy.selectDataDisplayEnergy().then(res => {
                    this.nhjnList = res || [];
                });
            },
            selectDataDisplayDeviceTypeAll () {
                this.$service.energy.selectDataDisplayDeviceTypeAll().then(res => {
                    this.sblxList = res || [];
                });
            }
        }
    };
</script>
<style lang='less' scoped>
    .org {
        height: 100%;
        background: linear-gradient(180deg, rgba(24, 38, 113, 1) 0%, rgba(24, 38, 113, 0) 100%);
        border-radius: 20px 20px 0px 0px;
        padding: 20px;
    }

    .page-item {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;

        .page-l {
            width: 63%;

            .chart1 {
                height: 662px;
            }

            .chart2 {
                height: 718px;
            }
        }

        .page-r {
            width: 36%;

            .chart1 {
                height: 662px;
                overflow-y: scroll;
            }

            .chart2 {
                height: 718px;
                overflow-y: scroll;
            }
        }
    }

    .list-ctn, .list-ctns {
        padding: 20px 20px;
        background: #0C2253;
        border-top: 1px solid #224C97;

        .top {
            display: flex;
            align-items: center;

            img {
                height: 20px;
                width: 20px
            }

            .s1 {
                margin-left: 10px;
                font-size: 20px;
                font-family: PingFang-SC-Bold, PingFang-SC;
                font-weight: bold;
                color: #C1D9FF;
            }
        }

        .top2 {
            margin-top: 15px;
            font-size: 16px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;

            .s2 {
                color: #C1D9FF;
                margin-left: 31px
            }

            .s3 {
                color: #51D53E;
                margin-left: 60px
            }

            .s4 {
                color: #FDB913;
                margin-left: 60px
            }
        }
    }

    .list-ctns {
        display: flex;
        align-items: center;

        .one {
            background: #da1bfd !important;
        }

        .two {
            background: #8550f4 !important;
        }

        .three {
            background: #337cf3 !important;
        }

        .order {
            height: 25px;
            width: 26px;
            font-size: 16px;
            border-radius: 4px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
        }

        .tun-ctn {
            margin-left: 10px;
            width: 100%;

            .tun-ctn-t {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;

                &-l {
                    display: flex;
                    align-items: center;

                    img {
                        height: 20px;
                        width: 20px;
                    }

                    .s1 {
                        font-size: 20px;
                        font-family: PingFang-SC-Bold, PingFang-SC;
                        font-weight: bold;
                        margin-left: 10px;
                        color: #C1D9FF;
                    }

                    .s2 {
                        color: #337CF3;
                        margin-left: 10px;
                        font-size: 16px;
                        font-family: PingFang-SC-Bold, PingFang-SC;
                        font-weight: bold;
                    }
                }

                &-r {
                    font-size: 16px;
                    font-family: PingFang-SC-Bold, PingFang-SC;
                    font-weight: bold;
                    color: #C1D9FF;
                }
            }

            .tun-ctn-b {
                margin-top: 20px;
            }
        }

        .device-ctn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .device-ctn-l {
                display: flex;
                align-items: center;

                .device-icon {
                    height: 30px;
                    width: 30px;
                }

                .s3 {
                    margin-left: 10px;
                }
            }

            .device-ctn-r {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #C1D9FF;
            }
        }
    }

    .gauge-ctn {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding-right: 10px;
        height: 300px;
        /*.gauge-item:nth-child(6n){margin-right: 0px}*/

        .gauge-item {
            padding-top: 10px;
            background-color: #0C2253;
            border-radius: 6px;
            height: 230px;
            margin-left: 10px;
            /*display: flex;*/
            flex: 1;
            /* width: calc((100% - 180px) / 8);*/
            border: 1px solid #224C97;

            .d1 {
                color: #ffffff;
                margin-left: 10px;
                padding-top: 10px;
            }
        }
    }

    .pre-ctn {
        height: 718px;
        margin-left: 20px;
        margin-right: 80px;
        width: calc(100% - 100px);
    }
</style>

