<template>
    <div class="tunnel" :class="{block:!_2d}">
        <tips-title :title="title"/>
        <div class="tunnel-channel">
            <div class="tunnel-channel-item">
                <img :src="require('@/assets/images/new/event-tunnel-1.png')" alt="">
                <div class="tunnel-channel-item-right">
                    <div class="tunnel-channel-item-right-num">{{warnCount.deviceEventCount||0}}</div>
                    <div class="tunnel-channel-item-right-tips">今日事故报警</div>
                </div>
            </div>
            <div class="tunnel-channel-item">
                <img :src="require('@/assets/images/new/event-tunnel-2.png')" alt="">
                <div class="tunnel-channel-item-right">
                    <div class="tunnel-channel-item-right-num">{{warnCount.deviceWarnCount||0}}</div>
                    <div class="tunnel-channel-item-right-tips">今日设备报警</div>
                </div>
            </div>
        </div>

        <div class="tunnel-channel">
            <div class="tunnel-channel-item" v-if="tunnelId">
                <img :src="require('@/assets/images/new/event-tunnel-3.png')" alt="">
                <div class="tunnel-channel-item-right">
                    <div class="tunnel-row" v-if="countData.singleDoubleType===3">
                        <div class="tunnel-row-item">
                            <div class="tunnel-channel-item-right-name">左洞</div>
                            <div class="tunnel-channel-item-right-num">{{countData.unblockedIndexLeft || 0}}</div>
                        </div>
                        <div class="tunnel-row-item" style="margin-left: 15px">
                            <div class="tunnel-channel-item-right-name">右洞</div>
                            <div class="tunnel-channel-item-right-num">{{countData.unblockedIndexRight || 0}}</div>
                        </div>
                    </div>
                    <div v-else class="tunnel-channel-item-right-num">{{countData.unblockedIndexLeft||countData.unblockedIndexRight ||0}}</div>
                    <div class="tunnel-channel-item-right-tips">畅通指数</div>
                </div>
            </div>
            <div class="tunnel-channel-item" v-if="tunnelId">
                <img :src="require('@/assets/images/new/event-tunnel-4.png')" alt="">
                <div class="tunnel-channel-item-right">
                    <div class="tunnel-row" v-if="countData.singleDoubleType===3">
                        <div class="tunnel-row-item">
                            <div class="tunnel-channel-item-right-name">左洞</div>
                            <div class="tunnel-channel-item-right-num">{{countData.trafficVolumeLeft || 0}}</div>
                        </div>
                        <div class="tunnel-row-item" style="margin-left: 15px">
                            <div class="tunnel-channel-item-right-name">右洞</div>
                            <div class="tunnel-channel-item-right-num">{{countData.trafficVolumeRight || 0}}</div>
                        </div>
                    </div>
                    <div v-else class="tunnel-channel-item-right-num">{{countData.trafficVolumeLeft||countData.trafficVolumeRight ||0}}</div>
                    <div class="tunnel-channel-item-right-tips">日车流量</div>
                </div>
            </div>
        </div>
        <!-- 事故和设备报警切换  -->
        <div class="tunnel-change">
            <template v-for="(item,i) in tabs">
                <div class="tunnel-change-item"
                     :class="[activeIndex==i?'active-change':'']"
                     @click="choseTabs(i)"
                     :key="i">{{item}}
                </div>
            </template>
        </div>
        <scroller :showMaxNum="showMaxNum" :rolling="rolling"></scroller>
    </div>
</template>
<script>
    import tipsTitle from '~/components/index/tips-title';
    import scroller from '@/components/home/scroller';

    export default {
        services: [ 'home' ],
        components: {tipsTitle, scroller},
        events: {
            'onPushEvent': 'refresh'
        },
        props: {
            _2d: Boolean,
            title: {
                type: String,
                default: () => {
                    return '隧道事件信息';
                }
            },
            showMaxNum: {
                type: Number,
                default: () => {
                    return 7;
                }
            }
        },
        data () {
            return {
                warnCount: {},
                activeIndex: 0,
                DeviceWarn: {},
                tabs: [ '事件报警', '设备报警' ],
                totalWarn: 0,
                rolling: [],
                tunnelId: null,
                passPercent: 0,
                passCount: 0,
                countData: {}
            };
        },
        mounted () {
            this.tunnelId = this.$route.query.tunnelId || null;
            this.refresh();
            this.choseTabs(0);
        },
        methods: {
            refresh () {    // 收到事件推送的时候刷新数据
                this.getWarnCount();
                if (this.tunnelId) {
                    this.getTunnelPass();
                }
            },
            //  2d界面的统计数据
            async getTunnelPass () {
                this.countData = await this.$service.home.getTunnelEventStat(this.tunnelId) || {};
                this.$emit('loaded', this.countData);
            },
            choseTabs (i) {
                this.activeIndex = i;
                this.rolling = [];
                if (i == 0) { // 事件告警
                    this.queryIncidentAlarmList();
                } else {
                    this.getWarnList();
                }
            },
            async getWarnList () {
                let res = await this.$service.home.getWarnPageAll(this.tunnelId) || {};
                this.rolling = res.records || [];
            },
            async queryIncidentAlarmList () {
                let res = await this.$service.home.getEventPageAll(this.tunnelId) || {};
                this.rolling = res.records || [];
            },
            // 警报事件 设备故障报警统计
            async getWarnCount () {
                this.warnCount = await this.$service.home.getEventCount(this.tunnelId) || {};
            }

        }
    };
</script>
<style scoped lang="less">
    .tunnel {
        width: 442px;
        margin-bottom: 20px;

        &-title {
            height: 17px;
            line-height: 17px;
            font-size: 16px;
            color: #5391F3;
        }

        &-channel {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0;

            &-item + &-item {
                //margin-left: 15px;
            }

            &-item {
                flex: 1;
                height: 77px;
                background: #182671;
                border-radius: 4px;
                display: flex;
                align-items: center;
                padding-left: 15px;

                img {
                    width: 33px;
                    height: 33px;
                }

                &-right {
                    padding-left: 15px;
                    flex: 1;

                    .tunnel-row {
                        display: flex;

                        &-item {
                            // display: flex;
                        }

                        div {
                            flex: 1;
                        }
                    }

                    &-num {
                        font-size: 24px;
                        font-weight: bold;
                        color: rgba(44, 115, 229, 1);
                        display: flex;
                        align-items: center;
                        // justify-content: center;
                    }

                    &-name {
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 400;
                        color: #aad3f3;
                    }

                    &-tips {
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(170, 211, 243, 1);
                    }
                }
            }
        }

        &-change {
            width: 150px;
            height: 35px;
            margin: auto;
            margin-bottom: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            background: rgba(16, 29, 101, 1);
            border: 1px solid rgba(37, 52, 134, 1);
            border-radius: 4px;
            color: #AAD3F3;
            box-sizing: border-box;
            overflow: hidden;

            &-item {
                height: 35px;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .active-change {
                border-radius: 0px 4px 4px 0px;
                background: #0568EE;
                color: #AAD3F3;
            }
        }
    }
</style>
