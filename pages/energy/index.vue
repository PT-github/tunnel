<template>
    <form-page no-back>
        <div slot="left" class="org block">
            <titleCom title="隧道能耗排名"></titleCom>
            <div v-for="(item,index) in rankList"
                 v-if="rankList && rankList.length">
                <rank :data="item"
                      :rank="index+1"></rank>
            </div>
        </div>

        <h-tab :tab="[{name:'总能耗对比图'},{name:'总能耗率波动图'}]"
               tabName="name"
               ref="hTab"
               @clickBar="changeCzBar">
            <template slot="right-slot">
                <hSelect :ds="{service:'tunnel',func:'getListAll'}"
                         class="mar-r"
                         v-model="chartParam.tunnelId"
                         placeholder="请选择隧道"></hSelect>
                <hSelect :ds="{service:'basic',func:'getDict',params:'LeftRightFlag'}"
                         class="mar-r"
                         v-model="chartParam.LeftRightFlag"
                         placeholder="左右洞"></hSelect>
                <el-date-picker v-model="chartParam.date"
                                class="mar-r"
                                type="monthrange"
                                value-format="yyyy-MM"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
                <el-button icon="el-icon-search"
                           @click="searchChart(active)"
                           type="primary">搜索
                </el-button>
            </template>

            <!--波动图-->
            <div class="chart-ctn" v-if="active==1">
                <LineChart v-if="bodLineChart && bodLineChart.length"
                           :valueName="'savingRate'"
                           chartHeight="544px"
                           :indexLineData="bodLineChart"></LineChart>
                <Empty v-else style="height: 544px"></Empty>
            </div>
            <!--对比图-->
            <div class="chart-ctn" v-if="active==0">
                <BarChart v-if="duibBarChart && duibBarChart.length"
                          :option="barOption"
                          chartHeight="544px"
                          :barList="duibBarChart"></BarChart>
                <Empty v-else style="height: 544px"></Empty>
            </div>
        </h-tab>

        <!--tab1内容-->
        <div v-if="active==0">
            <div class="dub-title" v-if="energy">
                <div class="dub-title-l">
                    总能耗量：{{energy.energy}}KW， 对比总能耗:{{energy.standard}}KW，节能率： {{energy.savingRate}}%
                </div>
                <div class="dub-title-r">
                    <el-button type="primary" @click="exportEnergyList">导出</el-button>
                </div>
            </div>
            <el-table :data="energyList"
                      border
                      style="width: 100%;margin-top: 20px">
                <el-table-column
                        label="日期"
                        prop="month"
                        :width="110*$px2rem">
                </el-table-column>
                <el-table-column
                        label="所属隧道"
                        prop="tunnelName"
                        :width="224*$px2rem">
                </el-table-column>
                <el-table-column
                        :width="100*$px2rem"
                        label="左洞"
                        prop="leftEnergy">
                </el-table-column>
                <el-table-column
                        :width="100*$px2rem"
                        label="右洞"
                        prop="rightEnergy"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        :width="120*$px2rem"
                        label="总能耗量"
                        prop="energy">
                    <template slot-scope="scope">
                        <span>{{scope.row.energy}}KW</span>
                    </template>
                </el-table-column>
                <el-table-column
                        :width="140*$px2rem"
                        label="对比总能耗"
                        prop="standard">
                    <template slot-scope="scope">
                        <span>{{scope.row.standard}}KW</span>
                    </template>
                </el-table-column>
                <el-table-column
                        :width="140*$px2rem"
                        label="节能率"
                        prop="savingRate">
                </el-table-column>
                <el-table-column
                        label="节能比">
                    <template slot-scope="scope">
                        <div class="progress">
                            <el-progress :percentage="scope.row.savingRate"
                                         :show-text="true"
                                         color="#337CF3"></el-progress>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <h-table ref="table"
                 v-if="active==1"
                 style="padding-top: 30px"
                 :options="energyOption"
                 @click="onBtnClick">
            <template slot="form-title">
                <div class="l-title">
                    隧道能耗值清单列表
                </div>
            </template>
        </h-table>
    </form-page>
