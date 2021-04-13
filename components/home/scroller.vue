<template>
    <div class="roll" :style="{'height':showMaxNum*50*$px2rem+'px'}">
        <div class="roll-swipe animate" :style="topHeight">
            <div v-for="(item,i) in swiperList" 
                class="roll-swipe-item" 
                @mouseover="swipeover"
                @mouseout="swipeout"
                :key="i" >
                <div class="roll-swipe-item-block"></div>
                <div class="roll-swipe-item-name">{{item.tunnelName}}</div>
                <!-- 事件 eventState 0:待解决 1：已解决 2：已归档 -1：已忽略 -->
                <!-- 设备 warningStatus 预警 0、故障处理 1、忽略 2)  -->
                <!-- 事件报警未处理 黄色，已处理绿色、 设备报警未处理 红色，已处理绿色 -->
                <div class="roll-swipe-item-des" 
                     :class="'status-' + (item.warningStatus == 0 ? 'red': (item.eventState==0?'yellow':'green'))"
                     @click="choseImg(item)">{{item.eventContent||item.warningContent}}</div>
                <div class="roll-swipe-item-time">{{(item.createdUserDate||item.warningTime)|formate}}</div>
            </div>
        </div>
        <popup-media v-model="showMediaPopup" :medias="showMedias" :img-width="700"></popup-media>
        <!-- <imgView :src="cimg" v-if="cimg" @close="cimg=''"> </imgView> -->
    </div>
</template>
<script>
    import PopupMedia from '../2d/popup-media'
    export default{
        components:{PopupMedia},
        props:{
            rolling:{
                type: Array,
                default:()=>{
                    return []
                }
            },
            showMaxNum:{
                type: Number,
                default:()=>{
                    return 9
                }
            }
        },
        watch:{
            rolling:{
                handler(val,old){
                    if (val&&val.length) {
                        this.top = 0;
                        this.timer = setInterval(() => {
                            this.scroll();
                        }, 40);
                        if(this.rolling.length < this.showMaxNum){
                            this.top = 0;
                            clearInterval(this.timer)
                        }
                        this.totalHeight = this.swiperList.length * 50;
                    }else{
                        this.swipeover()
                    }
                },
                deep: true
            }
        },
        computed:{
            topHeight () {
                return {
                    top: `${this.top}px`,
                }
          },
          swiperList() {
              let list = []
              if(this.rolling.length < this.showMaxNum){
                    list = [...this.rolling]
              }else{
                  list = [...this.rolling, ...this.rolling]
              }
            return list
          }
        },
        data(){
            return {
                totalHeight: 0,
                top: 0,
                showMediaPopup: false,
                timer:"",
                showMedias:[]
            }
        },
        methods:{
            choseImg(item){
                let img = item.eventPicture;
                this.showMediaPopup = Boolean(img);
                if(!img.includes('http')&&img){
                    img = Context.$config.baseImgUrl + img
                }
                this.showMedias = [{
                    type: "image",
                    src: img
                }]
            },
            swipeover(){
                clearInterval(this.timer)
            },
            swipeout(){
              this.timer = setInterval(() => {
                this.scroll();
              }, 40);
              if(this.rolling.length < this.showMaxNum){
                  this.top = 0;
                  clearInterval(this.timer)
              }
            },
            scroll() {
                this.top -= 1 ;
                if (-this.top>= this.totalHeight/2) {
                    this.top = 0;
                }
            }
        },
        destroyed(){
           clearInterval(this.timer)
        },
        filters:{
            formate(time){
                let date = new Date(time);
                let fix = v => String(v).length === 1 ? '0' + v : v;
                return `${fix(date.getMonth() + 1)}-${fix(date.getDate())} ${fix(date.getHours())}:${fix(date.getMinutes())}:${fix(date.getSeconds())}`;
            }
        }
    }
</script>
<style lang="less" scoped>
.roll{
    overflow: hidden;
    border-radius: 6px;
    &-swipe{
        margin-top: -50x;
        position: relative;
        z-index: 1;
        &-item:hover{
            background-color: #122272;
        }
        &-item:hover &-item-block{
            background-image: linear-gradient(to right , rgba(249, 11, 253, 0.8), rgba(38, 81, 149, 0));
        }
        &-item{
            position: relative;
            cursor: pointer;
            height: 50px;
            display: flex;
            align-items: center;
            font-size: 11px;
            color: #ffffff;
            border-bottom: 1px dotted #334BBA;
            &-block{
                position: absolute;
                display: inline-block;
                width: 60px;
                height:38px;
                background-image: linear-gradient(to right , rgba(38, 81, 149, .8), rgba(38, 81, 149, 0));
            }
            &-name{
                padding-left: 16px;
                font-size: 14px;
                width: 110px;
                font-weight:400;
                color: #C1D9FF;
                flex-shrink: 0;
            }
            &-des{
                flex: 1;
                text-align: left;
                padding: 0 10px;
                font-size: 14px;
                color: #FBB827;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            
            .status-yellow{
                color: #FBB827;
            }
            .status-red{
                color: #f56c6c;
            }
            .status-green{
                color: #67c23a;
            }
            &-time{
                padding-right: 10px;
                font-size:12px;
                font-weight:400;
                color: #C1D9FF;
                flex-shrink: 0;
            }
        }
    }
}
</style>