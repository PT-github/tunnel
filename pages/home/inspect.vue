<template>
    <div class="page">
        <!--左边-->
        <div class="block left">
            <TipsTitle title="设备巡检"></TipsTitle>
            <div class="buttons">
                <div class="button start" :class="{active:this.isChecking}" @click="doStart">
                    <img class="icon" src="../../assets/images/inspect/icon-start.png">
                    开始巡检
                </div>
                <div class="button stop" @click="doStop">
                    <img class="icon" src="../../assets/images/inspect/pause.png">
                    停止巡检
                </div>
                <div class="button restart" @click="doRestart">
                    <img class="icon" src="../../assets/images/inspect/restart.png">
                    重新巡检
                </div>
            </div>
            <TipsTitle title="隧道左洞" mode="center" style="margin-top: 15px;"></TipsTitle>
            <div class="inspect-wrap scroll" ref="left">
                <template v-for="(device,idx) in leftDeviceList">
                    <InspectItem :device="device" :status="idx===checkingLeftIdx?1:(idx<checkingLeftIdx?2:0)"
                                 :first="idx===0"></InspectItem>
                </template>
            </div>
            <TipsTitle title="隧道右洞" mode="center" style="margin-top: 15px;"></TipsTitle>
            <div class="inspect-wrap scroll" ref="right">
                <template v-for="(device,idx) in rightDeviceList">
                    <InspectItem :device="device" :status="idx===checkingRightIdx?1:(idx<checkingRightIdx?2:0)"
                                 :first="idx===0"></InspectItem>
                </template>
            </div>
            <div class="intro">
                <img class="icon" src="../../assets/images/inspect/success.png">
                <span class="label">正常设备</span>
                <img class="icon" src="../../assets/images/inspect/error.png">
                <span class="label">故障设备</span>
                <div class="round blue"></div>
                <span class="label">正在巡检</span>
                <div class="round "></div>
                <span class="label">未巡检</span>
            </div>
        </div>
        <!--右边-->
        <div class="right">
            <div class="block wide padding">
                <TipsTitle title="隧道详情"></TipsTitle>
                <!--隧道图-->
                <div class="map">
                    <tunnel-component ref="tunnel" @loaded="onDeviceListLoaded" wait></tunnel-component>
                </div>
                <el-progress class="progress" :percentage="percent" :text-inside="true"
                             :stroke-width="26"></el-progress>
            </div>
            <div class="videos">
                <VideoRtsp class="flex1" title="设备状态"
                           :device-config="!isChecking || hideVideo ? null : videoList[showingVideoIdx].deviceConfig"></VideoRtsp>
                <div class="spacer"></div>
                <div class="block flex1 broken">
                    <TipsTitle title="故障设备"></TipsTitle>
                    <div class="form">
                        <div class="row title">
                            <div class="row-left row-item">设备名称</div>
                            <div class="row-center row-item">桩号</div>
                            <div class="row-center row-item">运行状态</div>
                            <div class="row-right row-item">初次巡检故障时间</div>
                            <div style="width: 4px;height: 100%;"></div>
                        </div>
                        <div class="scroll-wrap scroll">
                            <template v-for="item in errorList">
                                <div class="row">
                                    <div class="row-left row-item">
                                        <img class="icon" src="../../assets/images/inspect/info.png">
                                        {{item.deviceName}}
                                    </div>
                                    <div class="row-center row-item">{{item.pileNumberStr}}</div>
                                    <div class="row-center row-item error">异常</div>
                                    <div class="row-right row-item">{{item.time}}</div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TunnelComponent from '../../components/2d/tunnel';
    import TipsTitle from '../../components/index/tips-title';
    import VideoRtsp from '../../components/video/video-rtsp';
    import InspectItem from '../../components/2d/inspect-item';

    const getTimeStr = function(date) {
        let fix = v => String(v).length === 1 ? '0' + v : v;
        return `${date.getFullYear()}-${fix(date.getMonth() + 1)}-${fix(date.getDate())} ${fix(date.getHours())}:${fix(date.getMinutes())}:${fix(date.getSeconds())}`;
    };

    const CHECK_INTERVAL = 3000; // 检查设备的间隔(毫秒)
    const SWITCH_VIDEO_INTERVAL = 15000; // 切换视频间隔

    export default {
        services: [ '_2d' ],
        components: {
            TipsTitle, VideoRtsp, TunnelComponent, InspectItem
        },
        data () {
            return {
                tunnelId: this.$route.query.tunnelId,
                videoList: [],
                leftDeviceList: [],
                rightDeviceList: [],
                showingVideoIdx: 0, // 正在显示的视频
                hideVideo: true,   // 切换过程中把视频去掉
                errorList: [],
                isChecking: false,
                checkingLeftIdx: -1, // 正在检查的左洞index
                checkingRightIdx: -1 // 正在检查的右洞index
            };
        },
        computed: {
            isFinish () {   // 是否检查完成
                return this.checkingLeftIdx === this.leftDeviceList.length && this.checkingRightIdx === this.rightDeviceList.length;
            },
            percent () {
                if (this.checkingLeftIdx === -1) {
                    return 0;
                } else if (this.checkingRightIdx === -1) {
                    return Number(((this.checkingLeftIdx + 1) / (this.leftDeviceList.length + this.rightDeviceList.length) * 100).toFixed(2));
                } else {
                    return Number(((this.checkingLeftIdx + this.checkingRightIdx) / (this.leftDeviceList.length + this.rightDeviceList.length) * 100).toFixed(2));
                }
            }
        },
        methods: {
            async doStart () {
                if ((!this.leftDeviceList.length && !this.rightDeviceList.length) || this.isChecking) { // 没有任何设备，跳过
                    return;
                }
                if (this.isFinish) {
                    this.doRestart();
                    return;
                }
                if (!this.inspectId) {
                    this.inspectId = await this.$service._2d.inspectTunnel(this.tunnelId);
                }
                this.isChecking = true;
                const height = 320;
                const compHeight = 36;
                let func = () => {
                    let checkingLeft = false;
                    if (!this.leftDeviceList.length) {
                        this.checkingLeftIdx = 0;
                    } else if (this.checkingLeftIdx < this.leftDeviceList.length) {
                        checkingLeft = true;
                        this.checkingLeftIdx++;
                        let expect = compHeight * this.checkingLeftIdx;
                        if (this.$refs.left.scrollTop + height < expect + compHeight || this.$refs.left.scrollTop > expect) {
                            this.$refs.left.scrollTop = expect + compHeight * 6 - height;
                        }
                        let device = this.leftDeviceList[ this.checkingLeftIdx ];
                        if (this.checkingLeftIdx !== this.leftDeviceList.length) {
                            this.$refs.tunnel.showWait(device.id);
                            this.$service._2d.inspectDevice(this.tunnelId, this.inspectId, device.id);
                            device.deviceCommunicationsState !== 0 && this.errorList.unshift({
                                ...this.leftDeviceList[ this.checkingLeftIdx ],
                                time: getTimeStr(new Date())
                            });
                        }
                    }
                    if (checkingLeft) return;
                    if (!this.rightDeviceList.length) {
                        this.checkingRightIdx = 0;
                        this.doStop();
                        this.isChecking = false;
                    } else if (this.checkingRightIdx < this.rightDeviceList.length) {
                        this.checkingRightIdx++;
                        let expect = compHeight * this.checkingRightIdx;
                        if (this.$refs.right.scrollTop + height < expect + compHeight || this.$refs.right.scrollTop > expect) {
                            this.$refs.right.scrollTop = expect + compHeight * 6 - height;
                        }
                        let device = this.rightDeviceList[ this.checkingRightIdx ];
                        if (this.checkingRightIdx !== this.rightDeviceList.length) {
                            this.$refs.tunnel.showWait(device.id);
                            device.deviceCommunicationsState !== 0  && this.errorList.unshift({
                                ...this.rightDeviceList[ this.checkingRightIdx ],
                                time: getTimeStr(new Date())
                            });
                        }
                    } else {
                        this.doStop();
                        this.isChecking = false;
                    }
                };
                this._timer = setInterval(func, CHECK_INTERVAL);
                func();
            },
            doStop () {
                this.isChecking = false;
                clearInterval(this._timer);
                this._timer = 0;
            },
            getCameraList (deviceList) {
                this.videoList = deviceList.filter(v => {
                    return v.classifyNumber === 'video';
                });
                let func = () => {
                    this.hideVideo = false;
                    if (this.showingVideoIdx + 1 >= this.videoList.length) {
                        this.showingVideoIdx = 0;
                    } else {
                        this.showingVideoIdx++;
                    }
                    setTimeout(() => {
                        this.hideVideo = true;
                    }, SWITCH_VIDEO_INTERVAL - 500);
                };
                func();
                this._videoTimer = setInterval(() => {
                    func();
                }, SWITCH_VIDEO_INTERVAL);
            },
            doRestart () {
                this.doStop();
                this.errorList = [];
                delete this.inspectId;
                this.$refs.tunnel.clearWait();
                this.checkingLeftIdx = -1;
                this.checkingRightIdx = -1;
                this.doStart();
            },
            onDeviceListLoaded (data) {
                let left = [], right = [];
                data.forEach(v => {
                    if (v.leftRightFlag === 2) {
                        left.push(v);
                    } else {    // 除了左洞的设备，其他都归右洞
                        right.push(v);
                    }
                });
                this.leftDeviceList = left;
                this.rightDeviceList = right;
                this.getCameraList(data);
            }
        },
        destroyed () {
            clearInterval(this._timer);
            clearInterval(this._videoTimer);
        },
        watch: {
            '$route': function() {
                location.reload();
            }
        }
    };
