<template>
    <!--其他设置 -->
    <container icon="el-icon-paperclip" title="其他">
        <div class="content">
            <div class="content-stop">
                 <span>发布事由：</span><el-select @change="change"  class="content-select" filterable v-model="otherDetail.releaseType" placeholder="选择发布事由">
                        <el-option
                        v-for="item in emergeFlagOption"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </div>
            <div class="content-play">
                <span>是否独占：</span>
               <el-switch
                class="content-select"
                v-model="otherDetail.monopoly"
                active-text="是"
                :active-value="1"
                :inactive-value="0"
                inactive-text="否">
                </el-switch>
            </div>
        </div>
    </container>
</template>

<script>
    import container from './container.vue'
    export default {
        services: [ 'index' ],
        components:{container},
        props:{
            value:{
                type:Object,
                default:()=>{
                    return {}
                }
            }
        },

        data(){
            return {
                emergeFlagOption:[],
                otherDetail:{
                    releaseTypeName:"",
                    releaseType: "",
                    monopoly: 0
                }
            }
        },
        watch:{
            otherDetail:{
                handler(val){
                    if(JSON.stringify(val)!=JSON.stringify(this.value)){
                        this.$emit('input',val)
                    }
                },
                deep: true
            },
            value:{
                handler(val={}){
                    let {releaseTypeName="",releaseType = "", monopoly = 0} = val;
                    this.otherDetail = {
                        releaseTypeName:releaseTypeName||this.otherDetail.releaseTypeName,
                        releaseType: String(releaseType) || '1',
                        monopoly:monopoly||0,
                    }
                },
                deep: true
            }
        },
        mounted(){
                let res =  JSON.parse(localStorage.getItem("contentType")||'[]');
            //  this.$service.index.getDict('contentType').then(res=>{
                 this.emergeFlagOption = res || [];
                 if(res[0]){
                     this.otherDetail.releaseTypeName = res[0].name
                     this.otherDetail.releaseType = res[0].value
                 }
            //  })
        },
        methods:{
            change(value){
                let release = this.emergeFlagOption.find((item)=>{
                    return item.value ==value
                });
                this.otherDetail.releaseTypeName = release['name']
            }
        }

    }
</script>

<style scoped lang="less">
.content{
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-stop{
        flex: 2;
        .content-select{
            width: 70%;
        }
    }
    &-play{
        margin-left: 120px;
        flex: 1;
    }
     &-select{
        margin-left: 20px;
    }
}
</style>
