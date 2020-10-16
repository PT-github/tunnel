<template>
    <div class="tunnel-chart">
        <div class="tunnel-chart-header">
            <div class="tunnel-chart-header-row tunnel-chart-header-left">
                <div class="tunnel-chart-header-row-item"
                     v-for="(item,i) in tabs"
                     :class="[active==i&&'active-tab']"
                     @click="choseTabs(i)"
                     :key="i">{{item}}
                </div>
            </div>
            <div class="tunnel-chart-header-row">

                <el-date-picker v-model="searchForm.date"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="primary" class="search-btn" @click="doSearch" icon="el-icon-search">查询</el-button>
            </div>
        </div>
        <div>
            <template v-if="active==0">
                <div class="chart1" v-if="sbgzCharts && sbgzCharts.length">
                    <LineChart :lineList="sbgzCharts"
                               :chartHeight="$getPx(540)"
                               xName="date"
                               :option="lineOption"></LineChart>
                </div>
                <Empty v-else :style="{height:$getPx(540)}"></Empty>
            </template>
            <template v-if="active==1">
                <BarChart v-if="eventList&&eventList.length"
                          :option="energyBar"
                          :chartHeight="$getPx(540)"
                          xName="eventDate"
                          :barList="eventList"></BarChart>
                <Empty v-else :style="{height:$getPx(540)}"></Empty>
            </template>
            <template v-if="active==2">
                <div class="chart1" v-if="energyList && energyList.length">
                    <LineChart :lineList="energyList"
                               xName="day"
                               :chartHeight="$getPx(540)"
                               :option="energyLine"></LineChart>
                </div>
                <Empty v-else :style="{height:$getPx(540)}"></Empty>
            </template>
        </div>
    </div>
</template>

<script>
    import Empty from '../empty';
    import LineChart from '../charts/line-charts';
    import BarChart from '../charts/bar-charts';

    export default {
        components: {
            LineChart, Empty, BarChart
        },
        services: [ 'energy' ],
        props: {
            tunnelId: {
                type: [ Number, String ],
                default: () => {
                    return '';
                }
            }
        },
        data () {
            return {
                id: '',
                searchForm: {
                    date: []
                },
                sbgzCharts: [],    //设备故障情况统计表
                lineOption: [
                    {
                        lineName: '设备故障数',
                        lineColor: [ '#3aa1ff' ],
                        valueName: 'failureNum'
                    },
                    {
                        lineName: '设备预警数',
                        lineColor: [ '#4ecb73' ],
                        valueName: 'warningNum'
                    }
                ],
                energyList: [],  // 能耗统计
                energyLine: [
                    {
                        lineName: '左洞能耗值',
                        lineColor: [ '#3aa1ff' ],
                        valueName: 'leftEnergy'
                    },
                    {
                        lineName: '右洞能耗值',
                        lineColor: [ '#4ecb73' ],
                        valueName: 'rightEnergy'
                    }
                ],
                eventList: [], // 事件统计
                energyBar: [
                    {
                        barName: '发生事件数',
                        barColor: [ '#3aa1ff' ],
                        valueName: 'happendEvent'
                    },
                    {
                        barName: '已处理事件数',
                        barColor: [ '#4ecb73' ],
                        valueName: 'dealEvent'
                    }
                ],
                active: 0,
                tabs: [ '故障(预警）设备数量', '事件发生处理情况', '能耗值情况统计' ]
            };
        },
        mounted () {
            this.id = this.tunnelId || this.$route.query.tunnelId;
            let currentTimes = new Date().getTime();
            // 默认最近7天
            this.searchForm.date = [ this.formatDate(currentTimes - 7 * 24 * 3600 * 1000), this.formatDate(currentTimes) ];
            this.choseTabs(0);
        },
        methods: {
            doSearch () {
                this.choseTabs(this.active);
            },
            choseTabs (i) {
                this.active = i;
                if (i == 0) {
                    this.drawErrorLine();
                } else if (i == 1) {
                    this.drawEventBar();
                } else if (i == 2) {
                    this.drawEngerLine();
                }
            },
            // 事件发生处理情况
            drawEventBar () {
                let parms = {
                    startDate: this.searchForm.date && this.searchForm.date[ 0 ] || '',
                    endDate: this.searchForm.date && this.searchForm.date[ 1 ] || '',
                    tunnelId: this.id
                };
                // parms.startDate = "";
                // parms.endDate = "";
                // parms.tunnelId = "";
                this.$service.energy.getTunnelenEventListByDay(parms).then(res => {
                    this.eventList = res || [];
                });
            },
            // 能耗值情况统计
            drawEngerLine () {
                let parms = {
                    startDate: this.searchForm.date && this.searchForm.date[ 0 ] || '',
                    endDate: this.searchForm.date && this.searchForm.date[ 1 ] || '',
                    tunnelId: this.id
                };
                this.$service.energy.getTunnelenElenergyListByDay(parms).then(res => {
                    this.energyList = res || [];
                });
            },
            //  故障预警设备数量
            drawErrorLine () {
                let parms = {
                    startDate: this.searchForm.date && this.searchForm.date[ 0 ] || '',
                    endDate: this.searchForm.date && this.searchForm.date[ 1 ] || '',
                    tunnelId: this.id
                };
                this.$service.energy.getTunnelenFailureAndWarningListByDay(parms).then(res => {
                    this.sbgzCharts = res || [];
                });
            },
            formatDate (time = 0) {
                let date = new Date(time);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                month = (month + '').padStart(2, '0');
                let day = date.getDate();
                day = (day + '').padStart(2, '0');
                return year + '-' + month + '-' + day;
            }
        }
    };
</script>

<style scoped lang="less">
    .tunnel-chart {
        height: 612px;
        overflow: hidden;

        &-header {
            display: flex;
            justify-content: space-between;

            .search-btn {
                margin: 0 15px;
            }

            &-row {
                flex: 1;
                height: 53px;
                display: flex;
                align-items: center;

                &-item {
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    height: 53px;
                    padding: 0 20px;
                    color: #5391F3;
                    margin-left: -2px;
                    cursor: pointer;
                }

                .active-tab {
                    background-color: rgba(12, 34, 83, 1);
                    height: 53px;
                    border: 1px solid rgba(34, 76, 151, 1);
                    border-bottom: none;
                    border-top: none;
                }
            }

            &-left {
                flex: 3;
                border: 1px solid;
                border-image: linear-gradient(90deg, rgba(37, 52, 134, 1), rgba(37, 52, 134, 0.2)) 1 1;
            }
        }
    }
</style>