</script>

<style scoped lang='scss'>
    $error: #FF2012;
    $gray: #6A6D7C;
    $ing: #5391F3;

    .page {
        display: flex;
        padding: 0 17px 17px;

        .progress {
            width: 1300px;
            margin: 0 auto;
        }

        .form {
            margin-top: 33px;
            background: rgba(15, 29, 94, 1);
            border-top: 1px solid rgba(14, 69, 134, 1);
            border-left: 1px solid rgba(14, 69, 134, 1);
            border-right: 1px solid rgba(14, 69, 134, 1);

            .scroll-wrap {
                height: 210px;
            }

            .row {
                display: flex;
                border-bottom: 1px solid rgba(14, 69, 134, 1);
            }

            .title {
                .row-item {
                    color: rgba(137, 179, 246, 1);

                    &:nth-last-child(2) {
                        border-right: none;
                    }
                }
            }

            .row-item {
                font-size: 13px;
                line-height: 33px;
                color: rgba(51, 124, 243, 1);
                border-right: 1px solid #0E4586;
                padding: 0 10px;
                overflow-x: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &.error {
                    color: #FF2012;
                }

                &:nth-last-child(1) {
                    border-right: none;
                }

                .icon {
                    width: 16px;
                    height: 16px;
                    margin-right: 7px;
                    margin-top: -3px;
                }
            }

            .row-left {
                width: 245px;
            }

            .row-center {
                flex: 1;
            }

            .row-right {
                width: 176px;
            }
        }

        .left {
            width: 472px;
            margin-right: 20px;
            padding: 25px 20px;

            .intro {
                width: 366px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 30px;
                border-radius: 15px;
                padding: 0 5px;
                margin-top: 30px;
                color: rgba(83, 145, 243, 1);
                background: rgba(10, 19, 68, 1);

                .label {
                    font-size: 13px;
                }

                .round {
                    width: 16px;
                    height: 16px;
                    border-radius: 8px;
                    background: $gray;
                    margin: 10px;

                    &.blue {
                        background: $ing;
                    }
                }

                .icon {
                    width: 16px;
                    height: 16px;
                    margin: 10px;
                }
            }

            .inspect-wrap {
                height: 320px;
                margin-top: 15px;
                margin-left: 34px;
            }

            .buttons {
                margin-top: 20px;
                display: flex;

                .button {
                    flex: 1;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: bold;
                    color: rgba(83, 145, 243, 1);
                    background: rgba(25, 37, 103, 1);
                    border-radius: 4px;
                    cursor: pointer;

                    &.start, &.stop {
                        margin-right: 17px;
                    }

                    &.active {
                        color: #F99A54;
                    }

                    .icon {
                        width: 20px;
                        height: 20px;
                        margin-right: 7px;
                        margin-bottom: 3px;
                    }
                }
            }
        }

        .right {
            flex: 1;

            .map {
                width: 100%;
                margin-top: 20px;
                margin-bottom: 70px;
            }
        }

        .block {
            &.padding {
                padding: 25px 20px;
            }

            &.wide {
            }
        }

        .videos {
            height: 372px;
            display: flex;
            margin-top: 20px;

            .spacer {
                width: 21px;
                height: 100%;
            }

            .flex1 {
                flex: 1;
                flex-shrink: 0;
            }

            .broken {
                padding: 30px;
            }
        }
    }
</style>
