<template>
    <form-page class="tunnel" :breadcrumb="[{name:'隧道管理',path:'/tunnel'},{name:'隧道详情'}]">
        <div class="tunnel-header block">
            <div class="tunnel-row">
                <img class="tunnel-header-img" 
                    :src="require('@/assets/images/home/tunnel.png')" alt="">
                <div class="tunnel-header-title">{{tunnelDetail.tunnelName}}</div>
            </div>
            <div class="tunnel-header-top">
                <span class="tunnel-tips" v-if="tunnelDetail.leftHoleLength">左洞：</span>
                <span class="tunnel-value" v-if="tunnelDetail.leftHoleLength">{{tunnelDetail.leftHoleLength}}米</span>
                <span class="tunnel-tips" v-if="tunnelDetail.rightHoleLength">右洞：</span>
                <span class="tunnel-value" v-if="tunnelDetail.rightHoleLength">{{tunnelDetail.rightHoleLength}}米</span>
            </div>
        </div>
        <!-- 隧道详细信息 -->
        <div class="tunnel-info block">
            <div class="tunnel-row">
                <div  class="tunnel-info-item" >
                    <img class="tunnel-info-item-img" :src="tunnelDetail.tunnelPictureUrl" alt="">
                </div>
                <div  class="tunnel-info-item" >
                    <div class="tunnel-row tunnel-border">
                        <div class="tunnel-info-item-tips">所属地区</div>
                        <div class="tunnel-info-item-value">{{tunnelDetail.cityName||tunnelDetail.provinceName}}</div>
                    </div>
                    <div class="tunnel-row tunnel-border">
                        <div class="tunnel-info-item-tips">所属路段</div>
                        <div class="tunnel-info-item-value">{{tunnelDetail.belongsStretch||'-'}}</div>
                    </div>
                    <div class="tunnel-row tunnel-border">
                        <div class="tunnel-info-item-tips">隧道类型</div>
                        <div class="tunnel-info-item-value">{{tunnelDetail.tunnelTypeName||'-'}}</div>
                    </div>
                    <div class="tunnel-row tunnel-border">
                        <div class="tunnel-info-item-tips">管理单位</div>
                        <div class="tunnel-info-item-value">{{tunnelDetail.organizationName||'-'}}</div>
                    </div>
                    <div class="tunnel-row tunnel-border">
                        <div class="tunnel-info-item-tips">限速</div>
                        <div class="tunnel-info-item-value">{{tunnelDetail.speedLimit}}KM/小时</div>
                    </div>
                    <div class="tunnel-row tunnel-border">
                        <div class="tunnel-info-item-tips">起止桩号</div>
                        <div class="tunnel-info-item-value">K{{tunnelDetail.startStakeMarkKm}}+{{tunnelDetail.startStakeMarkM}} ~ K{{tunnelDetail.endStakeMarkKm}}+{{tunnelDetail.endStakeMarkM}}</div>
                    </div>
                </div>
                <div class="tunnel-info-item">
                    <div style="width:100%;height:100%;border-bottom:1px solid #224C97;" ref="mapsDetail"></div>
                </div>
            </div>
            <div class="tunnel-info-remark">
                 <span class="tunnel-tips">隧道说明：</span>
                <span class="tunnel-value">{{tunnelDetail.tunnelDescribe||""}}</span>
            </div>
        </div>
        <div class="tunnel-bottom">
            <tunnelDetailChart class="tunnel-count-chart block" :tunnelId="tunnelId"></tunnelDetailChart>
            <tunnelDetailCate class="tunnel-count-cate block" :tunnelId="tunnelId"></tunnelDetailCate>
        </div>
    </form-page>
</template>

