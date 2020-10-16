<!-- 多媒体弹窗 -->
<template>
    <popup :showPopup="show" @handleClose="show = false" :title="title" :width="$getPx(imgWidth+80)">
        <div class="modal" v-if="show">
            <template v-for="item in medias">
                <img v-if="item.type==='image'" :src="item.src" class="img" :style="{width:$getPx(imgWidth)}">
                <video-rtsp v-else-if="item.type==='video'" :width="imgWidth*$px2rem" isTrueWidth click-to-play no-bg
                            :device-config="item.deviceConfig" class="video"></video-rtsp>
                <h-video v-else-if="item.type==='srcVideo'"
                         :width="$getPx(imgWidth)"
                         :videoSrc="item.src"
                         :videoImg="item.img"
                         :height="imgWidth/16*9"></h-video>
            </template>
        </div>
    </popup>
</template>

<script>
    import VideoRtsp from '../video/video-rtsp';
    import HVideo from '../../components/h-video';

    export default {
        components: {VideoRtsp, HVideo},
        props: {
            imgWidth: {
                type: Number,
                default: 500
            },
            title: {
                type: String,
                default: ""
            },
            value: Boolean,
            medias: Array
        },
        data () {
            return {
                show: false
            };
        },
        watch: {
            value (v) {
                this.show = v;
            },
            show (v) {
                this.$emit('input', v);
            }
        }
    };
</script>

<style scoped lang="less">
    .modal {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .video {
            margin: 0 10px;
        }
    }
</style>