<template>
    <div>
        <table class="table-ctn2" border="1px" cellspacing="0">
            <tr class="tr-user-ctn">
                <th colspan="7">
                    <div class="user-info">
                        <div class="user">
                            <div class="user-head">
                                <img v-if="data.userHeadImage" :src="data.userHeadImage" alt="">
                            </div>
                            <div class="user-text">
                                <div class="user-name">{{data.createdUserName}}</div>
                                <div class="user-date">执行时间: {{data.createdUserDate}}</div>
                            </div>
                        </div>
                        <div class="user-done">
                            {{data.executeInstructions}}
                        </div>
                    </div>
                </th>
            </tr>
            <tr class="ctn2-t">
                <th>设备名称</th>
                <th>所属隧道</th>
                <th>安装位置</th>
                <th>桩号</th>
                <th>设备类型</th>
                <th>执行操作</th>
                <th>是否执行</th>
            </tr>
            <tr class="ctn2-v"
                v-for="device in data.temergencyplanitemVO"
                v-if="data.temergencyplanitemVO && data.temergencyplanitemVO.length">
                <th>{{device.deviceName}}</th>
                <th>{{device.tunnelName}}</th>
                <th>{{device.leftRightFlagName}}</th>
                <th>{{device.pileNumber}}</th>
                <th>{{device.deviceTypeName}}</th>
                <th>{{device.operateValue}}</th>
                <th>{{device.isItImplemented==1?'是':'否'}}</th>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "pain-table",
        props:{
            data:Object
        }
    }
</script>

<style scoped lang="less">
    .table-ctn2{
        width: 100%;
        border-radius: 4px;
        border-collapse:collapse;
        margin-top: 30px;
        margin-bottom: 30px;
        table-layout:fixed;
        tr th{
            border:1px solid #224C97;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            color: #C1D9FF;
            height: 50px;
        }
        .ctn2-t th{
            width: calc((100% - 640px) / 4);
            background: #0C2253;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            color: #5391F3;
        }
        .ctn2-t th:nth-child(6){width: 404px !important;}
        .ctn2-v th{
            color: #C1D9FF;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
        }
        .th-title{
            height: 50px;
            width: 200px;
            background:#0C2253;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            color: #5391F3;
        }
        .tr-user-ctn{
            height: 106px;
            background: #0C2253;
            .user-info{
                // height: 142px;
                padding-bottom: 10px;
                width: 100%;
                text-align: left;
                .user{
                    margin-left: 16px;
                    margin-top: 16px;
                    display: flex;
                    align-items: center;
                    .user-head{
                        position: relative;
                        overflow: hidden;
                        height: 48px;
                        width: 48px;
                        border-radius: 50%;
                        img{height: 100%;width: 100%}
                    }
                    .user-text{
                        margin-left: 16px;
                        font-size:14px;
                        font-family:PingFangSC-Regular,PingFang SC;
                        font-weight:400;
                        color: #C1D9FF;
                        .user-date{margin-top: 2px}
                    }
                }
                .user-done{
                    margin-top: 20px;
                    margin-left: 16px;
                    font-size:16px;
                    font-family:PingFangSC-Regular,PingFang SC;
                    font-weight:400;
                    color: #C1D9FF;
                }
            }
        }
    }
</style>