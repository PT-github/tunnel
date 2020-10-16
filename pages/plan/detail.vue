<template>
    <form-page :breadcrumb="[{name:'应急预案',path:'/plan/'},{name:'预案详情'}]">
        <div class="plan-title" slot="breadcrumb-left">
            <div class="dot" :class="{active:planDetail.planStatus===1}"></div>
            {{planDetail?` ${planDetail.planStatus===1?'已启用':'已停用'}预案提醒`:''}}
        </div>
        <div class="org">
            <div class="add-tunnel-ctn">
                <title-com title="基本信息"></title-com>
                <PlanTable :listParm="planTable"></PlanTable>

                <title-com title="预案处理内容"></title-com>
                <table class="table-ctn2" border="1px" cellspacing="0">
                    <tr class="ctn2-t">
                        <th>设备名称</th>
                        <th>所属隧道</th>
                        <th>安装位置</th>
                        <th>桩号</th>
                        <th>设备类型</th>
                        <th>执行操作</th>
                    </tr>
                    <tr class="ctn2-v"
                        v-if="planDetail.operateItem && planDetail.operateItem.length"
                        v-for="item in planDetail.operateItem">
                        <th>{{item.deviceName}}</th>
                        <th>{{planDetail.tunnelName}}</th>
                        <th>{{item.leftRightFlagName}}</th>
                        <th>{{item.pileNumber}}</th>
                        <th>{{item.deviceTypeName}}</th>
                        <th>{{item.reamrks}}</th>
                    </tr>
                </table>

                <div style="position: relative">
                    <title-com title="预案执行情况表"></title-com>
                    <div v-if="params && params.planId" style="margin-top: 20px">
                        <div class="time-screen">
                                <div>执行时间：</div>
                                <el-date-picker value-format="yyyy-MM-dd"
                                                v-model="czDate"
                                                type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                </el-date-picker>
                            <el-input class="input-width" clearable v-model="keword" placeholder="请输入关键词"></el-input>
                            <el-button type="primary" icon="el-icon-search" @click="changeCzDate">搜索</el-button>
                        </div>
                        <h-table ref="table"
                                 :options="options"
                                 :params="params">
                            <template slot="row" slot-scope="scope">
                                <plan-item :data="scope.row"></plan-item>
                            </template>
                        </h-table>
                    </div>
                </div>
            </div>
        </div>
    </form-page>
</template>

<script>
    import titleCom from '../../components/index/tips-title';
    import PlanItem from '../../components/plan/plan-item';

    import HTable from '../../components/h-table';
    import PlanTable from '../../components/c-table';

    export default {
        name: 'detail',
        components: {titleCom, PlanItem, HTable, PlanTable},
        mounted () {
            let {id} = this.$route.query;
            //查询预案详情
            this.queryPlanDetail(id);
        },
        services: [ 'plan' ],
        data () {
            return {
                planDetail: {},
                planTable: [],
                keword:"",
                params: {
                    planId: this.$route.query.id
                },  //列表其他参数
                options: {
                    search: [],
                    buttons: [],
                    table: {
                        hideHeader: true,
                        customRow: true,
                        service: 'plan',
                        func: 'queryPlanDoneList'
                    }
                },
                czDate: []  //执行时间
            };
        },
        methods: {
            queryPlanDetail (id) {
                this.$service.plan.queryPlanDetail(id).then(res => {
                    this.planDetail = res;

                    //配置表格对象
                    this.planTable = [
                        {
                            list: [
                                {
                                    value: '预案名称',
                                    isTitle: true
                                },
                                {
                                    value: this.planDetail.planName
                                },
                                {
                                    value: '所属隧道',
                                    isTitle: true
                                },
                                {
                                    value: this.planDetail.tunnelName
                                }
                            ],
                            style: {
                                textAlign: 'left',
                                paddingLeft: '20px'
                            }
                        },
                        {
                            list: [
                                {
                                    value: '预案类型',
                                    isTitle: true
                                },
                                {
                                    value: this.planDetail.eventType
                                },
                                {
                                    value: '预案等级',
                                    isTitle: true
                                },
                                {
                                    value: this.planDetail.planLevelName
                                }
                            ],
                            style: {
                                textAlign: 'left',
                                paddingLeft: '20px'
                            }
                        },
                        {
                            list: [
                                {
                                    value: '是否预案提醒',
                                    isTitle: true
                                },
                                {
                                    value: this.planDetail.planStatus == 1 ? '已启用' : '已停用'
                                },
                                {
                                    value: '',
                                    isTitle: true
                                },
                                {
                                    value: ''
                                }
                            ],
                            style: {
                                textAlign: 'left',
                                paddingLeft: '20px'
                            }
                        },
                        {
                            list: [
                                {
                                    value: '预案说明',
                                    isTitle: true
                                }, {
                                    value: this.planDetail.reamrks,
                                    col: 3
                                }
                            ],
                            style: {
                                height: '150px',
                                textAlign: 'left',
                                paddingLeft: '20px'
                            }
                        }
                    ];
                });
            },
            changeCzDate () {
                let obj = Object.assign({
                    createdDateS: this.czStartDate,
                    createdDateE: this.czEndDate,
                    executeInstructions: this.keword
                });
                this.params = Object.assign(this.params,obj)
                //重新加载列表
                this.$nextTick(() => {
                    this.$refs.table.init();
                });
            }
        },
        computed: {
            czStartDate () {
                return this.czDate && this.czDate.length && this.czDate[ 0 ] || '';
            },
            czEndDate () {
                return this.czDate && this.czDate.length && this.czDate[ 1 ] || '';
            }
        }
    };
