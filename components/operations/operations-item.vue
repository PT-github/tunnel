<template>
    <!--运维记录-->
    <div class="operations-ctn" v-if="data">
        <div class="ctn-item">
            <div class="ctn-item-title">故障时间</div>
            <div class="ctn-item-v">{{data.faultDate}}</div>
        </div>
        <div class="ctn-item">
            <div class="ctn-item-title">故障描述</div>
            <div class="ctn-item-v">{{data.cause || '-'}}</div>
        </div>
        <div class="ctn-item">
            <div class="ctn-item-title">解决方法</div>
            <div class="ctn-item-v">{{data.solution || '-'}}</div>
        </div>
        <div class="ctn-item">
            <div class="ctn-item-title">故障状态</div>
            <div class="ctn-item-v">{{data.maintenanceStatusName}}</div>
        </div>
        <div class="ctn-item">
            <div class="ctn-item-title">恢复时间</div>
            <div class="ctn-item-v">{{data.recoveryDate}}</div>
        </div>
        <div class="ctn-r-ctn">
            <div class="ctn-r-ctn" @click="$router.push(`/fault/detail?id=${data.repairId}&type=look`)">
                <i class="el-icon-video-play"></i>
                查看详情
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "operations-item",
        props:{
            data:Object
        },
    }
</script>

<style scoped lang="less">
    .operations-ctn{
        display: flex;
        align-items: center;
        width: 100%;
        background-color: #0C2253;
        border: 1px solid #224C97;
        padding-bottom: 10px;
        .ctn-item:first-child{margin-left: 83px}
        .ctn-item{
            width: calc((100% - 393px) / 5);
            height: 100px;
            .ctn-item-title{
                font-size:16px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #5391F3;
            }
            .ctn-item-v{
                font-size:16px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #C1D9FF;
            }
            .ctn-item-title,.ctn-item-v{
                display: flex;
                align-items: center;
                width: 100%;
                height: 50px;
            }
        }
        .ctn-r-ctn{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
            width: 310px;
            .ctn-r-ctn{
                display: flex;
                justify-content: center;
                align-items: center;
                font-size:12px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #C1D9FF;
                height: 30px;
                width: 88px;
                background: #337CF3;
                border-radius: 4px;
                .el-icon-video-play{
                    margin-right: 4px;
                    margin-top: 2px;
                }
            }
        }
    }
</style>