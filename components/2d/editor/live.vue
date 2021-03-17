<template>
    <!--屏的 预览展示 -->
    <div class="live">
        <!-- 纯文字 -->
        <div  :id="'canvasMode'+mode+''+idx" v-if="mode==0" class="live-text" :style="[liveTextStyle,getWH]">
                <div v-for="(item,i) in textArr" :key="i" :style="liveTextStyle">
                    <template v-for="(t,k) of item">
                        <span class="span-text" :style="spanText" :key="k">{{t}}</span>
                    </template>
                </div>
        </div>

        <!-- 先意念编程占坑，这个组件是为了选择图片及上传图片做的 -->
        <!-- <pic-poup v-if="showPicPoup" :showPicPoup="showPicPoup" @close="showPicPoup=false" @chose="choseCall"></pic-poup> -->
    </div>
</template>

<script>
    import html2canvas from 'html2canvas';
    // import picPoup from './picPoup.vue'
    export default {
        // components:{picPoup},
        props:{
            showOnly: Boolean, // 是否只做展示，屏蔽点击
            textArr: {
                type: Array,
                default:()=>{
                    return []
                }
            },
            live: Object,
            idx: {
                type: [String,Number],
                default:()=>{
                    return 0
                }
            },
            imgUrls:{
                type: String,
                default:()=>{
                    return ""
                }
            },
            mode: {
                type: [String,Number],
                default:()=>{
                    return 0
                }
            },
            orginBmps:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            resolutionPower: {
                type: String,
                default:()=>{
                    return '96*48'
                }
            }
        },
        watch:{
            mode:{
                handler(){
                    this.chosePic = '';
                    // 处理下点阵信息
                    this.handlerPoint()
                }
            },
            imgUrls:{
                handler(str=""){
                    if(!str){ str=""}
                    if(str.includes(",")){
                        let imgArr = str.split(",")
                        this.leftPic = imgArr[0];
                        this.rightPic = imgArr[1];
                        this.chosePic = ''
                    }else{
                        this.chosePic = str;
                        this.leftPic = '';
                        this.rightPic = ''
                    }
                    this.tempImgUrls = str
                },
                deep:true,
                immediate:true
            },
            tempImgUrls:{
                handler(obj){
                     this.$emit("imgChange",obj)
                },
            },
            orginBmps:{
                handler(bmps){
                     this.bmps = bmps;
                },
            }
        },
        data(){
            return {
                showPicPoup: false,
                choseType: "",
                point:{},
                bmps:[],
                chosePic:"",
                leftPic:"",
                rightPic: "",
                tempImgUrls: ""
            }
        },
        computed:{
            getWH(){
                let wh = this.resolutionPower.split('*')
                return {
                    "width": wh[0] +'PX',
                    "height": wh[1] +'PX'
                }
            },
            picBg(){
                return {
                     "background-color": this.live.bgColor || '#000',
                }
            },
            spanText(){
                return {
                    "color": this.live.color,
                    "marginRight": this.live.spacing+'PX',
                    "font-weight": Boolean(Number(this.live.bold||'0'))?'bold':'',
                    "line-height":this.live.fontSize+'PX',
                    "font-style": Boolean(Number(this.live.italics||'0'))?'italic':'',
                    "font-size": this.live.fontSize+'PX',
                }
            },
            letter(){
                return{
                    "letter-spacing": this.live.spacing +'px',
                }
            },
            liveTextStyle(){
                let alignItemsMap = {
                    1: "center",
                    2: "flex-start",
                    3: "flex-end"
                }
                let textAlginMap = {
                    1: "center",
                    2: "flex-start",
                    3: "flex-end"
                }
                return {
                    "display": "flex",
                    "padding-top": this.live.rowHeight+'PX',
                    "color": this.live.color,
                    "font-weight": Boolean(Number(this.live.bold||'0'))?'bold':'',
                    "background-color": this.live.backgroundColor,
                    "line-height":this.live.fontSize+'PX',
                    "font-style": Boolean(Number(this.live.italics||'0'))?'italic':'',
                    "font-size": this.live.fontSize+'PX',
                    "justify-content": textAlginMap[this.live.horizontal||1],
                    "align-items": alignItemsMap[this.live.vertical||1]
                }
            }
        },
        methods:{
            getAllPoint(){
                this.handlerPoint()
                return {
                    bmps:this.bmps,
                    point: this.point
                }
            },
            
            computeX(width=0){
                // this.horizontal  1 居中 2 居左 3 居右
                let maxText = ""
                this.textArr.forEach(item => {
                    if(item.length>maxText.length){
                        maxText = item
                    }
                });
                let x = 0
                if(this.live.horizontal==1){//  水平居中算法  宽/2-(字体大小*每行字个数+字间距*每行字个数-字间距)/2
                    x = (width / 2) - (this.live.fontSize * maxText.length + this.live.spacing * maxText.length - this.live.spacing) / 2;
                }else if(this.live.horizontal==3){ // 水平右对齐算法   宽-(字体大小*每行字个数+字间距*每行字个数-字间距)
                    x = width - (this.live.fontSize * maxText.length + this.live.spacing * maxText.length - this.live.spacing)
                }
                return Math.round(x)
            },
            computeY(height=0){
                // this.live.vertical 1 居中 2 居上 3 居下
                let lines = this.textArr.length
                let y = 0
                if(this.live.vertical==1){// 垂直居中算法  高/2-(字体大小*行数+行高*行数-行高)/2; 
                    y = height / 2 - (this.live.fontSize * lines  + this.live.rowHeight * lines) / 2;
                }else if(this.live.vertical==3){ // 垂直居下算法 高-(字体大小*行数+行高*行数-行高)
                    y = height - (this.live.fontSize * lines  + this.live.rowHeight * lines - this.live.rowHeight);
                }
                return Math.round(y)
            },
            handlerPoint(){
                let wh = this.resolutionPower.split('*');
                // 处理文字的点阵信息
                this.point = this._handerPoint(wh)
            },
            // 处理文字的点阵信息
            _handerPoint(wh=[]){
                let mode = this.mode;
                let point = {}
                if(mode==0 || mode==3){ // 纯文字 // 左文右图
                    point = {
                        x: this.computeX(wh[0]),
                        y: this.computeY(wh[1])
                    }
                }else if(mode==1){ //纯图片
                }else if(mode==2){ // 左图右文
                    let imgW = Number(Number(wh[0])/3).toFixed(0)*1;
                    point = {
                        x: imgW + this.computeX(imgW * 2),
                        y: this.computeY(wh[1])
                    }
                }else if(mode==5){ // 上图下文
                    let imgH = Number(Number(wh[1])/2).toFixed(0)*1;
                    point = {
                        x: this.computeX(wh[0]),
                        y: imgH + this.computeY(imgH)
                    }
                }else if(mode==6){ // 图文图
                    let imgW = Number(Number(wh[1])/6).toFixed(0)*1
                    point = {
                        x: imgW + this.computeX(imgW * 4 ),
                        y: this.computeY(wh[1])
                    }
                }
                return point
            },
            // 图片的点阵信息
            _handerBmps(item){
                let wh = this.resolutionPower.split('*');
                let mode =this.mode;
                let point = {}
                if(mode==0 ){ // 纯文字 
                }else if(mode==1||mode==2 || mode==5){ //纯图片// 左图右文// 上图下文
                    point = { x:0, y:0}
                }else if( mode==3){// 左文右图
                     point = {
                        x: Number(Number(wh[0])*2/3).toFixed(0)*1,
                        y: 0
                    }
                }else if(mode==6){ // 图文图
                    if(this.choseType==1){
                        point = { x: 0, y: 0}
                    }else if(this.choseType==2) {
                         point = {
                            x: 0,
                            y: Number(Number(wh[1])*5/6).toFixed(0)*1
                        }
                    }
                }
                return {
                    point,
                    bmpName: `${item.FileName}${item.Extension}`,
                    imgUrl: item.FilePath
                }
            },
            choseCall(item){
                let url = item.FilePathAll;
                url = url +'?d='+ new Date().getTime();
                this.chosePic = []
                let bmps = [this._handerBmps(item)]
                if(this.mode == 6){
                    if(this.choseType==1){
                        this.leftPic = url
                        bmps[0] =this._handerBmps(item);
                    }else if(this.choseType==2){
                        this.rightPic = url
                         bmps[1] =this._handerBmps(item);
                    }
                    this.chosePic = [this.leftPic,this.rightPic]
                    this.tempImgUrls= this.chosePic.join(",")
                }else{
                    this.chosePic = url ;
                    this.tempImgUrls= url
                }
                this.bmps = bmps
                console.log(url)
            },
            // 
            chosePicModel(i){
                if(this.showOnly) return
                this.chosePic = ''
                this.choseType = i ||""
                this.showPicPoup = true;
            },
            // 生存图片的方法,先占个坑
            async createPoster(){
                let domId = document.getElementById('canvasMode'+this.mode +''+ this.idx)
                let canvas = await html2canvas(domId,{useCORS:true})
                    // 生成base64数据
                return canvas.toDataURL('image/png');
                
            }
        }
    }
