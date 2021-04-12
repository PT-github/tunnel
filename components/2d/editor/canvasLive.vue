<template>
    <!--屏的 预览展示 -->
    <div class="live"  @click="createPoster">

        <!-- 先意念编程占坑，这个组件是为了选择图片及上传图片做的 -->
        <pic-poup v-if="showPicPoup" @chose="choseCall" @close="showPicPoup=false"></pic-poup>
    </div>
</template>

<script>
    
    import picPoup from './picPoup.vue'
    export default {
        components:{picPoup},
        props:{
            live: Object,
            mode: {
                type: [String,Number],
                default:()=>{
                    return 0
                }
            },
            resolutionPower: {
                type: String,
                default:()=>{
                    return '96*48'
                }
            }
        },
        data(){
            return {
                showPicPoup: false,
                chosePic:"",
                chosePic1:""
            }
        },
        mounted(){
            this.initCanvas()
        },
        methods:{
            initCanvas(){
                var ctx=document.getElementById("myCanvas").getContext("2d");
                ctx.fillStyle="#000000";
                ctx.fillRect(0, 0, this.width, this.height);
            }
        }
    }
</script>

<style scoped lang="less">
    
</style>
