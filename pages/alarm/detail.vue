<template>
    <form-page :breadcrumb="[{name:'事件管理',path:'/alarm/'},{name:'事件详情'}]">
        <div class="org">
            <div class="org-ctn">
                <title-com title="基本信息" style="margin: 0;"></title-com>
                <c-table :listParm="alarmInfo"></c-table>

                <!--事件图片或视屏-->
                <div v-if="alarmDetail.eventPicture || alarmDetail.eventVideo">
                    <title-com title="事件其他信息"></title-com>
                    <div class="video-ctn">
                        <div class="video-item" v-if="alarmDetail.eventPicture">
                            <img :src="alarmDetail.eventPicture.includes('http')?alarmDetail.eventPicture:$ctx.$config.baseImgUrl+alarmDetail.eventPicture"
                                 alt="">
                        </div>
                        <div class="video-item" v-if="alarmDetail.eventVideo">
                            <h-video width="430"
                                     :videoSrc="alarmDetail.eventVideo"
                                     :videoImg="alarmDetail.eventPicture?alarmDetail.eventPicture:''"
                                     height="300"></h-video>
                        </div>
                    </div>
                </div>

                <!--实时视频-->
                <div v-if="alarmDetail.deviceList && alarmDetail.deviceList.length">
                    <title-com title="附近两路视频情况"></title-com>
                    <div class="video-ctn">
                        <div class="video-item"
                             v-for="item in alarmDetail.deviceList">
                            <h-rtsp :deviceConfig="item.deviceConfig"
                                    click-to-play
                                    no-bg></h-rtsp>
                        </div>
                    </div>
                </div>

                <!--不是待处理的话都要显示-->
                <div v-if="alarmDetail.eventState !==0">
                    <title-com title="事件执行情况"></title-com>
                    <c-table :listParm="alarmDone"></c-table>
                </div>

                <!--是否显示执行的预案，待归档、已归档状态显示-->
                <div v-if="(alarmDetail.eventState === 1 || alarmDetail.eventState === 2) && alarmDetail.temergencyPlanExecutionVO && alarmDetail.temergencyPlanExecutionVO.temergencyplanitemVO && alarmDetail.temergencyPlanExecutionVO.temergencyplanitemVO.length">
                    <title-com title="预案执行情况"></title-com>
                    <table class="table-ctn" border="1px" cellspacing="0">
                        <tr class="ctn-t">
                            <th>设备名称</th>
                            <th>所属隧道</th>
                            <th>安装位置</th>
                            <th>桩号</th>
                            <th>设备类型</th>
                            <th>执行操作</th>
                            <th>是否执行</th>
                        </tr>
                        <tr class="ctn-v"
                            v-for="device in alarmDetail.temergencyPlanExecutionVO.temergencyplanitemVO">
                            <th>{{device.deviceName}}</th>
                            <th>{{alarmDetail.tunnelName}}</th>
                            <th>{{device.leftRightFlagName}}</th>
                            <th>{{device.pileNumber}}</th>
                            <th>{{device.deviceTypeName}}</th>
                            <th>{{device.operateValue}}</th>
                            <th>{{device.isItImplemented==1?'是':'否'}}</th>
                        </tr>
                    </table>
                </div>

                <!--事件归档说明，状态1的时候显示输入框，状态2显示文本-->
                <div v-if="(alarmDetail.eventState===1 && isEdit) || alarmDetail.eventState===2">
                    <title-com title="事件归档说明"></title-com>
                    <div class="guid-ctn">
                        <div class="guid-ctn-l flex-class">事件归档说明</div>
                        <div class="guid-ctn-r">
                            <!--事件状态 0:待解决 1：已解决 2：已归档 -1：已忽略-->
                            <el-input resize="none"
                                      v-if="alarmDetail.eventState===1"
                                      type="textarea"
                                      :autosize="{ minRows: 1, maxRows: 5}"
                                      placeholder="请输入事件归档说明"
                                      v-model="placeOnFileReamrks">
                            </el-input>
                            <span v-if="alarmDetail.eventState===2">{{alarmDetail.placeOnFileReamrks}}</span>
                        </div>
                    </div>
                    <div class="guid-ctn-btm" v-if="alarmDetail.eventState===1 && isEdit">
                        <el-button type="primary" @click="doSub">事件归档</el-button>
                        <el-button @click="placeOnFileReamrks = ''">重置</el-button>
                    </div>
                </div>
            </div>
        </div>
    </form-page>
</template>

