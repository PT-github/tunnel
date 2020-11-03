<template>
    <div class="light-info block">
        <!-- selectOptions[code||'hunan'] -->
        <tipsTitle :title="'隧道上月节能率统计排行'"/>
        <div id="lineInfo"></div>
    </div>
</template>
<script>
    import tipsTitle from '~/components/index/tips-title';
    import echarts from 'echarts';

    export default {
        services: [ 'home' ],
        components: {tipsTitle},
        props: {
            code: {
                type: String,
                default: () => {
                    return 'hunan';
                }
            }
        },
        watch: {
            // code(val,oldv) {
            //     if(val == 'hunan'){
            //       this.initData(this.list)
            //     }else{
            //       let listArr = [];
            //       this.list.forEach(item=>{
            //         if(item.city ==val ){
            //           listArr.push(item)
            //         }
            //       })
            //       this.initData(listArr)
            //     }
            // }
        },
        data () {
            return {
                tunnelId: null,
                xAxisData: [],
                seriesData: [],
                list: []
            };
        },
        async mounted () {
            this.tunnelId = this.$route.query.tunnelId || null;
            this.list = await this.$service.home.getHomeStatEnergyRate(this.tunnelId) || [];
            this.initData(this.list);
        },
        methods: {
            initData (list) {
                let x = [], y = [];
                list.forEach(item => {
                    x.push(item.tunnelName);
                    y.push(item.energyRate);
                });
                // x.length > 3 ? x.length = 3 : '';
                // y.length > 3 ? y.length = 3 : '';
                this.xAxisData = x || [];
                this.seriesData = y || [];
                this.init();
            },
            init () {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('lineInfo'));
                // 指定图表的配置项和数据
                let option = {
                    grid: {
                        x: 30,
                        x2: 10,
                        y: 20
                    },
                    title: {
                        show: false
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{c}% ',
                        borderColor: '#66BEFF',
                        backgroundColor: '#1B4A81',
                        borderWidth: 1
                    },
                    toolbox: {
                        show: false
                    },
                    xAxis: {
                        type: 'bar',
                        data: this.xAxisData,
                        offset: 0, // x轴相对于默认位置的偏移
                        splitLine: {
                            //去除网格线
                            show: false
                        },
                        axisTick: {
                            //y轴刻度线
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#183D72'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                //改变刻度字体样式
                                color: '#92CCFA'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            //y轴
                            show: false
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: [ '#183D72' ],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        offset: 0, // x轴相对于默认位置的偏移
                        axisTick: {
                            //y轴刻度线
                            show: true
                        },
                        axisLabel: {
                            textStyle: {
                                //改变刻度字体样式
                                color: '#92CCFA'
                            }
                        }
                    },
                    series: [
                        {
                            smooth: true,
                            name: '邮件营销',
                            type: 'line',
                            stack: '总量',
                            symbol: 'none',
                            lineStyle: {
                                // 系列级个性化折线样式
                                width: 2,
                                type: 'solid',
                                color: '#3E74A8' //线条渐变色
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        {offset: 0, color: '#0E3B6D'},
                                        {offset: 1, color: '#0B1236'}
                                    ])
                                }
                            },
                            data: this.seriesData
                        }
                    ]
                };
                let optons1 = {
                    color: [ '#0E3B6D' ],
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{c}% ',
                        borderColor: '#66BEFF',
                        backgroundColor: '#1B4A81',
                        borderWidth: 1
                    },
                    grid: {
                        x: 30,
                        x2: 10,
                        y: 20
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.xAxisData,
                            axisTick: {
                                alignWithLabel: true
                            },
                            offset: 0, // x轴相对于默认位置的偏移
                            splitLine: {
                                //去除网格线
                                show: false
                            },
                            axisTick: {
                                //y轴刻度线
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#183D72'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    //改变刻度字体样式
                                    color: '#92CCFA'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            offset: 0, // x轴相对于默认位置的偏移
                            splitLine: {
                                //去除网格线
                                show: false
                            },
                            axisTick: {
                                //y轴刻度线
                                show: false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#183D72'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    //改变刻度字体样式
                                    color: '#92CCFA'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            data: this.seriesData
                        }
                    ]

                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(optons1);
            }
        }
    };
</script>
<style lang='less' scoped>
    .light-info {
        padding: 20px;
        height: 342px;
        width: 442px;

        #lineInfo {
            height: 322px;
            width: 422px;
        }
    }
</style>
