<template>
    <!--折线图 图表-->
    <div>
        <div class="line-chart"
             :style="{height:chartHeight}"
             id="lineChart"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "line-charts",
        mounted(){
            this.drawLine()
        },
        props:{
            chartHeight:String,
            lineList:Array,
            option:Array,
            xName: {
                type: String,
                default:()=>{
                    return 'month'
                }
            }
        },
        watch:{
            lineList:{
                handler(newObj,oldObj){
                    if(newObj){
                        this.lineList = newObj
                        this.drawLine()
                    }
                },
                deep: true
            }
        },
        methods:{
            drawLine(){
                let {titleList,dateList,service,colorList} = this.getSelectLineArray(this.lineList)
                let myChart = echarts.init(document.getElementById('lineChart'))
                myChart.setOption({
                    grid: {
                        x:  100,
                        x2: 56,
                        y: 50,
                    },
                    color:colorList,
                    legend:{
                        data:titleList,
                        icon: 'rectangle',
                        bottom:0,
                        textStyle: {
                            color: '#FFFFFF',  // 图例文字样式
                            fontFamily:'PingFangSC-Regular',
                            fontSize: 16,
                        }
                        /*
                        data:titleList,
                        bottom:0,
                        itemWidth:30,
                        color:['#3aa1ff'],
                        textStyle: {
                            color: '#FFFFFF',  // 图例文字样式
                            fontFamily:'PingFangSC-Regular',
                            fontSize: 16,
                        },*/
                    },
                    //x轴
                    xAxis:{
                        data:dateList,
                        axisLabel: {
                            textStyle: {
                                color: '#FFFFFF',//坐标值样式
                                fontSize: '16',
                                fontFamily: 'PingFangSC-Regular',
                            },
                            interval: 'auto'
                        },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'#1B3E6F',
                                width:1,
                                type:'solid',
                            },
                        },
                        axisTick:{					//---坐标轴 刻度
                            show:false,					//---是否显示
                        }
                    },
                    yAxis:{
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color:'#1B3E6F',
                                width:1,
                                type:'solid',
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#FFFFFF',//坐标值样式
                                fontSize: '16px',
                                fontFamily: 'Roboto-Bold,Roboto',
                                fontWeight:'bold'
                            }
                        },
                        axisTick:{					//---坐标轴 刻度
                            show:false,					//---是否显示
                        },
                        //y轴刻度条
                        axisLine:{
                            show:true,
                            lineStyle: {
                                color:'#1B3E6F',
                                width:1,
                                type:'solid',
                            }
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
                    //数据-data是最终要显示的数据
                    series:service
                });
            },
            getSelectLineArray(list){
                //共有日期
                let dateList = []//日期
                list && list.length && list.forEach((item,index) =>{
                    dateList.push(item[this.xName])
                })

                //条数
                let service = []
                //title
                let titleList = []
                //图标颜色
                let colorList = []

                this.option.forEach(item =>{
                    //值
                    let valList = []
                    //title
                    titleList.push(item.lineName)
                    //颜色
                    colorList.push(item.lineColor)

                    list && list.length && list.forEach((i,index) =>{
                        valList.push({
                            value:i[item.valueName],})
                    })
                    service.push({
                        name:item.lineName,
                        type:'line',				//---类型
                        legendHoverLink:true,
                        showBackground: true,
                        smooth: false,//是否曲线
                       backgroundStyle: {
                            color: 'rgba(220, 220, 220, 0.8)'
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '',
                                borderWidth: 2,
                                borderType: 'solid',
                                /*areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops:
                                            [
                                                {offset: 1, color: 'rgba(24,144,255,0.5)'},
                                                {offset: 1, color: 'rgba(24,144,255,0.1)'}
                                            ]
                                    }
                                },*/
                                lineStyle: {
                                    width: 2,
                                    color: item.lineColor
                                }
                            }
                        },
                        data: valList,
                    })
                })
                return {
                    titleList,dateList,service,colorList
                }
            }
        }
    }
</script>

<style scoped>
    .line-chart{
        width: 100%;
    }
</style>