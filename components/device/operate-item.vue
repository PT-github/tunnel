<template>
    <el-card class="el-card" v-if="data">
        <div class="cz-item-ctn">
            <div class="cz-t">
                <div class="user-image" v-if="data.headImage">
                    <img :src="data.headImage" alt="">
                </div>
                <div class="user-info">
                    <div class="name">{{data.createdUserName}}</div>
                    <div class="date">{{data.createdUserDate|formatTime}}</div>
                </div>
            </div>
            <div class="cz-c">
               {{data.logContent}}
            </div>
            <div class="cz-b">
                <div class="cz-b-item">设备名称：{{data.deviceName}}</div>
                <div class="cz-b-item">设备类型：{{data.deviceTypeName}}</div>
                <div class="cz-b-item">设备桩号：{{data.strPileNumber}}</div>
            </div>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "operate-item",
        props:{
            data:{
                type:Object,
                default:{}
            }
        },
        filters:{
            formatTime(dateStr=""){
                return dateStr.substring(0,16)
            },
        }
    }
</script>

<style scoped lang="less">
    .el-card{
        background:rgba(18,58,132,1);
        border-radius:4px;
        border: none;
    }
    .cz-item-ctn{
        .cz-t{
            height: 60px;
            display: flex;
            align-items: center;
            .user-image{
                height: 60px;
                width: 60px;
                border-radius: 50%;
                position: relative;
                overflow: hidden;
                img{height: 100%;width: 100%}
            }
            .user-info{
                text-align: left;
                margin-left: 16px;
                font-size:14px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #C1D9FF;
                .name,.date{margin-top: 8px}
            }
        }
        .cz-c{
            text-align: left;
            margin-top: 18px;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color: #C1D9FF;
        }
        .cz-b{
            margin-top: 18px;
            display: flex;
            align-items: center;
            .cz-b-item:first-child{margin-left: 0px}
            .cz-b-item{
                margin-left: 15px;
                font-size:14px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #5391F3;
            }
        }
    }
</style>