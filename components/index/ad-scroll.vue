<template>
    <div class="roll" :style="{'height':showMaxNum*50+'px'}">
        <div class="roll-swipe animate" :style="topHeight">
            <div v-for="(item,i) in swiperList" 
                class="roll-swipe-item" 
                @mouseover="swipeover"
                @mouseout="swipeout"
                @click="$emit('chose',item)"
                :key="i" >
                <!-- <div class="roll-swipe-item-block"></div> -->
                <div class="roll-swipe-item-name">
                    <span v-if="item.typeName" style="margin-right: 4px">[{{item.typeName}}]</span>
                    {{item.title}}
                </div>
                <div class="roll-swipe-item-des">{{item.createUserName}} | </div>
                <div class="roll-swipe-item-time">{{item.createTime}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
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
                    return 3
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
                timer:""
            }
        },
        methods:{
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
        // &-item:hover{
        //     background-color: #122272;
        // }
        // &-item:hover &-item-block{
        //     background-image: linear-gradient(to right , rgba(249, 11, 253, 0.8), rgba(38, 81, 149, 0));
        // }
        &-item{
            position: relative;
            cursor: pointer;
            height: 50px;
            margin: 0 15px;
            display: flex;
            align-items: center;
            font-size: 11px;
            color: #ffffff;
            border-bottom: 1px dotted #334BBA;
            // &-block{
            //     position: absolute;
            //     display: inline-block;
            //     width: 60px;
            //     height:38px;
            //     background-image: linear-gradient(to right , rgba(38, 81, 149, .8), rgba(38, 81, 149, 0));
            // }
            &-name{
                flex: 1;
                font-size: 14px;
                // width: 110px;
                font-weight:400;
                color: #C1D9FF;
                flex-shrink: 0;
            }
            &-des{
                text-align: right;
                padding: 0 5px;
                font-size:12px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #C1D9FF;
               /* overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;*/
            }
            &-time{
                font-size:12px;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color: #C1D9FF;
                flex-shrink: 0;
            }
        }
    }
}
</style>