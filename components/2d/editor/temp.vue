<template>
    <!--模板内容 -->
    <container icon="el-icon-document-copy" title="模板">
        <div class="flex-row">
            <template v-for="(item,i) in ModelList">
                <div class="flex-row-content"
                    :key="i">
                    <div class="flex-row-content-item" @click="choseItem(item)">
                        <img :src="require(`@/assets/images/temp${item.id}.png`)" v-if="selectIndex!=item.id">
                        <img :src="require(`@/assets/images/temp${item.id}-select.png`)"  v-else>
                    </div>
                </div>
            </template>
            <!-- 纯文字 -->
            <!-- 纯图片 -->
            <!-- 左图右文字 -->
            <!-- 左文字右图片 -->
            <!-- 上图下文字 -->
            <!-- 左图中文字右图 -->
        </div>
    </container>
</template> 

<script>
    import container from './container.vue'
    export default {
        components:{container},
        props:{
            mode:{
                type: [Number,String],
                default:()=>{
                    return '0'
                }
            }
        },
        watch:{
            mode:{
                handler(val){
                    this.selectIndex = val
                },
                deep: true,
                immediate: true
            }
        },
        data(){
            return {
                selectIndex: 0,
                ModelList: [
                    {id: 0, text: "文字"},
                    {id: 1, url: "", text: "纯图片"},
                    {id: 2, url: "",  text: "左图右文字"},
                    {id: 3, url: "", text: "左文字右图片"},
                    {id: 5, url: "", text: "上图下文字"},
                    {id: 6, url: "", text: "左图中文字右图"}
                ]
            }
        },
        methods:{
            choseItem(item={}){
                this.selectIndex = item.id;
                this.$emit('templateChange',item.id)
            }
        }
    }
</script>

<style scoped lang="less">
    .flex-row{
        display: flex;
        justify-content: space-around;
        width: 100%;
        &-content{
            cursor: pointer;
            display: flex;
            align-items: center;
            width: 100%;
            &-item{
                flex: 1;
                width: calc(100% - 60px);
                margin: 0 30px;
                img{
                    width: 100%;
                }
            }
        }
        .select{
            color: #547ede;
        }
    }
</style>