</template>
<script>
    import titleCom from '../../components/index/tips-title';
    import rank from '../../components/energy/energy-rank';
    import HTab from '../../components/h-tab';
    import HTable from '../../components/h-table';
    import LineChart from '../../components/index/index-line-chart';
    import BarChart from '../../components/charts/bar-charts';
    import Empty from '../../components/empty';

    export default {
        components: {
            titleCom,
            HTab,
            rank,
            HTable,
            LineChart,
            BarChart,
            Empty
        },
        services: [ 'device', 'energy' ],
        mounted () {
            //初始化参数
            this.initParam();
            //查询隧道总能耗排名列表
            this.getElenergyRankingList();

            //tab 0状态
            this.searchChart();
        },
        data () {
            return {
                barOption: [
                    {
                        barName: '总能耗量',
                        barColor: [ '#3aa1ff' ],
                        valueName: 'energy'
                    },
                    {
                        barName: '对比能耗量',
                        barColor: [ '#4ecb73' ],
                        valueName: 'standard'
                    }
                ],

                active: 0, //状态
                rankList: [],
                energy: {},          //隧道能耗（统计）数据
                bodLineChart: [],    //波动数据
                duibBarChart: [],    //对比数据
                energyList: [],  // 能耗下面的列表

                param: {},
                chartParam: {
                    tunnelId: '',
                    LeftRightFlag: '',
                    date: ''
                },

                //隧道能耗值清单列表
                energyOption: {
                    search: [
                        {
                            placeholder: '所属隧道',
                            field: 'tunnelId',
                            type: 'select',
                            ds: {service: 'tunnel', func: 'getListAll'}
                        },
                        // {
                        //     placeholder: '左右洞',
                        //     field: 'leftRightFlag',
                        //     type: 'select',
                        //     ds: {service: 'basic', func: 'getDict', params: 'LeftRightFlag'}
                        // },
                        {field: 'timeS,timeE', type: 'daterange'}
                    ],
                    searchButtons: [
                        {name: '导出', type: 'primary', event: 'export'}
                    ],
                    table: {
                        service: 'energy',
                        func: 'getList',
                        columns: [ {
                            title: '所属隧道',
                            field: 'tunnelName'
                        }, {
                            title: '左洞',
                            field: 'leftEnergy'
                        }, {
                            title: '右洞',
                            field: 'rightEnergy'
                        }, {
                            title: '总能耗量',
                            field: 'totalEnergy'
                        }, {
                            title: '电表读数',
                            field: 'totalNumber'
                        }, {
                            title: '上报时间',
                            field: 'gatherDate'
                        }, {
                            title: '能耗说明',
                            field: 'energyComments'
                        } ]
                    }
                }
            };
        },
        methods: {
            exportEnergyList () {   // 导出
                let param = {
                    tunnelId: this.chartParam.tunnelId,
                    LeftRightFlag: this.chartParam.LeftRightFlag,
                    dateE: this.chartParam.date.length ? this.chartParam.date[ 1 ] : '',
                    dateS: this.chartParam.date.length ? this.chartParam.date[ 0 ] : ''
                };
                this.$service.energy.exportEnergyListByMonth(param);
            },
            initParam () {
                this.active = 0;
                this.chartParam = {
                    tunnelId: '',
                    LeftRightFlag: '',
                    date: []
                };
                this.bodLineChart = [];
                this.duibBarChart = [];
                this.energyList = [];
            },
            getElenergyRankingList () {
                this.$service.energy.getElenergyRankingList().then(res => {
                    this.rankList = res || [];
                });
            },
            //切换tabs
            changeCzBar (active) {
                this.initParam();
                this.active = active;
                this.searchChart(active);
                this.$forceUpdate();
            },
            //根据active调不同数据
            searchChart (active) {
                //图表数据
                this.getCharts();
            },
            onBtnClick (e) {
                if (e.event === 'export') {
                    this.$service.energy.exportEnergyList(e.params);
                }
            },
            //波动图
            getCharts () {
                let param = {
                    tunnelId: this.chartParam.tunnelId,
                    leftRightFlag: this.chartParam.LeftRightFlag,
                    dateE: this.chartParam.date.length ? this.chartParam.date[ 1 ] : '',
                    dateS: this.chartParam.date.length ? this.chartParam.date[ 0 ] : ''
                };
                if (this.active == 0) {
                    //柱形图
                    this.$service.energy.getElenergyComparisonByMonth(param).then(res => {
                        if (param.leftRightFlag) {  // 左洞2 右洞1
                            this.duibBarChart = res.map(v => {
                                v.energy = v[ {1: 'rightEnergy', 2: 'leftEnergy'}[ param.leftRightFlag ] ];
                                v.standard = v[ {1: 'rightStandard', 2: 'leftStandard'}[ param.leftRightFlag ] ];
                                return v;
                            });
                        } else {
                            this.duibBarChart = res || [];
                        }
                    });
                    //列表
                    this.$service.energy.getTunnelenElenergyListByMonth(param).then(res => {
                        this.energyList = res || [];
                    });
                    //能耗率统计
                    this.$service.energy.getElenergyStatisticsByMonth(param).then(res => {
                        this.energy = res || {};
                    });
                } else {
                    //折现图
                    this.$service.energy.getElenergyFluctuationByMonth(param).then(res => {
                        if (param.leftRightFlag) {  // 左洞2 右洞1
                            this.bodLineChart = res.map(v => {
                                v.savingRate = v[ {1: 'rightSavingRate', 2: 'leftSavingRate'}[ param.leftRightFlag ] ];
                                return v;
                            });
                        } else {
                            this.bodLineChart = res || [];
                        }
                    });
                }
            }
        }
    };
</script>
<style scoped lang="less">
    /deep/ .el-input {
        width: 150px;
    }

    .l-title {
        margin-bottom: 20px;
        font-size: 20px;
        font-family: PingFang-SC-Heavy, PingFang-SC;
        font-weight: 800;
        color: #C1D9FF;
    }

    .mar-r {
        margin-right: 10px;
    }

    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .chart-ctn {
        margin-top: 20px;
    }

    .dub-title {
        margin-top: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .dub-title-l {
            font-size: 20px;
            font-family: PingFang-SC-Heavy, PingFang-SC;
            font-weight: 800;
            color: #C1D9FF;
        }

        .dub-title-r {

        }
    }

    /deep/ .flex .left {
        width: 420px !important;
    }

    .org {
        height: 100%;
        padding: 20px;
        width: 100%;
    }

    /deep/ .table {
        padding: 20px 0px 10px 0px;
        background: none;
        border: none;
    }

    .progress {
        display: flex;
        justify-content: center;
        align-items: center;

        .el-progress {
            width: 95%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>