<script>
    import titleCom from '../../components/index/tips-title';
    import CTable from '../../components/c-table';

    import HVideo from '../../components/h-video';
    import HRtsp from '../../components/video/video-rtsp';

    export default {
        name: 'detail',
        components: {
            titleCom,
            CTable,
            HVideo,
            HRtsp
        },
        services: [ 'alarm' ],
        mounted () {
            this.id = this.$route.query.id;
            this.isEdit = this.$route.query.type === 'edit';
            //查询事件详情
            this.queryAlarmDetail(this.id);
        },
        data () {
            return {
                isEdit: false,
                alarmDetail: {},
                id: '',       //事件id

                alarmInfo: [],//基本信息
                alarmDone: [],//执行情况
                placeOnFileReamrks: ''
            };
        },
        methods: {
            queryAlarmDetail (id) {
                this.$service.alarm.queryAlarmDetail(id).then(res => {
                    this.alarmDetail = res;
                    this.alarmInfo = [
                        {
                            list: [
                                {
                                    value: '事件标题',
                                    isTitle: true
                                },
                                {
                                    value: this.alarmDetail.eventTitle
                                },
                                {
                                    value: '所属隧道',
                                    isTitle: true
                                },
                                {
                                    value: this.alarmDetail.tunnelName
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
                                    value: '事件类型',
                                    isTitle: true
                                },
                                {
                                    value: this.alarmDetail.eventTypeName
                                },
                                {
                                    value: '事件等级',
                                    isTitle: true
                                },
                                {
                                    value: this.alarmDetail.eventGrade
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
                                    value: '发生时间',
                                    isTitle: true
                                },
                                {
                                    value: this.alarmDetail.createdUserDate
                                },
                                {
                                    value: '事件来源',
                                    isTitle: true
                                },
                                {
                                    value: this.alarmDetail.eventSourceName
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
                                    value: '事件内容',
                                    isTitle: true
                                }, {
                                    value: this.alarmDetail.eventContent,
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
                    if (this.alarmDetail.eventState !== 0) {
                        this.alarmDone = [
                            {
                                list: [
                                    {
                                        value: '处理人',
                                        isTitle: true
                                    },
                                    {
                                        value: this.alarmDetail.disposeUserName
                                    },
                                    {
                                        value: '处理时间',
                                        isTitle: true
                                    },
                                    {
                                        value: this.alarmDetail.disposeDate
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
                                        value: '执行预案',
                                        isTitle: true
                                    },
                                    {
                                        value: this.alarmDetail.planName
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
                                        value: '事件处理说明',
                                        isTitle: true
                                    }, {
                                        value: this.alarmDetail.disposeFruit,
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
                    }
                }).catch(err => {

                });
            },
            doSub () {
                if (!this.placeOnFileReamrks) {
                    this.$ctx.toastError('请输入事件归档说明!');
                    return;
                }
                this.$service.alarm.setGdang({
                    id: this.id,
                    placeOnFileReamrks: this.placeOnFileReamrks
                }).then(res => {
                    this.$notifySuccess();
                    this.queryAlarmDetail(this.id);
                    this.$forceUpdate();
                });
            }
        }
    };
</script>

<style scoped lang="less">
    .flex-class {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .org {
        padding-bottom: 1px;
        position: relative;
        height: 100%;
        background: linear-gradient(180deg, rgba(24, 38, 113, 1) 0%, rgba(24, 38, 113, 0) 100%);
        border-radius: 20px 20px 0px 0px;

        .org-ctn {
            padding-top: 20px;
            margin-left: 30px;
            margin-right: 30px;
            width: calc(100% - 60px);

            .table-ctn {
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

                .ctn-t th {
                    width: calc((100% - 640px) / 4);
                    background: #0C2253;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #5391F3;
                }

                .ctn-t th:nth-child(6) {
                    width: 404px !important;
                }

                .ctn-v th {
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
            }

            .guid-ctn {
                display: flex;
                margin-top: 30px;
                height: 150px;
                width: 100%;

                .guid-ctn-l {
                    width: 200px;
                    background: #0C2253;
                    border: 1px solid #224C97;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #5391F3;
                }

                .guid-ctn-r {
                    padding-left: 20px;
                    width: calc(100% - 200px);
                    display: flex;
                    align-items: center;
                    border: 1px solid #224C97;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #C1D9FF;

                    /deep/ .el-textarea__inner {
                        background: none !important;
                    }
                }
            }

            .guid-ctn-btm {
                display: flex;
                align-items: center;
            }

            .video-ctn {
                display: flex;
                align-items: center;

                .video-item:nth-child(2) {
                    margin-left: 20px
                }

                .video-item {
                    width: 430px;
                    margin-right: 40px;

                    img {
                        height: 100%;
                        width: 100%
                    }
                }
            }
        }

        .tips {
            margin: 30px 0;
        }
    }
</style>
