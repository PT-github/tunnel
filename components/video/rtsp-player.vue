<template>
    <div :id="'player'+random"></div>
</template>

<script>
    import $ from 'jquery';

    window.$ = $;

    export default {
        props: {
            deviceConfig: [ Object, String, Number, Array ],
            width: {
                type: Number,
                default: 472
            },
            height: {
                type: Number,
                default: 235
            },
            delay: {
                type: Number,
                default: 2000
            }
        },
        data () {
            return {
                random: (Math.random() * 100000).toFixed(0)
            };
        },
        mounted () {
            setTimeout(() => {
                // console.log('播放视频', this.deviceConfig);
                qcxt.video.show('#player' + this.random, this.width, this.height, this.deviceConfig);
            }, this.delay);   // 加个延迟，防止页面进来的时候先把ui线程卡死
        }
    };
</script>

<style scoped>

</style>
