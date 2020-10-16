<template>
    <!--仪表盘 图表-->
    <div>
        <div class="gauge-chart"
             :id="chartId"></div>
    </div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        name: 'gauge-charts',
        props: {
            //唯一id
            chartId: String,
            gaugeItem: {
                type: Object,
                default: {}
            },
            color: String
        },
        watch: {
            gaugeItem: {
                handler (newObj, oldObj) {
                    if (newObj) {
                        this.gaugeItem = newObj;
                        this.drawLine();
                    }
                },
                deep: true
            }
        },
        mounted () {
            this.drawLine();
        },
        methods: {
            drawLine () {
                let gaugeChart = echarts.init(document.getElementById(this.chartId));
                let _this = this;
                gaugeChart.setOption({
                    series: [ {
                        name: 'Indicator',
                        type: 'gauge',
                        detail: {
                            formatter: _this.gaugeItem.sumCount + '个',
                            offsetCenter: [ 0, '28%' ],//值位移
                            color: '#FFFFFF',
                            fontSize: 20
                        },
                        data: [ {
                            value: _this.gaugeItem.sumCount > 100 ? 100 : _this.gaugeItem.sumCount
                            // name: "Percent"
                        } ],
                        radius: '80%',
                        startAngle: 180,
                        endAngle: 0,
                        clockwise: true,
                        splitLine: {
                            show: true
                        },
                        axisTick: {
                            show: true
                        },
                        axisLabel: {
                            show: true,
                            color: '#FFFFFF',
                            backgroundColor: null
                        },
                        pointer: {
                            show: true,
                            length: '56%',
                            width: 10
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: [ [ 0.2, '#91c7ae' ], [ 0.8, this.color || '#63869e' ], [ 1, '#c23531' ] ],
                                width: 50
                            }
                        }
                    } ]
                });
            }
        }
    };
</script>

<style scoped>
    .gauge-chart {
        height: 300px;
        width: 100%;
    }
</style>