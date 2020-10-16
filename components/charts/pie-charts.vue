<template>
    <!--扇形图 图表-->
    <div>
        <div class="pie-chart"
             :style="{height:chartHeight}"
             id="pieChart"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "pie-charts",
        props:{
            preList:Array,
            chartHeight:String
        },
        watch:{
            preList:{
                handler(newArr,oldObj){
                    this.drawLine()
                },
                deep: true
            }
        },
        mounted(){
            this.drawLine()
        },
        methods:{
            drawLine(){
                let myChart = echarts.init(document.getElementById('pieChart'))
                let {PieDate,AlldeviceBase} = this.getSelectPreArray(this.preList)
                myChart.setOption({
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c}个 ({d}%)"
                    },
                    legend: {
                        x: "right",
                        top : "83%",
                        textStyle: {
                            color: "#92CCFA", // 图例文字颜色
                            fontSize: 12
                        },
                        data: AlldeviceBase.devices
                    },
                    series: {
                        name: "半径模式",
                        color: [
                            "#5830E3",
                            "#2D5BE3",
                            "#02DDE3",
                            "#84DD35",
                            "#845B0A",
                            "#DBB20A",
                            "#CC3333",
                            "#DB5B0A"
                        ],
                        type: "pie",
                        top: -120,
                        radius: ["20%", " 80%"],
                         center: ["50%", "40%"],
                        roseType: "radius",
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                // show: true
                            }
                        },
                        data: PieDate
                    }
                })
            },
            getSelectPreArray(list){
                let PieDate = [];
                let AlldeviceBase = {
                    deviceNum: [],
                    devices: []
                }
                list.forEach(item => {
                    PieDate.push({
                        value: item.sumDeviceCount||0,
                        name: item.deviceTypeName
                    })
                    AlldeviceBase.deviceNum.push(item.sumDeviceCount||0)
                    AlldeviceBase.devices.push(item.deviceTypeName||'')
                });
                return {
                    PieDate,AlldeviceBase
                }
            }
        }
    }
</script>

<style scoped>
    .pie-chart{
        width: 100%;
    }
</style>