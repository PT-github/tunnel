<template>
    <div class="video-rtsp block" v-if="!noBg" :style="{height:bgHeight*finalPx2rem+'px'}">
        <TipsTitle v-if="title" :title="title" style="margin-bottom: 25px;"></TipsTitle>
        <div class="video-wrap" :style="{width: `${(width+28)*finalPx2rem}px`,height:`${(height+22) *finalPx2rem}px`}">
            <template v-if="clickToPlay && !play">
                <img class="btn-play" src="../../assets/images/new/btn-play.png" @click="play=true">
            </template>
            <template v-else>
                <RtspPlayer v-if="deviceConfig" style="position: absolute;" :deviceConfig="deviceConfig" :width="(width+28)*finalPx2rem"
                            :height="(height+22) *finalPx2rem"></RtspPlayer>
            </template>
        </div>
    </div>
    <div v-else class="video-wrap" :style="{width: `${width*finalPx2rem}px`,height:`${height*finalPx2rem}px`}">
        <template v-if="clickToPlay && !play">
            <img class="btn-play" src="../../assets/images/new/btn-play.png" @click="play=true">
        </template>
        <template v-else>
            <RtspPlayer style="position: absolute;" v-if="deviceConfig" :deviceConfig="deviceConfig"
                        :width="width*finalPx2rem"
                        :height="height*finalPx2rem"></RtspPlayer>
        </template>
    </div>
</template>

<script>
    import RtspPlayer from './rtsp-player';
    import TipsTitle from '../index/tips-title';

    export default {
        name: 'video-rtsp',
        events: {
            'onShowEvent': 'hide'
        },
        props: {
            noBg: Boolean,
            title: String,
            deviceConfig: [ Object, String, Number, Array ],
            clickToPlay: Boolean,
            canPlay: Boolean,
            width: {
                type: Number,
                default: 472
            },
            bgHeight: {
                type: Number,
                default: 375
            },
            isTrueWidth: Boolean
        },
        computed: {
            finalPx2rem () {
                if (this.isTrueWidth) {
                    return 1;
                } else {
                    return this.$px2rem;
                }
            },
            height () {
                return this.width / 16 * 9;
            }
        },
        components: {RtspPlayer, TipsTitle},
        watch: {
            canPlay (v) {
                if (!v) {
                    this.play = false;
                }
            }
        },
        methods: {
            hide () {   // 有弹窗时关闭视频
                this.play = false;
            }
        },
        data () {
            return {
                play: false
            };
        }
    };
</script>

<style scoped lang="less">
    .video-rtsp {
        padding: 25px;
        position: relative;
    }

    .btn-play {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        transform: translate(-50%, -50%);
    }

    .video-wrap {
        margin: 0 auto 25px;
        background: rgba(6, 11, 40, 1);
        opacity: 0.6;
        border-radius: 4px;
        position: relative;
    }
</style>
