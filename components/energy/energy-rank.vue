<template>
    <div class="l-item-c">
        <div class="order flex-center"
             :class="{'one':rank==1,'two':rank==2,'three':rank==3}">
            {{rank}}
        </div>
        <div class="item-r">
            <div class="item-r-t">
                <div class="item-title">
                    <span class="s1">{{data.tunnelName}}</span>
                    <span class="s2">{{data.belongsStretch}}</span>
                </div>
                <div class="value">{{data.energy}}</div>
            </div>
            {{data.dataPermissionSql}}
            <div class="item-r-b">
                <el-progress :percentage="data.percent"
                             :show-text="false"
                             color="#337CF3"></el-progress>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "energy-rank",
        props:{
            rank:[Number,String],
            data:{
                type:Object,
                default:{}
            }
        }
    }
</script>

<style scoped lang="less">
    .flex-center{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .l-item-c{
        height: 74px;
        width: 100%;
        background: #0C2253;
        border: 1px solid #224C97;
        border-radius:4px;
        margin-top: 10px;
        display: flex;
        padding-left: 10px;
        padding-right: 10px;
        align-items: center;
        .one{
            background: #da1bfd !important;
        }
        .two{
            background: #8550f4 !important;
        }
        .three{
            background: #337cf3 !important;
        }
        .order{
            height: 26px;
            background: #09275f;
            border-radius: 4px;
            width: 26px;
            font-size: 18px;
            color: #ffffff;
        }
        .item-r{
            margin-left: 10px;
            width: 100%;
            .item-r-t{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .item-title{
                    display: flex;
                    align-items: center;
                    .s1{
                        font-size:16px;
                        font-family:PingFang-SC-Heavy,PingFang-SC;
                        font-weight:800;
                        color: #C1D9FF;
                    }
                    .s2{
                        font-size:14px;
                        font-family:PingFangSC-Regular,PingFang SC;
                        font-weight:400;
                        margin-left: 10px;
                        color: #5391F3;
                    }
                }
                .value{
                    font-size:14px;
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color: #C1D9FF;
                }
            }
            .item-r-b{
                margin-top: 10px;
            }
        }
    }


</style>