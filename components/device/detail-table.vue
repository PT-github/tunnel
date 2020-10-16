<template>
    <div class="device-table-ctn">
        <titleCom title="基本信息"></titleCom>
        <table class="table-ctn1" border="1px" cellspacing="0">
            <tr>
                <th class="th-title">设备名称</th>
                <th class="th-value">{{deviceDetail.deviceName}}</th>
                <th class="th-title">设备编码</th>
                <th class="th-value">{{deviceDetail.deviceCode}}</th>
            </tr>
            <tr>
                <th class="th-title">设备类型</th>
                <th class="th-value">{{deviceDetail.deviceTypeName}}</th>
                <th class="th-title">所属分类</th>
                <th class="th-value">{{deviceDetail.bookClassifyName}}</th>
            </tr>
            <tr>
                <th class="th-title">路段</th>
                <th class="th-value">{{deviceDetail.belongRoad}}</th>
                <th class="th-title">设备IP</th>
                <th class="th-value">{{deviceDetail.deviceIP}}</th>
            </tr>
            <tr>
                <th class="th-title">所属隧道</th>
                <th class="th-value">{{deviceDetail.belongTunnel}}</th>
                <th class="th-title">左右洞标识</th>
                <th class="th-value">{{deviceDetail.leftRightFlagName}}</th>
            </tr>
            <tr>
                <th class="th-title">设备残值</th>
                <th class="th-value">{{deviceDetail.deviceHealthPercent}}</th>
                <th class="th-title">使用年限</th>
                <th class="th-value">{{deviceDetail.employDeadline}}</th>
            </tr>
            <tr>
                <th class="th-title">通讯状态</th>
                <th class="th-value">{{deviceDetail.deviceCommunicationsStateName}}</th>
                <th class="th-title">设备状态</th>
                <th class="th-value">{{deviceDetail.deviceEmployStateName}}</th>
            </tr>
            <tr>
                <th class="th-title">备注信息</th>
                <th class="th-value2" colspan="3">{{deviceDetail.reamrks}}</th>
            </tr>
        </table>
        <titleCom title="设备信息"></titleCom>
        <table class="table-ctn1" border="1px" cellspacing="0">
            <tr>
                <th class="th-title">安装位置</th>
                <th class="th-value">{{deviceDetail.leftRightFlagName}}</th>
                <th class="th-title">安装方位</th>
                <th class="th-value">{{deviceDetail.orientationLocationName}}</th>
            </tr>
            <tr>
                <th class="th-title">设备厂商</th>
                <th class="th-value">{{deviceDetail.deviceVender}}</th>
                <th class="th-title">设备型号</th>
                <th class="th-value">{{deviceDetail.deviceModel}}</th>
            </tr>
            <tr>
                <th class="th-title">设备单位</th>
                <th class="th-value" >{{deviceDetail.deviceUnit}}</th>
                <!-- <th class="th-title">设备IP</th>
                <th class="th-value">{{deviceDetail.deviceIP}}</th> -->
            </tr>
        </table>
    </div>
</template>

<script>
    import titleCom from '../../components/index/tips-title';
    export default {
        name: "detail-table",
        props:{
            deviceDetail:Object
        },
        components:{titleCom}
    }
</script>

<style scoped lang="less">
    .device-table-ctn{
        width: 100%;
        .table-ctn1{
            height: 50px;
            width: 100%;
            border-radius: 4px;
            border-collapse:collapse;
            margin-top: 30px;
            margin-bottom: 30px;
            table-layout:fixed;
            tr th{border: 1px solid #337CF3}
            .th-title{
                height: 50px;
                width: 158px;
                background:#123A84;
                font-size:16px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #FFFFFF;
            }
            .th-value{width: calc((100% - 316px) / 2);}
            .th-value,.th-value2{
                padding-left: 24px;
                height: 50px;
                font-size:16px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                text-align: left;
                color: #FFFFFF;
            }
        }
    }
</style>