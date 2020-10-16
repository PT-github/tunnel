<template>
    <div>
        <div class="chart" id="chart"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        name: "index-line-chart",
        props:{
            indexLineData:Array,
            valueName:String,       //值的属性名
        },
        watch:{
            indexLineData:{
                handler(newObj,oldObj){
                    if(newObj){
                        this.indexLineData = newObj
                        this.drawLine()
                    }
                },
                deep: true
            }
        },
        mounted () {
            this.drawLine()
        },
        methods:{
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let {valList,titleList} = this.getSelectLineArray(this.indexLineData)
                this.chart = echarts.init(document.getElementById('chart'))
                window.addEventListener('resize',() => { this.chart.resize(); });
                //或
                window.onresize = this.chart.resize;
                // 绘制图表
                this.chart.setOption({
                    grid: {
                        x:  50,
                        x2: 56,
                        y: 20,
                    },
                    //x轴
                    xAxis:{
                        data:titleList,
                        axisLabel: {
                            textStyle: {
                                color: '#FFFFFF',//坐标值样式
                                fontSize: '16px',
                                fontFamily: 'Roboto-Bold,Roboto',
                                fontWeight:'bold'
                            },
                            interval:0,
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
                    //数据-data是最终要显示的数据
                    series:[{
                        name:'销量',
                        type:'line',
                        data:valList,
                        smooth: true,
                        symbol: 'none',     //不展示折线图的点
                        itemStyle: {
                            normal: {
                                borderColor: '',
                                borderWidth: 2,
                                borderType: 'solid',
                                areaStyle: {
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
                                },
                                lineStyle: {
                                    width: 2,
                                    color: '#1890FF'
                                }
                            }
                        },
                    }]
                });
            },
            getSelectLineArray(list){
                let valList =[],
                    titleList = []
                list && list.length && list.forEach(item =>{
                    titleList.push(item.month)  //月份
                    valList.push(item[this.valueName]?item[this.valueName] : 0)   //活跃值
                })
                return {
                    valList,titleList
                }
            }
        }
    }
</script>

<style scoped>
    .chart{
        height: 400px;
        width: 100%;
    }
</style>