</script>

<style scoped lang="less">
    .input-width{
        width: 160px;
        margin: 0 15px;
    }
    .plan-title {
        position: relative;
        margin-left: 50px;
        display: inline-flex;
        align-items: center;
        color: #C1D9FF;
        font-size: 14px;
        top: 3px;

        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: red;
            margin-right: 10px;

            &.active {
                background: green;
            }
        }
    }

    .org {
        padding-bottom: 1px;
        position: relative;
        height: 100%;
        background: linear-gradient(180deg, rgba(24, 38, 113, 1) 0%, rgba(24, 38, 113, 0) 100%);
        border-radius: 20px 20px 0px 0px;

        .add-tunnel-ctn {
            padding-top: 20px;
            margin-left: 30px;
            margin-right: 30px;
            width: calc(100% - 60px);

            .table-ctn1, .table-ctn2 {
                width: 100%;
                border-radius: 4px;
                border-collapse: collapse;
                margin-top: 30px;
                margin-bottom: 30px;
                table-layout: fixed;

                tr th {
                    border: 1px solid #224C97;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #C1D9FF;
                    height: 50px;
                }

                .ctn2-t th {
                    width: calc((100% - 640px) / 4);
                    background: #0C2253;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #5391F3;
                }

                .ctn2-t th:last-child {
                    width: 640px !important;
                }

                .ctn2-v th {
                    color: #C1D9FF;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                }

                .th-title {
                    height: 50px;
                    width: 200px;
                    background: #0C2253;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #5391F3;
                }

                .tr-user-ctn {
                    height: 106px;
                    background: #0C2253;

                    .user-info {
                        height: 142px;
                        width: 100%;
                        text-align: left;

                        .user {
                            margin-left: 16px;
                            margin-top: 16px;
                            display: flex;
                            align-items: center;

                            .user-head {
                                position: relative;
                                overflow: hidden;
                                height: 60px;
                                width: 60px;
                                border-radius: 50%;

                                img {
                                    height: 100%;
                                    width: 100%
                                }
                            }

                            .user-text {
                                margin-left: 16px;
                                font-size: 14px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #C1D9FF;

                                .user-date {
                                    margin-top: 9px
                                }
                            }
                        }

                        .user-done {
                            margin-top: 20px;
                            margin-left: 16px;
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #C1D9FF;
                        }
                    }
                }
            }
        }
    }

    .time-screen {
        position: absolute;
        right: 0px;
        top: -10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #C1D9FF;
    }
</style>