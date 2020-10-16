<template>
    <div class="tunnel-cate">
        <tipsTitle title="隧道设备分类统计情况" />
        <div class="tunnel-cate-total">全部设备： {{count}}个</div>
        <div class="tunnel-cate-table">
            <template v-for="(item,i) in list">
                <div class="tunnel-cate-table-item" :key="i">
                    <div class="tunnel-cate-table-item-name">
                        <img :src="require(`@/assets/images/device/${item.classifyIcon}.png`)" alt="">
                        <span class="">{{item.classifyName}}</span>
                    </div>
                    <div class="tunnel-cate-table-item-value">{{item.count}}个</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import tipsTitle from '../index/tips-title'
    export default {
        components:{tipsTitle},
        services: [ 'tunnel', 'device'],
        props:{
            tunnelId:{
                type: [Number,String],
                default:()=>{
                    return ""
                }
            }
        },
        data(){
            return{
                list: [],
                count: 0
            }
        },
        async mounted(){
            let tunnelId = this.tunnelId || this.$route.query.tunnelId;
            this.list = await this.$service.device.getDeviceClassList({tunnelId}) || [];
            let count = 0;
            this.list.forEach(item => {
                count += Number(item.count)
            });
            this.count = count;
            console.log(count)
        },
        methods:{
           
        }
    }
</script>

<style scoped lang="less">
.tunnel-cate{
    height:612px;
    border-radius:4px;
    padding: 20px;
    border:1px solid rgba(34,76,151,1);
    &-total{
        padding: 20px 0;
        font-size:20px;
        color: #C1D9FF;
        font-family:PingFang-SC-Heavy,PingFang-SC;
    }
    &-table{
        height: 480px;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
        &-item{
            display: flex;
            align-items: center;
            width: 50%;
            // border: 1px solid #224C97;
            &-name{
                display: flex;
                align-items: center;
                height: 60px;
                border: 1px solid #224C97;
                img{
                    width: 20px;
                    height: 20px;
                    margin-right: 2px;
                }
                padding-left: 10px;
                font-size:16px;
                color:#5391F3;
                width: 124px;
                flex-shrink: 0;
            }
            &-value{
                flex: 1;
                display: flex;
                align-items: center;
                height: 60px;
                border: 1px solid #224C97;
                font-size:16px;
                color:rgba(193,217,255,1);
                padding-left: 30px;
                background:rgba(18,58,132,.7);
            }
        }
    }
}
   
</style>