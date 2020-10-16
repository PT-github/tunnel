<template>
    <div class="tunnel-info block">
        <div class="tunnel-info-header">
            <div class="flex-row">
                <img class="tunnel-info-header-img" 
                    :src="require('@/assets/images/home/tunnel.png')" alt="">
                <div class="tunnel-info-header-title">{{info.tunnelName}}</div>
            </div>
            <div class="flex-row">
                <div class="tunnel-info-header-tips" v-if="info.leftHoleLength">左洞：{{info.leftHoleLength||0}}米</div>
                <div class="tunnel-info-header-tips" v-if="info.rightHoleLength">右洞：{{info.rightHoleLength||0}}米</div>
            </div>
        </div>
        <div class="tunnel-info-content">
            <div  class="tunnel-info-content-img" >
                <img :src="info.tunnelPictureUrl" alt="">
            </div>
            <div class="tunnel-info-content-table">
                <div class="border-row">
                    <div class="tunnel-info-content-table-title">所属地区</div>
                    <div class="tunnel-info-content-table-value">{{info.cityName||info.provinceName}}</div>
                </div>
                <div class="border-row">
                    <div class="tunnel-info-content-table-title">所属路段</div>
                    <div class="tunnel-info-content-table-value">{{info.belongsStretch||'-'}}</div>
                </div>
                <div class="border-row">
                    <div class="tunnel-info-content-table-title">隧道类型</div>
                    <div class="tunnel-info-content-table-value">{{info.tunnelTypeName||'-'}}</div>
                </div>
                <div class="border-row">
                    <div class="tunnel-info-content-table-title">管理单位</div>
                    <div class="tunnel-info-content-table-value">{{info.organizationName||'-'}}</div>
                </div>
                
            </div>
        </div>
        <div class="tunnel-info-mark">
            <div class="tunnel-info-mark-left">起止桩号</div>
            <div class="tunnel-info-mark-right">K{{info.startStakeMarkKm}}+{{info.startStakeMarkM}} ~ K{{info.endStakeMarkKm}}+{{info.endStakeMarkM}}</div>
        </div>
        <div class="flex-aciton">
            <el-button type="primary" icon="el-icon-share" @click="goDetail(info)">详情</el-button>
            <el-button type="primary" icon="el-icon-edit" @click="goEdit(info)" v-auth="'/rest/TunnelInfo/edit'">编辑</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            info:{
                type:Object,
                default:()=>{
                    return {}
                }
            }
        },
        data(){
            return{
            }
        },
        methods:{
            goEdit(info){
                this.$router.push({
                    path: '/tunnel/add-tunnel?type=edit&from=1&id='+info.id
                });
            },
            goDetail(info){
                this.$router.push({
                    path: '/tunnel/detail?tunnelId='+info.id
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .tunnel-info{
        width: 100%;
        height: 470px;
        margin-right: 22px;
        margin-bottom: 22px;
        .flex-row{
            display: flex;
            align-items: center;
        }
        &-header{
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(34,76,151,1);
            padding: 0 20px;
            margin-bottom: 20px;
            &-img{
                height: 30px;
                width: 30px;
            }
            &-title{
                padding-left: 10px;
                font-size:20px;
                font-family:PingFang-SC-Bold,PingFang-SC;
                font-weight:bold;
                color: #C1D9FF;
            }
            &-tips{
                padding-left: 10px;
                font-size:16px;
                color: #5391F3;
            }
        }
        &-content{
            height: 240px;
            display: flex;
            margin: 0 15px;
            border: 1px solid rgba(34,76,151,1);
            &-img{
                flex: 1;
                flex-shrink: 0;
                height: 100%;
                border-bottom: 1px solid rgba(34,76,151,1);
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            &-table{
                flex: 1;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                font-size:16px;
                .border-row {
                    display: flex;
                    align-items: center;
                    height: 60px;
                }
                &-title{
                    flex: 1;
                    color: #5391F3;
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                    border-bottom: 1px solid #224C97;
                    border-left: 1px solid rgba(34,76,151,1);
                }
                &-value{
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                    background-color: rgba(18,58,132,.8);
                    flex: 1.5;
                    color: #C1D9FF;
                    border-bottom: 1px solid #224C97;
                }
            }
        }
        &-mark{
            display: flex;
            align-items: center;
            height: 60px;
            margin: 0 15px;
            border-right: 1px solid rgba(34,76,151,1);
            border-left: 1px solid rgba(34,76,151,1);
            font-size:16px;
            &-left{
                height: 60px;
                line-height: 60px;
                width: 104px;
                border-right: 1px solid rgba(34,76,151,1);
                text-align: center;
                color: #5391F3;
            }
            &-right{
                padding-left: 10px;
                color: #C1D9FF;
            }
        }
        .flex-aciton{
            border-top: 1px solid rgba(34,76,151,1);
            margin: 0 15px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height:70px;
        }
    }
</style>