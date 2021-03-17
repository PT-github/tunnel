<template>
    <div>
        <live :live="textObj"
              :imgUrls="imgUrls" 
              :resolutionPower="resolutionPower" 
              :mode="templateType" 
              :textArr="textArr"
              :orginBmps="bmps"
              :idx="idx"
              @imgChange="imgChange"
              ref="live"></live>
        <temp :mode="templateType" @templateChange="templateChange"></temp>
        <txt v-model="textObj" 
            :txtWH="txtWH" 
            :allowRowHeight="allowRowHeight"
            :allowSpacing="allowSpacing"
            v-if="showText"
            ref="text"
            @textArrChange="textArrChange"></txt>
        <play v-model="playObj"></play>
        <other v-model="otherObj"></other>
    </div>
</template>

<script>

    import Live from './live.vue';
    import Temp from './temp.vue'
    import Txt from './txt.vue'
    import Other from './other.vue'
    import Play from './play.vue'
    export default {
        components:{
            Live,Temp,Txt,Other,Play
        },
        props:{
            idx: Number,
            allowSpacing: {
                type:Boolean,
                default:()=>{
                    return true
                }
            },
            allowRowHeight: {
                type:Boolean,
                default:()=>{
                    return true
                }
            },
            show: {
                type:Boolean,
                default:()=>{
                    return true
                }
            },
            obj: {
                type: Object,
                default:()=>{
                    return {}
                }
            },
            resolutionPower:{
                type: String,
                default:()=>{
                    return '96*48'
                }
            }
        },
        data(){
            return {
                textArr:[],
                bmps:[],
                textObj:{},
                playObj: {},
                otherObj: {},
                imgUrls:"",
                templateType: 0,
                showText: true //显示文本组件
            }
        },
        computed:{
            txtWH(){
                let wh = this.resolutionPower.split('*')
                // 0 文字 1 图片 2 左图右文 3 左文右图，5上图下文  6 图文图
                let whObj = {
                    w: 0,
                    h: 0
                }
                if(this.templateType==0){
                    whObj.w = Number( wh[0])
                    whObj.h = Number(wh[1]);
                }else if(this.templateType==2 || this.templateType==3 || this.templateType==6){
                    whObj.w = Number(wh[0])*2/3
                    whObj.h = Number(wh[1]);
                }else if(this.templateType==5){
                    whObj.w = Number(wh[0])
                    whObj.h = Number(wh[1])/2;
                }
                return whObj
            },
            submitparms(){
                return {
                    templateType: this.templateType,
                    imgUrls:this.imgUrls,
                    ...this.textObj,
                    ...this.otherObj,
                    ...this.playObj
                }
            }
        },
        watch:{
            obj:{
                handler(o1={}){
                    let {
                        backgroundColor,bold,color,emergeFlag=1,
                        emergeSpeed=0,fontName,fontSize,imgUrls,
                        intervalShow=2,italics,monopoly,releaseType="1",
                        vertical,horizontal, releaseTypeName,
                        rowHeight,spacing,templateType=0,text="",bmps
                    } = o1;
                    this.templateType = templateType;
                    this.bmps = bmps;
                    if(templateType==1){
                        this.showText = false
                    }else{
                        this.showText = true
                    }
                    this.imgUrls = imgUrls;
                    // 解析换行符再转回去
                    text = (text||'').split("\\n").join("\n");
                    this.textObj = {
                        backgroundColor,bold,color,fontName,fontSize,
                        rowHeight,italics,vertical,horizontal, text,spacing
                    }
                    this.playObj = {
                        intervalShow,emergeFlag,emergeSpeed
                    }
                    this.otherObj = {
                        monopoly,releaseType,releaseTypeName
                    }

                },
                deep:true,
                immediate: true
            },
            templateType:{ // 切换模式
                handler(val){
                    if(val!=1){
                        setTimeout(() => {
                            this.$refs.text.handlerTxtToArr(this.textObj.text)
                        }, 100);
                    }
                },
                deep:true
            },
        },
        methods:{
            textArrChange(textArr){
                this.textArr = textArr||[]
            },
            imgChange(url=''){
                this.imgUrls = url
            },
            async parmsData(){
                if(this.submitparms.templateType!=1){
                    if(!this.submitparms.text){
                        this.$ctx.toastError("请先填写要下发得文字内容")
                        return new Promise((resolve, reject) => reject())
                    }
                    if( this.$refs.text && this.$refs.text.isOVerFlag()){
                        this.$ctx.toastError("文字超出长度")
                        return new Promise((resolve, reject) => reject())
                    }
                }
                this.submitparms.interval = this.submitparms.intervalShow * 100;
                this.submitparms.imgUrls =  this.submitparms.imgUrls || '';
                if(this.submitparms.text) {
                    // let textArr = this.submitparms.text.split("\n");
                    this.submitparms.text = this.textArr.join(`\\n`)
                }
               
                let pintInfo = this.$refs.live.getAllPoint() || {};
                // let base64Data = await this.$refs.live.createPoster();
                let parms = this.submitparms||{}

                parms = Object.assign(parms,pintInfo)
                 // 要是文字的话，图片数据清空下
                if(parms.templateType==0){
                    parms.bmps = []
                }
                if(parms.templateType==1) { // 图片的时候设置下point的值为0
                    parms.point = {
                        x: 0,
                        y: 0
                    };
                    parms.rowHeight = 0;
                    parms.spacing = 0;
                    parms.vertical = 1;
                    parms.horizontal =  1;
                    parms.text = "";
                    parms.bold = 0;
                    parms.italics = 0;
                    parms.color = "";  // 字颜色
                    parms.backgroundColor = ""; //背景色
                    parms.fontSize = "24"; //字号
                    parms.fontName = "宋体" //字体
                }
                parms.bold = Number(parms.bold);
                parms.showImg = "";
                parms.italics = Number(parms.italics);
                return parms
            },
            templateChange(i){
                this.templateType = i;
                this.showText = (i!=1)
            }
        }

    }
</script>

<style scoped lang="less">
</style>
