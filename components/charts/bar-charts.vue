<template>
    <!--动态配置柱形图 图表-->
    <div>
        <div class="bar-chart"
             :style="{height:chartHeight}"
             id="barChart"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "bar-charts",
        props:{
            barList:Array,
            option:Array,
            chartHeight:String,
            xName:{
                type:String,
                default:()=>{
                    return "month"
                }
            }
        },
        watch:{
            barList:{
                handler(newObj,oldObj){
                    if(newObj){
                        this.barList = newObj
                        this.drawLine()
                    }
                },
                deep: true
            }
        },
        mounted(){
            this.drawLine()
        },
        methods:{
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let {titleList,dateList,service} = this.getSelectBarArray(this.barList)
                let myChart = echarts.init(document.getElementById('barChart'))
                let _this = this
                // 绘制图表
                myChart.setOption({
                    title: {

                    },
                    legend:{
                       data:titleList,
                        bottom:0,
                        textStyle: {
                            color: '#FFFFFF',  // 图例文字样式
                            fontFamily:'PingFangSC-Regular',
                            fontSize: 16,
                        },
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (datas) {
                            let res =''
                            res += datas[0].name+'<br/>'
                            for (var i = 0, length = datas.length; i < length; i++) {
                                res += datas[i].seriesName + '：'+datas[i].data.value + '<br/>'
                            }
                            return res
                        },
                        axisPointer:{
                            type: 'none'
                        }
                    },
                    grid: {
                        x:  100,
                        x2: 56,
                        y: 50,
                    },
                    xAxis: {
                        show:true,
                        data: dateList,
                        nameLocation:'middle',
                        axisLabel: {
                            textStyle: {
                                color: '#FFFFFF',//坐标值样式
                                fontSize: '16',
                                fontFamily: 'PingFangSC-Regular',
                            },
                            interval:0,
                            formatter: function (datas) {
                                return datas
                            }
                        },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'#e9e9e9',
                                width:1,
                                type:'dashed',
                            },
                        },
                        axisTick:{					//---坐标轴 刻度
                            show:false,					//---是否显示
                        },
                        splitArea:{					//---grid 区域中的分隔线
                            interval:3,
                        },

                        boundaryGap: true,
                    },
                    yAxis: {
                        axisLabel : {
                            formatter: '{value}',
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['#e9e9e9'],
                                width: 1,
                                type: 'dashed'
                            }
                        },
                        //y轴刻度条
                        axisLine:{
                            show:false,
                            lineStyle:{
                                color:'#e9e9e9',
                                width:1,
                                type:'dashed',
                            },
                        },
                        axisTick:{					//---坐标轴 刻度
                            show:false,					//---是否显示
                        },
                    },
                   /* dataZoom : [
                        {
                            type: 'inside',// 内置于坐标系中
                            /!*start: 0,
                            end: 100,*!/
                            xAxisIndex: [0],
                            startValue: 0, //默认展示8条
                            endValue:8,
                            zoomLock:true,      //是否缩放
                        }
                    ],*/
                    series: service
                });
            },
            getSelectBarArray(list){
                //共有日期
                let dateList = []//日期
                list && list.length && list.forEach((item,index) =>{
                    dateList.push(item[this.xName])
                })

                //条数
                let service = []
                //title
                let titleList = []
                this.option.forEach(item =>{
                    //值
                    let valList = []
                    //title
                    titleList.push(item.barName)

                    list && list.length && list.forEach((i,index) =>{
                        valList.push({
                            value:i[item.valueName],})
                    })
                    service.push({
                        name:item.barName,
                        type: 'bar',				//---类型
                        legendHoverLink:true,		//---是否启用图例 hover 时的联动高亮
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        },
                        itemStyle:{					//---图形形状
                            //圆柱颜色
                            color:item.barColor
                            /* normal:{
                                 label: {
                                     formatter: "{c}"+"%",
                                     show: true,
                                     position: "top",
                                 },
                             }*/
                        },
                        barWidth:'24',				//---柱形宽度
                        data: valList,
                    })
                })
                return {
                    titleList,dateList,service
                }
            }
        }
    }
</script>

<style scoped>
    .bar-chart{
       /* height: 544px;*/
        width: 100%;
    }
    .chart-legend{

    }
</style>