<script>
    import tunnelDetailChart from '../../components/tunnel/tunnel-detail-chart';
    import tunnelDetailCate from '../../components/tunnel/tunnel-detail-cate';
    import echarts from "echarts";
    export default {
        services: [ 'tunnel', 'basic'],
        components:{tunnelDetailChart,tunnelDetailCate},
        data () {
            return {
                tunnelId: "",
                tunnelDetail:{}
            };
        },
        async mounted(){
            this.tunnelId = this.$route.query.tunnelId
            this.tunnelDetail = await this.$service.tunnel.getById(this.tunnelId) || {}
            // this.getList()
            this.drawMaps(this.tunnelDetail.provinceId)
        },
        methods: {
            // 地图描点
             drawMaps(code){
                this.myChartMaps = echarts.init(this.$refs.mapsDetail);
                this.myChartMaps.showLoading();
                // let provinceMap = {
                //     320000: "jiangsu",
                //     430000: "hunan",
                //     530000:'530000'
                // }
                let mapNames = code || 'hunan';
                let res = require(`@/assets/cityMaps/${mapNames}.json`);
                echarts.registerMap(mapNames, res);
                let options = { // 图表主标题
                    title: {
                        // 文本
                        show: true,
                        // 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                        top: 25,
                        // 值: 'left', 'center', 'right' 同上
                        left: "center",
                        // 文本样式
                        textStyle: {
                            // 字体大小
                            fontSize: 18,
                            // 字体粗细
                            fontWeight: 650,
                            // 字体颜色
                            color: "#fff"
                        }
                    },
                    series: [{
                            // 类型
                            type: "map",
                            // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
                            // map: "湖南",
                            // 地图类型
                            mapType: mapNames,
                            // 是否开启鼠标缩放和平移漫游 默认不开启
                            // 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                            roam: true,
                            // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                            top: 70,
                            selectedMode: "single",
                            // 图形上的文本标签
                            label: {
                                show: true, // 是否显示对应地名
                                color: "#fff",
                            },
                            // 地图区域的多边形 图形样式
                            itemStyle: {
                                // 地图区域的颜色 如果设置了visualMap, 这个属性将不起作用
                                areaColor: "#001C41",
                                // 描边线宽 为 0 时无描边
                                borderWidth: 1,
                                // 图形的描边颜色 支持的颜色格式同 color
                                borderColor: "#124285",
                                // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                                borderType: "solid"
                            },
                            // 高亮状态
                            emphasis: {
                                // 文本标签
                                label: {
                                    // 是否显示标签
                                    show: true,
                                    // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                                    color: "#fff",
                                },
                                // 图形样式
                                itemStyle: {
                                    // 地图区域的颜色
                                    areaColor: "#0D4990"
                                }
                            },
                            // 地图系列中的数据内容数组，数组项可以为单个数值
                            markPoint: {
                                symbol: "image://" + require("@/assets/images/new/tunnel-normal.png"),
                                //数据全是markPoint
                                symbolSize: 20, // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
                                effect: {
                                    show: true,
                                    shadowBlur: 0
                                },
                                label: {
                                    show: true,
                                    position: ['-50%', -30],
                                    backgroundColor: '#fff',
                                    padding: 5,
                                    borderRadius: 5,
                                },
                                data: [
                                    {
                                        name: this.tunnelDetail.id,
                                        coord: [this.tunnelDetail.leftStartLongitude, this.tunnelDetail.leftStartLatitude],
                                        value: this.tunnelDetail.tunnelName
                                    }
                                ]
                            }
                        }
                    ]
                }
                this.myChartMaps.setOption(options);
                this.myChartMaps.hideLoading();
            },
        }
    };
</script>

<style scoped lang='less'>
    .tunnel-row{
        display: flex;
        align-items: center;
    }
    .tunnel {
        height: auto;
        margin-bottom: 20px;
        &-header{
            position: relative;
            height:112px;
            width: 100%;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #C1D9FF;
            font-size: 16px;
            &-img{
                height: 30px;
                width: 30px;
                margin-right: 10px;
            }
            &-title{
                height: 30px;
                display: flex;
                align-items: center;
                font-size:20px;
                font-family:PingFang-SC-Heavy,PingFang-SC;
                font-weight:bold;
                color: #C1D9FF;
            }
            &-top{
                padding-top: 10px;
                color: #C1D9FF;
            }
        }
        &-tips{
            color: #5391F3;
        }
        &-value{
            color: #C1D9FF;
            padding-right: 20px;
        }
       
    }
    .tunnel-info{
        margin-top: 30px;
        // width: 100%;
        // height: 440px;
        border-bottom-left-radius:6px;
        border-bottom-right-radius:6px;
        // display: flex;
        &-remark{
            padding: 16px 22px;
            font-size: 16px;
            line-height: 25px;
        }
        &-item{
            flex: 1;
            flex-shrink: 0;
            height: 360px;
            &-img{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .tunnel-border{
                height: 60px;
                border-bottom: 1px solid #224C97;
                border-right: 1px solid #224C97;
            }
            &-tips{
                width: 124px;
                flex-shrink: 0;
                height: 60px;
                line-height: 60px;
                color: #5391F3;
                text-align: center;
                border-right: 1px solid #224C97;
            }
            &-value{
                flex: 1;
                height: 60px;
                line-height: 60px;
                padding-left: 10px;
                color: #C1D9FF;
                font-size:16px;
                background:rgba(18,58,132,.7);
            }
        }
    }
    .tunnel-bottom{
        display: flex;
        align-items: center;
        margin-top: 30px;
    }
    .tunnel-count-chart{
        flex: 6.5;
        margin-right: 20px;
    }
    .tunnel-count-cate{
        flex: 3.5;
    }
</style>