</script>

<style scoped lang="less">
    .flex-center{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .live{
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        &-text{
            // 这个属性支持多个空格和换行
            white-space: pre-wrap;
            word-break: break-all;
            background-color: #000;
            color: red;
            // 这里大写是为了不被rem化
            font-size: 15PX;
            overflow: hidden;
            flex-wrap: wrap;
            letter-spacing:0px;
            .span-text:last-child {
                margin-right:0px !important
            }
        }
        &-pic{
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #000;
            overflow: hidden;
        }
        .chose-img{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color:#fff;
            cursor: pointer;
            &-url{
                padding: 5px;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        }
        &-2,
        &-3,
        &-5{
            display: flex;
            background-color: #000;
            color: red;
            .chose-img{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
            }
        }
        &-2{
            &-left{
                flex: 1;
                flex-shrink: 0;
                .chose-img{ border-right: 1px solid #fff;}
            }
            &-right{ flex: 2;flex-shrink: 0;display: inline-block;}
        }
         &-3{
            &-left{flex: 2;}
            &-right{ 
                flex: 1;
                flex-shrink: 0;
                 .chose-img{ border-left: 1px solid #fff;}
            }
        }
        &-4{
            display: flex;
            background-color: #000;
            color: red;
            flex-direction: column;
            &-left{
                flex: 1;
                flex-shrink: 0;
                 .chose-img{ 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 100%;
                    border-bottom: 1px solid #fff;
                }
            }
            &-right{ 
                flex: 1;
            }
        }
        &-5{
            &-left{
                flex: 1;
                flex-shrink: 0;
                 .chose-img{ 
                    border-right: 1px solid #fff;
                }
            }
            &-mid{
                flex: 4;
                flex-shrink: 0;
            }
            &-right{
                flex: 1;
                flex-shrink: 0;
                
                 .chose-img{ 
                    border-left: 1px solid #fff;
                }
            }
        }

    }
</style>
