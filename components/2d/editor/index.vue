<template>
    <div>
        <div class="device-tip" v-if="deviceList.length">
            <template v-if="deviceList.length>1">
                当前共选择 {{deviceList.length }} 个终端， 分辨率: {{resolutionPower}}
            </template>
            <template v-else-if="deviceList.length==1">
                {{deviceList[0]&&deviceList[0].name}} 分辨率: {{resolutionPower}}
            </template>
        </div>
        <div class="flex">
            <div class="jm-tips">共<span>{{tempList.length}}</span>个节目</div> 
            <el-button icon="el-icon-plus" type="primary" @click="add">新增节目</el-button>
            <!-- <el-button type="warning" icon="el-icon-eleme" @click="clearCurrent">清空当前</el-button> -->
            <el-button icon="el-icon-delete" type="warning" @click="delteCurrent">删除当前</el-button>
            <el-button icon="el-icon-delete" type="danger" @click="delteAll">删除所有</el-button>
        </div>
        <div class="flex center" v-if="tempList.length>1">
            <template v-for="(item, i) in tempList">
                <span class="item-span" :class="[currentIndex==(i+1)&&'select-item']" :key="i" @click="currentIndex=(i+1)">{{i+1}}</span>
            </template>
        </div>
         <div v-for="(item, i) in tempList" :key="i">
            <entry :obj="item" 
                    :idx="i"
                    :allowSpacing="allowSpacing"
                    :allowRowHeight="allowRowHeight" 
                    :class="[(currentIndex!=(i+1))&&'entery-hid']"
                    :show="currentIndex==(i+1)"
                    :resolutionPower="resolutionPower"
                    :ref="'entry'+i"></entry>
        </div>
    </div>
</template>

<script>

    import entry from './entry.vue'
    export default {
        services: [ 'index' ],
        components: { entry },
        props:{
            list: {
                type: Array,
                default:()=>{
                    return [{}]
                }
            },
            deviceList:{
                type: Array,
                default:()=>{
                    return [{}]
                }
            },
        },
        watch:{
            list: {
                handler(li=[]){
                    if(li.length==0){
                        this.tempList =  [{}];
                        this.currentIndex = 1;
                    }else{
                        this.tempList = li;
                    }
                },
                deep: true,
                immediate: true
            },
            deviceList:{
                handler(list,old){
                    if(JSON.stringify(list||[])!=JSON.stringify(old||[])){
                        this.handlerFBL(list)
                    }
                },
                deep:true
            }
        },
        data(){
            return {
                tempList:[{}],
                allowRowHeight: true,
                allowSpacing: true,
                resolutionPower: "96*48",// 设备分辨率
                currentIndex: 1,
                destList:[]
            }
        },
         mounted(){
            // this.$service.index.getDict("vertical").then(res=>{
            //     localStorage.setItem("vertical",JSON.stringify(res))
            // })
            // this.$service.index.getDict("horizontal").then(res=>{
            //     localStorage.setItem("horizontal",JSON.stringify(res))
            // })
            // this.$service.index.getDict("fontSize").then(res=>{
            //     localStorage.setItem("fontSize",JSON.stringify(res))
            // })
            // this.$service.index.getDict("font").then(res=>{
            //     localStorage.setItem("font",JSON.stringify(res))
            // })
            // this.$service.index.getDict("bgColor").then(res=>{
            //     localStorage.setItem("bgColor",JSON.stringify(res))
            // })
            // this.$service.index.getDict("fontColor").then(res=>{
            //     localStorage.setItem("fontColor",JSON.stringify(res))
            // })
            // this.$service.index.getDict("contentType").then(res=>{
            //     localStorage.setItem("contentType",JSON.stringify(res))
            // })

        },
        methods:{
            // 处理下分辨率
            handlerFBL(list=[]){
                let fblArr = list.map(item=>{
                    if(item.resolutionPower){
                        let wh = item.resolutionPower.split("*")
                        if(item.allowRowHeight==0){ // 1允许 0 禁止
                            this.allowRowHeight = false
                        }
                        if(item.allowSpacing==0){ // 1允许 0 禁止
                            this.allowSpacing = false
                        }
                        item.mianji = wh[0] * wh[1]
                    }
                    return item
                })
                fblArr = fblArr || []
                // 怎么样判断最小屏幕。暂时用面积最小
              let minMJ = Math.min.apply(Math, fblArr.map(o=>o.mianji))
              fblArr.forEach(item=>{
                  if(item.mianji == minMJ){
                      this.resolutionPower = item.resolutionPower;
                      console.log(`最小分辨率: ${item.resolutionPower}`)
                      return
                  }
              })
            },

            add(){
                this.tempList.push({})
            },
            clearCurrent(){
                this.$showConfirm('确认清空当前节目？').then(() => {
                    let list = JSON.parse(JSON.stringify(this.tempList||[]));
                    list[this.currentIndex-1] = {}
                    this.tempList = list;
                });
            },
            delteCurrent(){
                this.$showConfirm('确认删除当前节目？').then(() => {
                    if(this.tempList.length==1){
                        this.tempList = [{}];
                        this.currentIndex = 1;
                    }else{
                        this.tempList.splice(this.currentIndex-1,1);
                        this.currentIndex = (this.currentIndex-1) >=1?(this.currentIndex-1):this.currentIndex;
                    }
                });
            },
            delteAll(){
               this.$showConfirm('确认删除全部节目？').then(() => {
                    this.tempList = [{}];
                    this.currentIndex = 1;
                });
            },
            async getParms(){
                let data = []
                for(let i=0;i<this.tempList.length;i++){
                    data.push( this.$refs['entry'+i][0].parmsData())
                }
                data = await Promise.all(data)

                return data
            },
            getdeviceIds(){
                let deviceIds = this.deviceList.map(item=>{
                     return item.id
                })
                return deviceIds.join(",")
            },

        }

    }
</script>

<style scoped lang="less">
    .entery-hid{
        position: absolute; opacity: 0;
        z-index: -1;
    }
    .flex{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    .center{
        justify-content: center;
    }
    .jm-tips{
        font-size: 16px;
        margin-right: 10px;
        span{
            color: red
        }
    }
    .device-tip{
        margin-bottom: 15px;
    }
    .item-span{
        height: 25px;
        width: 25px;
        line-height: 25px;
        text-align: center;
        margin-left: 10px;
        border-radius: 2px;
        color: #222;
        cursor: pointer;
        border: 1px solid #bbb;
    }
    .select-item{
        background-color: green;
        border-radius: 2px;
        color: #fff;
    }
</style>
