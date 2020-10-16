<template>
    <div class="video-ctn" v-if="videoSrc">
        <video name="media"
               ref="video"
               controls
               style="object-fit: fill"
               :width="width"
               :height="height"
               :poster="videoImg.includes('http')?videoImg:$ctx.$config.baseImgUrl+videoImg || ''">
            <source :src="videoSrc.includes('http')?videoSrc:$ctx.$config.baseImgUrl+videoSrc" type="video/mp4">
        </video>
    </div>
</template>

<script>
    export default {
        name: "h-video",
        props:{
            videoImg:String,
            videoSrc:String,
            width:[String,Number],
            height:[String,Number],
        },
        data(){
            return {

            }
        },
        methods:{
            play(){
                this.isPlay = false
                this.$refs.video.play();
            }
        }
    }
</script>

<style scoped lang="less">
    .video-ctn{
        position: relative;
        .play-icon{
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            left: 31px;
            top: 31px;
            width:33px;
            height:33px;
            border-radius: 50%;
            border: 4px solid #C1D9FF;
            cursor: pointer;
            .el-icon-caret-right{
                font-size: 20px;
                color: #C1D9FF;
            }
        }
    }
</style>